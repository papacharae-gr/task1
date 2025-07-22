import {
  Box,
  Heading,
  Text,
  Stack,
  HStack,
  VStack,
  Button,
  Icon,
  List,
  ListItem,
  ListIcon,
  SimpleGrid,
  Image,
  useColorModeValue,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { FaCheckCircle, FaMapMarkerAlt, FaUtensils } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';

import AddTripModal from '../components/AddTripModal';
import { useState, useEffect, useCallback } from 'react';
import PageContainer from '../components/PageContainer';
import { destinationsAPI, tripsAPI } from '../services/api'; // <-- Πρόσθεσε αυτό

function DestinationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [destination, setDestination] = useState(null);

  const cardBg = useColorModeValue('white', 'gray.800');
  const sidebarBg = useColorModeValue('gray.50', 'gray.700');

  const fetchDestinations = useCallback(async () => {
    try {
      const response = await destinationsAPI.getAll();
      setDestinations(response.data);
    } catch (error) {
      console.error('Error fetching destinations:', error);
      toast({
        title: 'Error fetching destinations',
        description: 'Please try again later.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-center',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);
  
  const fetchDestination = useCallback(async (destinationId) => {
    try {
      const response = await destinationsAPI.getById(destinationId);
      setDestination(response.data);
    } catch (error) {
      console.error('Error fetching destination:', error);
      setDestination(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSaveToMyTrips = async () => {
    try {
      await tripsAPI.addSaved(destination.id);
      toast({ title: 'Saved!', status: 'success', duration: 2000, isClosable: true, position: 'top-center' });
    } catch (error) {
      if (error.response?.status === 409) {
        toast({ title: 'Already in My Trips.', status: 'info', duration: 2000, isClosable: true, position: 'top-center' });
      } else {
        console.error('Error saving destination:', error);
        toast({ title: 'Error saving destination', status: 'error', duration: 2000, isClosable: true, position: 'top-center' });
      }
    }
  };

  const handleAddPlannedTrip = async (tripData) => {
    try {
      await tripsAPI.addPlanned({
        ...tripData,
        destinations: [destination.name],
      });
      
      toast({ title: 'Trip Planned!', status: 'success', duration: 3000, isClosable: true, position: 'top-center' });
    } catch (error) {
      console.error('Error adding planned trip:', error);
      toast({ title: 'Error planning trip', status: 'error', duration: 2000, isClosable: true, position: 'top-center' });
    }
  };

  useEffect(() => {
    if (id) {
      // If id exists, fetch the specific destination
      fetchDestination(id);
    } else {
      // Otherwise, fetch all destinations
      fetchDestinations();
    }
  }, [fetchDestination, fetchDestinations, id]);

  // 1. ΠΡΩΤΑ το loading
  if (loading) {
    return (
      <PageContainer>
        <Box textAlign="center" py={10}>
          <Text>Loading...</Text>
        </Box>
      </PageContainer>
    );
  }

  // 2. Αν δεν υπάρχει id, δείξε όλα τα destinations
  if (!id) {
    return (
      <PageContainer>
        <Box
          mb={8}
          py={6}
          borderRadius="xl"
          bgGradient="linear(to-r, blue.400, teal.400)"
          boxShadow="lg"
          textAlign="center"
        >
          <HStack justify="center" spacing={3}>
            <Icon as={FaMapMarkerAlt} boxSize={7} color="white" />
            <Heading size="xl" color="white" letterSpacing="wide">
              All Destinations
            </Heading>
          </HStack>
          <Text color="whiteAlpha.800" fontSize="md" mt={2}>
            Explore our curated list of amazing places around the world!
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
          {destinations.map(destination => (
            <Box key={destination.id} bg={cardBg} p={5} borderRadius="lg" shadow="md">
              <Image
                src={destination.image}
                alt={destination.name}
                borderRadius="xl"
                mb={4}
                objectFit="cover"
                height="180px"
                width="100%"
              />
              <Heading size="md" mb={2}>{destination.name}</Heading>
              <Text fontSize="sm" mb={2}>{destination.description}</Text>
              <Button
                colorScheme="blue"
                onClick={() => navigate(`/DestinationDetails/${destination.id}`)}
                mt={2}
              >
                View Details
              </Button>
            </Box>
          ))}
        </SimpleGrid>
      </PageContainer>
    );
  }

  // 3. Αν δεν βρέθηκε destination
  if (!destination) {
    return (
      <PageContainer>
        <Box textAlign="center" py={10}>
          <Heading size="lg">Destination Not Found</Heading>
          <Text mt={2}>Please check the URL or return to the home page.</Text>
          <Button mt={4} onClick={() => navigate('/')}>Go Home</Button>
        </Box>
      </PageContainer>
    );
  }

  // 4. Εμφάνιση destination details
  return (
    <PageContainer>
      {/* Header */}
      <VStack spacing={2} textAlign="center" mb={8}>
        <Heading size="xl">{destination.name}</Heading>
        <Text fontSize="lg" color="gray.500">
          {destination.tagline}
        </Text>
      </VStack>

      {/* Image */}
      <Image
        src={destination.image}
        alt={destination.name}
        borderRadius="xl"
        mb={8}
        objectFit="cover"
        height="250px"
        width="100%"
      />

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        {/* Left/Main Section */}
        <Stack spacing={6} gridColumn="span 2">
          {/* About */}
          <Box bg={cardBg} p={5} borderRadius="lg" shadow="md">
            <Heading size="md" mb={2}>About {destination.name.split(',')[0]}</Heading>
            <Text fontSize="sm">{destination.description}</Text>
          </Box>

          {/* Top Attractions */}
          <Box bg={cardBg} p={5} borderRadius="lg" shadow="md">
            <Heading size="md" mb={4}>
              <HStack><Icon as={FaMapMarkerAlt} /> <Text>Top Attractions</Text></HStack>
            </Heading>
            <List spacing={2} fontSize="sm">
              {destination.attractions.map(item => (
                <ListItem key={item}>
                  <ListIcon as={FaCheckCircle} color="green.500" />
                  {item}
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Local Cuisine */}
          <Box bg={cardBg} p={5} borderRadius="lg" shadow="md">
            <Heading size="md" mb={2}>
              <HStack><Icon as={FaUtensils} /> <Text>Local Cuisine</Text></HStack>
            </Heading>
            <Text fontSize="sm">{destination.cuisine}</Text>
          </Box>
        </Stack>

        {/* Right Sidebar */}
        <VStack spacing={4} align="stretch">
          <Box bg={sidebarBg} p={5} borderRadius="lg" shadow="md">
            <Heading size="sm" mb={3}>Trip Information</Heading>
            {Object.entries(destination.tripInfo).map(([key, value]) => (
              <Text key={key} fontSize="sm"><b>{key}:</b> {value}</Text>
            ))}
            <Text mt={3}><b>Rating:</b> ⭐ {destination.rating} / 5</Text>
          </Box>

          <Button colorScheme="blue" onClick={handleSaveToMyTrips}>
            Add to My Trip
          </Button>

          <Button colorScheme="green" variant="outline" onClick={onOpen}>
            Book Now
          </Button>

          <AddTripModal
            isOpen={isOpen}
            onClose={onClose}
            onAddTrip={handleAddPlannedTrip}
            defaultDestination={destination.name}
          />
        </VStack>
      </SimpleGrid>
    </PageContainer>
  );
}

export default DestinationDetails;