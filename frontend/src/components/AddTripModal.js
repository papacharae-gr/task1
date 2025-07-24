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
  useToast,
  Box
} from '@chakra-ui/react';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { FiCalendar } from 'react-icons/fi';

function AddTripModal({ isOpen, onClose, onAddTrip, defaultDestination = '' }) {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [status, setStatus] = useState('Planning');
  const [destinations, setDestinations] = useState(defaultDestination ? [defaultDestination] : []);

  const toast = useToast();

  // Format date for backend (YYYY-MM-DD)
  const formatDateForSave = (date) => {
    return date ? format(date, 'yyyy-MM-dd') : '';
  };

  const handleSubmit = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (!title || !startDate || !endDate) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all required fields.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top-center'
      });
      return;
    }

    if (startDate < today) {
      toast({
        title: 'Invalid start date',
        description: 'Start date cannot be in the past.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top-center'
      });
      return;
    }

    if (endDate < startDate) {
      toast({
        title: 'Invalid date range',
        description: 'End date must be after start date.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top-center'
      });
      return;
    }

    const newTrip = {
      title,
      departureDate: formatDateForSave(startDate),
      returnDate: formatDateForSave(endDate),
      status,
      destinations: Array.isArray(destinations) ? destinations : [destinations].filter(Boolean),
    };

    onAddTrip(newTrip);
    onClose();
    
    // Reset fields
    setTitle('');
    setStartDate(null);
    setEndDate(null);
    setStatus('Planning');
    setDestinations(defaultDestination ? [defaultDestination] : []);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent maxW={{ base: '90%', sm: '500px', md: '600px' }} mx="auto" borderRadius={'lg'} > 
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
              <Box className="datepicker-container">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Select start date"
                  minDate={new Date()}
                  className="chakra-datepicker"
                />
                <Box className="datepicker-icon">
                  <FiCalendar />
                </Box>
              </Box>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>End Date</FormLabel>
              <Box className="datepicker-container">
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Select end date"
                  minDate={startDate || new Date()}
                  className="chakra-datepicker"
                />
                <Box className="datepicker-icon">
                  <FiCalendar />
                </Box>
              </Box>
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