import {
  Box,
  Heading,
  Text,
  VStack,
  Stack,
  Button,
  Divider,
  HStack,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const savedDestinations = [
  {
    id: 'paris',
    name: 'Paris, France',
    tagline: 'The City of Light: Romance, culture, and incredible cuisine.',
    addedDate: 'March 15, 2024',
  },
  {
    id: 'tokyo',
    name: 'Tokyo, Japan',
    tagline: 'Modern metropolis blending tradition with technology.',
    addedDate: 'March 20, 2024',
  },
];

const plannedTrips = [
  {
    title: 'Summer European Tour',
    dates: 'July 15 - August 1, 2024',
    destinations: ['Paris', 'Rome', 'Barcelona'],
    status: 'Planning',
  },
  {
    title: 'Weekend in Tokyo',
    dates: 'September 10 - September 12, 2024',
    destinations: ['Tokyo'],
    status: 'Confirmed',
  },
];

function MyTrips() {
  const boxBg = useColorModeValue('white', 'gray.800');

  return (
    <Box maxW="900px" mx="auto" px={6} py={10}>
      <Heading mb={2}>My Travel Plans</Heading>
      <Text mb={6} color="gray.500">Manage your saved destinations and planned trips</Text>

      {/* Saved Destinations */}
      <Heading size="md" color="red.600" mb={2}>📌 Saved Destinations</Heading>
      <Divider mb={4} />

      <VStack spacing={4} align="stretch" mb={8}>
        {savedDestinations.map(dest => (
          <Box key={dest.id} p={5} borderWidth="1px" borderRadius="md" bg={boxBg}>
            <Heading size="sm">{dest.name}</Heading>
            <Text fontSize="sm" color="gray.500">Added on {dest.addedDate}</Text>
            <Text fontSize="sm" mt={2}>{dest.tagline}</Text>
            <HStack mt={4}>
              <Button size="sm" colorScheme="blue" as={Link} to={`/destination/${dest.id}`}>View details</Button>
              <Button size="sm" colorScheme="red" variant="outline">Remove</Button>
            </HStack>
          </Box>
        ))}
      </VStack>

      {/* Planned Trips */}
      <Heading size="md" color="blue.600" mb={2}>🧳 Planned Trips</Heading>
      <Divider mb={4} />

      <VStack spacing={4} align="stretch">
        {plannedTrips.map((trip, idx) => (
          <Box key={idx} p={5} borderWidth="1px" borderRadius="md" bg={boxBg}>
            <Heading size="sm">{trip.title}</Heading>
            <Text fontSize="sm" color="gray.500">Date: {trip.dates}</Text>
            <Text fontSize="sm">Destinations: {trip.destinations.join(', ')}</Text>
            <Text fontSize="sm">
              Status:{" "}
              <Badge colorScheme={trip.status === 'Confirmed' ? 'green' : 'yellow'}>
                {trip.status}
              </Badge>
            </Text>
            <Button size="sm" mt={3} colorScheme="blue" variant="outline">
              {trip.status === 'Planning' ? 'Edit Trip' : 'View Itinerary'}
            </Button>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}

export default MyTrips;
