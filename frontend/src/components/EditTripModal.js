import { useState, useEffect } from 'react';
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
  Button,
  FormControl,
  FormLabel,
  useToast,
  Box,
} from '@chakra-ui/react';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { parseISO, format } from 'date-fns';
import { FiCalendar } from 'react-icons/fi';

function EditTripModal({ isOpen, onClose, trip, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    departureDate: null,
    returnDate: null,
    status: 'Planning',
    destinations: [],
  });

  const toast = useToast();

  // ✅ Correctly parse ISO date strings into Date objects
  useEffect(() => {
    if (trip) {
    setFormData({
      title: trip.title || '',
      departureDate: trip.departureDate
        ? parseISO(trip.departureDate)
        : trip.departure_date
        ? parseISO(trip.departure_date)
        : null,
      returnDate: trip.returnDate
        ? parseISO(trip.returnDate)
        : trip.return_date
        ? parseISO(trip.return_date)
        : null,
      status: trip.status || 'Planning',
      destinations: trip.destinations || [],
    });
  }
}, [trip]);

  // ✅ Format date as dd/MM/yyyy (for save)
  const formatDateForSave = (date) => {
  return date ? format(date, 'yyyy-MM-dd') : '';
  };

  const handleSave = async () => {
    if (!formData.title || !formData.departureDate || !formData.returnDate) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill in all required fields.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    if (formData.returnDate < formData.departureDate) {
      toast({
        title: 'Invalid Dates',
        description: 'Return date cannot be earlier than departure date.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    try {
      await onSave({
        id: trip.id,
        title: formData.title,
        departureDate: formatDateForSave(formData.departureDate),
        returnDate: formatDateForSave(formData.returnDate),
        status: formData.status,
        destinations: formData.destinations,
      });

      toast({
        title: 'Trip Updated',
        description: 'Your trip has been updated successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });

      handleClose();
    } catch (error) {
      console.error('Error saving trip:', error);
      toast({
        title: 'Error Saving Trip',
        description: 'There was an error saving your trip. Please try again later.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent maxW={{ base: '90%', md: '600px' }} mx="auto" borderRadius="lg">
        <ModalHeader>Edit Trip</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isRequired mb={4}>
            <FormLabel>Title</FormLabel>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Trip Title"
            />
          </FormControl>

          <FormControl isRequired mb={4}>
            <FormLabel>Departure Date</FormLabel>
            <Box className="datepicker-container">
              <DatePicker
                selected={formData.departureDate}
                onChange={(date) => setFormData({ ...formData, departureDate: date })}
                dateFormat="dd/MM/yyyy"
                placeholderText="Select date"
                className="chakra-datepicker"
              />
              <Box className="datepicker-icon">
                <FiCalendar />
              </Box>
            </Box>
          </FormControl>

          <FormControl isRequired mb={4}>
            <FormLabel>Return Date</FormLabel>
            <Box className="datepicker-container">
              <DatePicker
                selected={formData.returnDate}
                onChange={(date) => setFormData({ ...formData, returnDate: date })}
                dateFormat="dd/MM/yyyy"
                placeholderText="Select date"
                minDate={formData.departureDate}
                className="chakra-datepicker"
              />
              <Box className="datepicker-icon">
                <FiCalendar />
              </Box>
            </Box>
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Status</FormLabel>
            <Select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="Planning">Planning</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Cancelled">Cancelled</option>
            </Select>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSave}>
            Save
          </Button>
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default EditTripModal;
