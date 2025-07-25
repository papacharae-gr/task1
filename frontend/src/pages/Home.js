import React, { useEffect, useState } from 'react';
import { destinationsAPI, tripsAPI } from '../services/api'; // <-- Πρόσθεσε αυτό
import {
  Box,
  Grid,
  Image,
  Text,
  Heading,
  Button,
  Input,
  VStack,
  Card,
  CardBody,
  CardFooter,
  HStack,
  useColorModeValue,
  Divider,
  useToast,
  List,
  ListItem,
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { Link, useNavigate } from 'react-router-dom';
import PageContainer from '../components/PageContainer';

function Home() {
  const [destinations, setDestinations] = useState([]);
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await destinationsAPI.getAll();
        setDestinations(response.data);
      } catch (error) {
        console.error('Error fetching destinations:', error);
        toast({
          title: 'Error fetching destinations',
          description: 'Please try again later.',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-center',
        });
      }
    };

    fetchDestinations();
  }, [toast]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowSuggestions(false);
    };

    if (showSuggestions) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showSuggestions]);

  // Handle search input changes and show suggestions
  const handleSearchChange = (value) => {
    setSearch(value);
    
    if (value.trim().length > 0) {
      const filtered = destinations.filter(dest =>
        dest.name.toLowerCase().includes(value.toLowerCase()) ||
        dest.description.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5); // Show max 5 suggestions
      
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setSelectedDestination(null);
    }
  };

  // Handle suggestion selection
  const handleSuggestionClick = (destination) => {
    setSearch(destination.name);
    setSelectedDestination(destination);
    setShowSuggestions(false);
    // Πήγαινε αμέσως στη σελίδα του προορισμού
    navigate(`/DestinationDetails/${destination.id}`);
  };

  // Handle search button click
  const handleSearchSubmit = () => {
    if (selectedDestination) {
      // Navigate to the selected destination details page
      navigate(`/DestinationDetails/${selectedDestination.id}`);
    } else if (search.trim()) {
      // If no selection but there's text, try to find exact match
      const exactMatch = destinations.find(dest => 
        dest.name.toLowerCase() === search.toLowerCase()
      );
      if (exactMatch) {
        navigate(`/DestinationDetails/${exactMatch.id}`);
      } else {
        toast({
          title: 'Destination not found',
          description: 'Please select a destination from the suggestions.',
          status: 'warning',
          duration: 3000,
          isClosable: true,
          position: 'top-center'
        });
      }
    }
  };

  // Οι προορισμοί παραμένουν σταθεροί - δείχνουμε πάντα τους καλύτερους
  const displayedDestinations = destinations
    .sort((a, b) => {
      if (parseFloat(b.rating) !== parseFloat(a.rating)) {
        return parseFloat(b.rating) - parseFloat(a.rating);
      }
      return a.name.localeCompare(b.name);
    })
    .slice(0, 3); // Δείχνουμε πάντα τους top 6 προορισμούς

  const handleSave = async (destination) => {
    try {
      await tripsAPI.addSaved(destination.id);
      
      toast({
        title: 'Saved to My Trips',
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'top-center'
      });
    } catch (error) {
      if (error.response?.status === 409) {
        toast({
          title: 'Already saved',
          status: 'info',
          duration: 2000,
          isClosable: true,
          position: 'top-center',
        });
      } else {
        console.error('Error saving destination:', error);
        toast({
          title: 'Error saving destination',
          description: 'Please try again later.',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-center'
        });
      }
    }
  };

  const cardBg = useColorModeValue('white', 'gray.800');
  const cardShadow = useColorModeValue('md', 'dark-lg');

  return (
    <PageContainer>
      <Box>
        {/* Hero Section */}
        <Box bg="blue.500" color="white" py={{ base: 8, md: 12 }} px={4} textAlign="center" margin={{ base: 4, md: 12 }} borderRadius="xl">
          <VStack spacing={{ base: 4, md: 6 }}>
            <Heading size={{ base: "xl", md: "2xl" }} fontWeight="bold">
              Discover Amazing Places
            </Heading>
            <Text fontSize={{ base: "md", md: "lg" }}>
              Find your next adventure with our curated travel destinations
            </Text>
            <Box
              bg="white"
              borderRadius="2xl"
              px={{ base: 3, md: 4 }}
              py={3}
              boxShadow="lg"
              maxW={{ base: "90%", md: "md" }}
              w="100%"
              position="relative"
            >
              <HStack spacing={2}>
                <Box flex="1" position="relative">
                  <Input
                    placeholder="Search destinations..."
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearchSubmit();
                      } else if (e.key === 'Escape') {
                        setShowSuggestions(false);
                      }
                    }}
                    color="gray.800"
                    variant="unstyled"
                    size="md"
                    px={2}
                    onFocus={() => {
                      if (suggestions.length > 0) setShowSuggestions(true);
                    }}
                  />
                  
                  {/* Autocomplete suggestions - τώρα κάτω από το input */}
                  {showSuggestions && suggestions.length > 0 && (
                    <Box
                      position="absolute"
                      top="100%"
                      left="0"
                      right="0"
                      bg="white"
                      borderRadius="md"
                      boxShadow="lg"
                      border="1px solid"
                      borderColor="gray.200"
                      zIndex="1000"
                      maxH={{ base: "150px", md: "200px" }}
                      overflowY="auto"
                      mt={1}
                      mx={{ base: -2, md: 0 }} // Για καλύτερη εμφάνιση σε κινητά
                    >
                      <List spacing={0}>
                        {suggestions.map((dest) => (
                          <ListItem
                            key={dest.id}
                            px={{ base: 3, md: 4 }}
                            py={{ base: 3, md: 2 }}
                            cursor="pointer"
                            _hover={{ bg: "blue.50" }}
                            _active={{ bg: "blue.100" }} // Για touch feedback σε κινητά
                            borderBottom="1px solid"
                            borderColor="gray.100"
                            onClick={() => handleSuggestionClick(dest)}
                            minH={{ base: "50px", md: "auto" }} // Μεγαλύτερα touch targets για κινητά
                          >
                            <Text fontSize={{ base: "md", md: "sm" }} fontWeight="medium" color="gray.800">
                              {dest.name}
                            </Text>
                            <Text fontSize={{ base: "sm", md: "xs" }} color="gray.500" noOfLines={1}>
                              {dest.description}
                            </Text>
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                </Box>
                
                <Button 
                  colorScheme="blue" 
                  size={{ base: "md", md: "sm" }}
                  onClick={handleSearchSubmit}
                  disabled={!search.trim()}
                  minW={{ base: "80px", md: "auto" }}
                >
                  Search
                </Button>
              </HStack>
            </Box>
          </VStack>
        </Box>

        {/* Destinations Section */}
        <Box px={{ base: 4, md: 10 }} py={10}>
          <Heading size="lg" mb={4} color="blue.500">
            Popular Destinations
          </Heading>

          <Divider borderColor="blue.500" borderWidth="2px" />
          <Divider mb={4} />
          <br />

          {displayedDestinations.length === 0 ? (
            <Text textAlign="center" color="gray.500" py={8}>
              No destinations found. Try a different search term.
            </Text>
          ) : (
            <Grid
              templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
              gap={{ base: 4, md: 6, lg: 8 }}
            >
              {displayedDestinations.map(dest => (
                <Card
                  key={dest.id}
                  bg={cardBg}
                  shadow={cardShadow}
                  borderRadius="xl"
                  overflow="hidden"
                  transition="all 0.3s"
                  _hover={{ transform: 'translateY(-4px)', shadow: 'xl' }}
                >
                  <Image src={dest.image} alt={dest.name} objectFit="cover" height="200px" width="100%" />
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
                    >
                      View Details
                    </Button>
                    <Button
                      onClick={() => handleSave(dest)}
                      colorScheme="green"
                      size={{ base: "md", sm: "sm" }}
                      borderRadius="full"
                      variant="outline"
                      w={{ base: "100%", sm: "auto" }}
                    >
                      Save
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </Grid>
          )}
          <Box textAlign="center" mt={{ base: 6, md: 8 }}>
            <Button
              as={Link}
              to={'/DestinationDetails'}
              colorScheme="teal"
              size={{ base: "md", md: "lg" }}
              borderRadius="full"
              fontSize={{ base: "sm", md: "md" }}
              px={{ base: 6, md: 8 }}
              py={{ base: 4, md: 6 }}
              w={{ base: "90%", md: "auto" }}
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'lg'
              }}
              transition="all 0.2s"
            >
              View More Destinations
            </Button>
          </Box>
        </Box>
      </Box>
    </PageContainer>
  );
}

export default Home;