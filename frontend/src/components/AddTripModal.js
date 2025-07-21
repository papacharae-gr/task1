import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  FormControl,
  FormLabel,
  Select,
  VStack,
  useToast
} from '@chakra-ui/react';

function AddTripModal({ isOpen, onClose, onAddTrip, defaultDestination = '' }) {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('Planning');
  const [destinations, setDestinations] = useState(defaultDestination ? [defaultDestination] : []);

  const toast = useToast();

  const handleSubmit = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (!title || !startDate || !endDate || destinations.length === 0 || end < start ) {
      toast({
        title: 'Missing or invalidfields',
        description: 'Please fill in all required fields.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top-center'
      });
      return;
    }

    const newTrip = {
      id: `${title.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`,
      title,
      departureDate: startDate,
      returnDate: endDate,
      status,
      destinations,
    };

    onAddTrip(newTrip);
    onClose();
    // Reset fields
    setTitle('');
    setStartDate('');
    setEndDate('');
    setStatus('Planning');
    setDestinations(defaultDestination ? [defaultDestination] : []);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent maxW={{ base: '90%', sm: '500px', md: '600px' }}mx="auto" borderRadius={'lg'} > 
        <ModalHeader>Add New Trip</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>Title</FormLabel>
              <Input
                placeholder="Trip title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Start Date</FormLabel>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>End Date</FormLabel>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Status</FormLabel>
              <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Planning">Planning</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Cancelled">Cancelled</option>
              </Select>
            </FormControl>

            
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Add Trip
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default AddTripModal;