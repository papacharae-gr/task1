import React from 'react';
import {
  Card,
  CardBody,
  CardFooter,
  Image,
  Heading,
  Text,
  Button,
  HStack,
  Grid,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { Link, useNavigate } from 'react-router-dom';
import { tripsAPI } from '../services/api';

function DestinationCards({ 
  destinations, 
  showSaveButton = true, 
  onSave, // Optional custom save function
  gridColumns, // Optional custom grid
  cardClickable = true 
}) {
  const navigate = useNavigate();
  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardShadow = useColorModeValue('md', 'dark-lg');

  // Default grid responsive layout
  const defaultGridColumns = { base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' };
  const finalGridColumns = gridColumns || defaultGridColumns;

  const handleCardClick = async (dest) => {
    if (cardClickable) {
      // Increment view count when clicking on card
      try {
        // You can add view tracking API call here if needed
        // await destinationsAPI.incrementViews(dest.id);
      } catch (error) {
        console.error('Error tracking view:', error);
      }
      navigate(`/DestinationDetails/${dest.id}`);
    }
  };

  const handleSave = async (destination, event) => {
    // Prevent card click when clicking save button
    event.stopPropagation();
    
    // If a custom onSave function is provided, use it
    if (onSave) {
      await onSave(destination.id, event);
      return;
    }

    // Default save functionality
    try {
      await tripsAPI.addSaved(destination.id);
      toast({ 
        title: 'Saved!', 
        status: 'success', 
        duration: 2000, 
        isClosable: true, 
        position: 'top-center' 
      });
    } catch (error) {
      if (error.response?.status === 409) {
        toast({ 
          title: 'Already in My Trips.', 
          status: 'info', 
          duration: 2000, 
          isClosable: true, 
          position: 'top-center' 
        });
      } else {
        console.error('Error saving destination:', error);
        toast({ 
          title: 'Error saving destination', 
          status: 'error', 
          duration: 2000, 
          isClosable: true, 
          position: 'top-center' 
        });
      }
    }
  };

  const handleViewDetails = (event) => {
    // Prevent card click when clicking view details
    event.stopPropagation();
  };

  if (!destinations || destinations.length === 0) {
    return (
      <Text textAlign="center" color="gray.500" py={8}>
        No destinations found.
      </Text>
    );
  }

  return (
    <Grid
      templateColumns={finalGridColumns}
      gap={{ base: 4, md: 6, lg: 8 }}
      w="100%"
    >
      {destinations.map(dest => (
        <Card
          onClick={() => handleCardClick(dest)}
          key={dest.id}
          bg={cardBg}
          shadow={cardShadow}
          borderRadius="xl"
          overflow="hidden"
          transition="all 0.3s"
          _hover={{ transform: 'translateY(-4px)', shadow: 'xl' }}
          cursor={cardClickable ? 'pointer' : 'default'}
        >
          <Image 
            src={dest.image} 
            alt={dest.name} 
            objectFit="cover" 
            height="200px" 
            width="100%" 
          />
          <CardBody>
            <Heading size="md" mb={2}>{dest.name}</Heading>
            <Text noOfLines={3} fontSize="sm" color="gray.600">
              {dest.description}
            </Text>
            <HStack mt={3} spacing={1} align="center">
              {Array(5)
                .fill('')
                .map((_, i) => (
                  <StarIcon
                    key={i}
                    color={i < parseFloat(dest.rating) ? 'yellow.400' : 'gray.300'}
                  />
                ))}
            </HStack>
          </CardBody>
          <CardFooter justifyContent="space-between" flexDirection={{ base: "column", sm: "row" }} gap={{ base: 2, sm: 0 }}>
            <Button
              as={Link}
              to={`/DestinationDetails/${dest.id}`}
              colorScheme="blue"
              size={{ base: "md", sm: "sm" }}
              borderRadius="full"
              w={{ base: "100%", sm: "auto" }}
              onClick={handleViewDetails}
            >
              View Details
            </Button>
            {showSaveButton && (
              <Button
                onClick={(e) => handleSave(dest, e)}
                colorScheme="green"
                size={{ base: "md", sm: "sm" }}
                borderRadius="full"
                variant="outline"
                w={{ base: "100%", sm: "auto" }}
              >
                Save
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </Grid>
  );
}

export default DestinationCards;
