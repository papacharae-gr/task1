import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Divider,
  Button,
  Badge,
  Flex,
  Spacer,
  Image,
  useColorModeValue
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';

function MyTrips() {
  const [savedDestinations, setSavedDestinations] = useState([]);
  const [plannedTrips, setPlannedTrips] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('myTrips')) || [];
    const planned = JSON.parse(localStorage.getItem('plannedTrips')) || [];
    setSavedDestinations(saved);
    setPlannedTrips(planned);
  }, []);

  const handleRemove = (id) => {
    const updated = savedDestinations.filter(dest => dest.id !== id);
    setSavedDestinations(updated);
    localStorage.setItem('myTrips', JSON.stringify(updated));
  };

  const statusColor = {
    Planning: 'yellow',
    Confirmed: 'green',
    Cancelled: 'red',
  };

  const cardBg = useColorModeValue('white', 'gray.800');
  const cardShadow = useColorModeValue('md', 'dark-lg');

  return (
    <Box px={{ base: 50, md: 10 }} py={4} maxW="1000px" mx="auto">
      <Heading size="2xl" color="blue.700" mb={4}>My Trips</Heading>
      <Divider borderColor="blue.400" mb={8} />

      {/* Saved Destinations */}
      <Box mb={10} >
        <Heading size="md" mb={4} color="gray.700">Saved Destinations</Heading>
        <VStack align="stretch" spacing={6}>
          {savedDestinations.length === 0 ? (
            <Text color="gray.500">No saved destinations.</Text>
          ) : (
            savedDestinations.map(dest => (
              <Box
                key={dest.id}
                bg={cardBg}
                shadow={cardShadow}
                borderRadius="xl"
                overflow="hidden"
              >
                <Image src={dest.image} alt={dest.name} borderRadius="xl" mb={8} objectFit="cover" width="100%" height="250px" />
                <Box p={6}>
                  <Heading size="md" mb={2}>{dest.name}</Heading>
                  <Text fontSize="sm" color="gray.600" mb={2}>{dest.description}</Text>
                  <Text fontSize="xs" color="gray.500" mb={3}>Added on {dest.date}</Text>
                  <HStack spacing={3}>
                    <Button as={Link} to={`/DestinationDetails/${dest.id}`} size="sm" colorScheme="blue">
                      View details
                    </Button>
                    <Button onClick={() => handleRemove(dest.id)} size="sm" colorScheme="red">
                      Remove
                    </Button>
                  </HStack>
                </Box>
              </Box>
            ))
          )}
        </VStack>
      </Box>

      {/* Planned Trips */}
      <Box>
        <Heading size="md" mb={4} color="gray.700">Planned Trips</Heading>
        <Divider borderColor="blue.400" mb={4} />
        <VStack align="stretch" spacing={6}>
          {plannedTrips.length === 0 ? (
            <Text color="gray.500">No planned trips.</Text>
          ) : (
            plannedTrips.map((trip, index) => (
              <Box
                key={index}
                p={5}
                bg={cardBg}
                shadow={cardShadow}
                borderRadius="xl"
              >
                <Heading size="sm" mb={1}>{trip.title}</Heading>
                <Text fontSize="xs" color="gray.500">Date: {trip.date}</Text>
                <Text mt={1} fontSize="sm">Destinations: {trip.destinations.join(', ')}</Text>
                <Flex align="center" mt={2}>
                  <Text fontSize="sm" mr={2}>Status:</Text>
                  <Badge colorScheme={statusColor[trip.status] || 'gray'}>{trip.status}</Badge>
                  <Spacer />
                  <Button size="sm" colorScheme="blue">Edit trip</Button>
                </Flex>
              </Box>
            ))
          )}
        </VStack>
      </Box>
    </Box>
  );
}

export default MyTrips;