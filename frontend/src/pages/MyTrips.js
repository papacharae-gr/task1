import React, { useEffect, useState } from 'react';
import { tripsAPI } from '../services/api';
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
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import EditTripModal from '../components/EditTripModal'; // <-- Import το νέο modal

function MyTrips() {
  const [savedDestinations, setSavedDestinations] = useState([]);
  const [plannedTrips, setPlannedTrips] = useState([]);
  const [editTrip, setEditTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

 


  // Function to handle editing a trip
  const handleEditClick = (trip) => {
    console.log('Editing trip:', trip);
    setEditTrip(trip);
    onOpen();
  };

  // Φόρτωση δεδομένων από API
  useEffect(() => {
    fetchSavedDestinations();
    fetchPlannedTrips();
  }, []);

  const fetchSavedDestinations = async () => {
    try {
      const response = await tripsAPI.getSaved();
      setSavedDestinations(response.data);
    } catch (error) {
      console.error('Error fetching saved destinations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlannedTrips = async () => {
    try {
      const response = await tripsAPI.getPlanned();
      setPlannedTrips(response.data);
    } catch (error) {
      console.error('Error fetching planned trips:', error);
    }
  };

  const handleRemoveSaved = async (id) => {
    try {
      await tripsAPI.removeSaved(id);
      fetchSavedDestinations();
    } catch (error) {
      console.error('Error removing saved destination:', error);
    }
  };

  const handleRemovePlanned = async (tripId) => {
    try {
      await tripsAPI.removePlanned(tripId);
      fetchPlannedTrips();
    } catch (error) {
      console.error('Error removing planned trip:', error);
    }
  };

  // Simplified save function for the modal
  const handleEditSave = async (tripData) => {
    try {
      await tripsAPI.updatePlanned(tripData.id, {
        title: tripData.title,
        departureDate: tripData.departureDate, // <-- Frontend uses camelCase
        returnDate: tripData.returnDate,       // <-- Frontend uses camelCase
        status: tripData.status,
        destinations: tripData.destinations,
      });

      await fetchPlannedTrips(); // <-- Ανανέωση λίστας
    } catch (error) {
      console.error('Error updating planned trip:', error);
      throw error; // <-- Throw για το EditTripModal
    }
  };

  const statusColor = {
    Planning: 'yellow',
    Confirmed: 'green',
    Cancelled: 'red',
  };

  const cardBg = useColorModeValue('white', 'gray.800');
  const cardShadow = useColorModeValue('md', 'dark-lg');

  if (loading) {
    return (
      <PageContainer>
        <Box textAlign="center" py={10}>
          <Text>Loading...</Text>
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Box px={{ base: 4, md: 10 }} py={4} maxW="1000px" mx="auto">
        <Heading size="2xl" color="blue.700" mb={4}>My Trips</Heading>
        <Divider borderColor="blue.400" mb={8} />

        {/* Saved Destinations */}
        <Box mb={10}>
          <Heading size="md" mb={4} color="blue.600">Saved Destinations</Heading>
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
                  <HStack spacing={4} p={4}>
                    <Image
                      src={dest.image}
                      alt={dest.name}
                      objectFit="cover"
                      boxSize="100px"
                      borderRadius="md"
                    />
                    <Box>
                      <Heading size="sm">{dest.name}</Heading>
                      <Text fontSize="sm" color="gray.600">{dest.description}</Text>
                      <Text fontSize="xs" color="gray.500">Added on {new Date(dest.date_added).toLocaleDateString('el-GR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                      </Text>
                      <HStack spacing={3} mt={2}>
                        <Button
                          as={Link}
                          to={`/DestinationDetails/${dest.id}`}
                          size="xs"
                          colorScheme="blue"
                        >
                          View Details
                        </Button>
                        <Button
                          onClick={() => handleRemoveSaved(dest.id)}
                          size="xs"
                          colorScheme="red"
                        >
                          Remove
                        </Button>
                      </HStack>
                    </Box>
                  </HStack>
                </Box>
              ))
            )}
          </VStack>
        </Box>

        {/* Planned Trips */}
        <Box>
          <Heading size="md" mb={4} color="blue.600">Planned Trips</Heading>
          <Divider borderColor="blue.400" mb={4} />
          <VStack align="stretch" spacing={6}>
            {plannedTrips.length === 0 ? (
              <Text color="gray.500">No planned trips.</Text>
            ) : (
              plannedTrips.map((trip) => (
                <Box
                  key={trip.id}
                  p={5}
                  bg={cardBg}
                  shadow={cardShadow}
                  borderRadius="xl"
                >
                  <Heading size="sm" mb={1}>{trip.title}</Heading>
                  <Text fontSize="xs" color="gray.500">
                    <Text fontSize="xs" color="gray.500">
                    Departure: {new Date(trip.departure_date).toLocaleDateString('el-GR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                    })} | Return: {new Date(trip.return_date).toLocaleDateString('el-GR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                    })}
                  </Text>

                  </Text>
                  {Array.isArray(trip.destinations) && trip.destinations.length > 0 && (
                    <Text mt={1} fontSize="sm">
                      Destinations: {trip.destinations.join(', ')}
                    </Text>
                  )}
                  <Flex align="center" mt={2}>
                    <Text fontSize="sm" mr={2}>Status:</Text>
                    <Badge colorScheme={statusColor[trip.status] || 'gray'}>{trip.status}</Badge>
                    <Spacer />
                    {(trip.status === 'Planning' || trip.status === 'Confirmed' || trip.status === 'Cancelled') && (
                      <Button size="xs" colorScheme="yellow" mr={1} onClick={() => handleEditClick(trip)}>
                        Edit
                      </Button>
                    )}
                    <Button size="xs" colorScheme="red" onClick={() => handleRemovePlanned(trip.id)}>
                      Remove
                    </Button>
                  </Flex>
                </Box>
              ))
            )}
          </VStack>
        </Box>

        {/* Edit Modal */}
        <EditTripModal
          isOpen={isOpen}
          onClose={() => {
            setEditTrip(null);
            onClose(); // Αυτό καλεί το onClose από useDisclosure
          }}
          trip={editTrip}
          onSave={handleEditSave}
        />
      </Box>
    </PageContainer>
  );
}

export default MyTrips;