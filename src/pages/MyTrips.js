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
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  Select,
  useDisclosure,
} from '@chakra-ui/react';
import PageContainer from '../components/PageContainer';

function MyTrips() {
  const [savedDestinations, setSavedDestinations] = useState([]);
  const [plannedTrips, setPlannedTrips] = useState([]);
  const [editTrip, SetEditTrip] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleEditClick = (trip) => {
    SetEditTrip(trip);
    onOpen();
  };

  const handleEditSave = () => {
    const updatedTrips = plannedTrips.map(trip =>
      trip.id === editTrip.id ? editTrip : trip
    );
    setPlannedTrips(updatedTrips);
    localStorage.setItem('plannedTrips', JSON.stringify(updatedTrips)); 
    onClose();
  };

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('myTrips')) || [];
    const planned = JSON.parse(localStorage.getItem('plannedTrips')) || [];
    setSavedDestinations(saved);
    setPlannedTrips(planned);
  }, []);

  const handleRemoveSaved = (id) => {
    const updated = savedDestinations.filter(dest => dest.id !== id);
    setSavedDestinations(updated);
    localStorage.setItem('myTrips', JSON.stringify(updated));
  };

  const handleRemovePlanned = (tripId) => {
    const updated = plannedTrips.filter(trip => trip.id !== tripId);
    setPlannedTrips(updated);
    localStorage.setItem('plannedTrips', JSON.stringify(updated));
  };

  const statusColor = {
    Planning: 'yellow',
    Confirmed: 'green',
    Cancelled: 'red',
  };

  const cardBg = useColorModeValue('white', 'gray.800');
  const cardShadow = useColorModeValue('md', 'dark-lg');

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
                    <Text fontSize="xs" color="gray.500">Added on {dest.dateAdded}</Text>
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
                  Depareture: {trip.departureDate || '-'} | Return: {trip.returnDate || '-'}
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
                  {trip.status === 'Planning' && (
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
        {/* Edit Modal */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent maxW={{ base: '90%', sm: '500px', md: '600px' }} mx="auto" borderRadius={'lg'}>
            <ModalHeader>Edit Trip</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Input
                placeholder="Trip Title"
                value={editTrip?.title || ''}
                onChange={(e) => SetEditTrip({ ...editTrip, title: e.target.value })}
                mb={3}
              />
              <Input
                placeholder="Departure Date"
                type="date"
                value={editTrip?.departureDate || ''}
                onChange={(e) => SetEditTrip({ ...editTrip, departureDate: e.target.value })}
                mb={3}
              />
              <Input
                placeholder="Return Date"
                type="date"
                value={editTrip?.returnDate || ''}
                onChange={(e) => SetEditTrip({ ...editTrip, returnDate: e.target.value })}
                mb={4}
              />
              <Select
                placeholder="Select Status"
                value={editTrip?.status || ''}
                onChange={(e) => SetEditTrip({ ...editTrip, status: e.target.value })}
              >
                <option value="Planning">Planning</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Cancelled">Cancelled</option>
              </Select>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={handleEditSave}>Save</Button>
              <Button ml={3} onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  </PageContainer>
  );
}

export default MyTrips;