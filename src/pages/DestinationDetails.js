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
import destinations from '../data/destinations.json';
import AddTripModal from '../components/AddTripModal';
import React from 'react';

function DestinationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const cardBg = useColorModeValue('white', 'gray.800');
  const sidebarBg = useColorModeValue('gray.50', 'gray.700');

  if (!id) {
    return (
      <Box px={{ base: 4, md: 10 }} py={8} maxW="1000px" mx="auto">
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
      </Box>
    );
  }     

  const destination = destinations.find(dest => dest.id === id);

  if (!destination) {
    return (
      <Box p={10}>
        <Heading size="lg">Destination Not Found</Heading>
        <Text mt={2}>Please check the URL or return to the home page.</Text>
        <Button mt={4} onClick={() => navigate('/')}>Go Home</Button>
      </Box>
    );
  }

  const handleSaveToMyTrips = () => {
    const trips = JSON.parse(localStorage.getItem('myTrips')) || [];
    const alreadyExists = trips.find(t => t.id === destination.id);

    if (!alreadyExists) {
      const newTrip = {
        ...destination,
        dateAdded: new Date().toLocaleDateString(),
      };
      localStorage.setItem('myTrips', JSON.stringify([...trips, newTrip]));
      toast({ title: 'Saved!', status: 'success', duration: 2000, isClosable: true, position: 'top-center' });
    } else {
      toast({ title: 'Already in My Trips.', status: 'info', duration: 2000, isClosable: true, position: 'top-center' });
    }
  };

  const handleAddPlannedTrip = (tripData) => {
    const plannedTrips = JSON.parse(localStorage.getItem('plannedTrips')) || [];
    localStorage.setItem('plannedTrips', JSON.stringify([...plannedTrips, tripData]));
    toast({ title: 'Trip Planned!', status: 'success', duration: 3000, isClosable: true, position: 'top-center' });
  };

  return (
    <Box px={{ base: 4, md: 10 }} py={8} maxW="1000px" mx="auto">
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
    </Box>
  );
}

export default DestinationDetails;