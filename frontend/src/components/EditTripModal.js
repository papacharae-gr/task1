import React, { useState, useEffect } from 'react';
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
} from '@chakra-ui/react';

function EditTripModal({ isOpen, onClose, trip, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    departureDate: '',
    returnDate: '',
    status: 'Planning',
    destinations: [],
  });
  const toast = useToast();

  // Populate form when trip changes
  useEffect(() => {
    console.log('Trip prop changed:', trip); // <-- Πρόσθεσε αυτό
    if (trip) {
      console.log('Setting form data with:', {
        title: trip.title,
        departureDate: trip.departure_date,
        returnDate: trip.return_date,
        status: trip.status,
        destinations: trip.destinations,
      }); // <-- Και αυτό

      setFormData({
        title: trip.title || '',
        departureDate: trip.departure_date || '',
        returnDate: trip.return_date || '',
        status: trip.status || 'Planning',
        destinations: trip.destinations || [],
      });
    }
  }, [trip]);

  const handleSave = async () => {
    // Validation
    if (!formData.title || !formData.departureDate) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all required fields.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top-center',
      });
      return;
    }

    if (formData.returnDate && formData.departureDate && 
        new Date(formData.returnDate) < new Date(formData.departureDate)) {
      toast({
        title: 'Invalid date range',
        description: 'Return date cannot be earlier than departure date.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top-center',
      });
      return;
    }

    try {
      // Call parent save function
      await onSave({
        id: trip.id,
        title: formData.title,
        departureDate: formData.departureDate,
        returnDate: formData.returnDate,
        status: formData.status,
        destinations: formData.destinations,
      });

      // Show success message
      toast({
        title: 'Trip updated successfully!',
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'top-center',
      });

      // Close modal
      handleClose();
    } catch (error) {
      console.error('Error saving trip:', error);
      toast({
        title: 'Error updating trip',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-center',
      });
    }
  };

  const handleClose = () => {
    // ΜΗΝ κάνεις reset το form εδώ - άσε το parent να το κάνει
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent maxW={{ base: '90%', sm: '500px', md: '600px' }} mx="auto" borderRadius="lg">
        <ModalHeader>Edit Trip</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isRequired mb={4}>
            <FormLabel>Trip Title</FormLabel>
            <Input
              placeholder="Trip Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </FormControl>

          <FormControl isRequired mb={4}>
            <FormLabel>Departure Date</FormLabel>
            <Input
              type="date"
              value={formData.departureDate}
              onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Return Date</FormLabel>
            <Input
              type="date"
              value={formData.returnDate}
              onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
              min={formData.departureDate || ''}
            />
          </FormControl>

          <FormControl>
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
          <Button colorScheme="blue" onClick={handleSave} mr={3}>
            Save Changes
          </Button>
          <Button onClick={handleClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default EditTripModal;