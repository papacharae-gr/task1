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
} from '@chakra-ui/react';
import { FaCheckCircle, FaMapMarkerAlt, FaUtensils } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import destinations from '../data/destinations.json';

function DestinationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const cardBg = useColorModeValue('white', 'gray.800');
  const sidebarBg = useColorModeValue('gray.50', 'gray.700');

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

          <Button
            colorScheme="blue"
            onClick={() => {
            const trips = JSON.parse(localStorage.getItem('myTrips')) || [];
            const alreadyExists = trips.find(t => t.id === destination.id);

            if (!alreadyExists) {
            const newTrip = {
            ...destination,
            dateAdded: new Date().toISOString(),
            };
            localStorage.setItem('myTrips', JSON.stringify([...trips, newTrip]));
            alert('Destination added to My Trips!');
            } else {
            alert('Already added to My Trips!');
              }
            }}
            >
             Add to My Trip
          </Button>
          <Button colorScheme="green" size="sm" variant="outline"
          onClick={() => {
            const plannedTrips = JSON.parse(localStorage.getItem('plannedTrips')) || [];
            const alreadyPlanned = plannedTrips.find(t => t.id === destination.id);

            if (!alreadyPlanned) {
              const newPlan = {
                ...destination,
                datePlanned: new Date().toISOString(),
              };
              localStorage.setItem('plannedTrips', JSON.stringify([...plannedTrips, newPlan]));
              alert('Destination added to Planned Trips!');
            } else {
              alert('Already planned this trip!');
            }
          }}
          >Book Now</Button>
        </VStack>
      </SimpleGrid>
    </Box>
  );
}

export default DestinationDetails;
