import React, { useEffect, useState } from 'react';
import { destinationsAPI } from '../services/api';
import {
  Box,
  Text,
  Heading,
  Button,
  Input,
  VStack,
  HStack,
  Divider,
  useToast,
  Image,
  Badge,
  Icon,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { FaSearch, FaTimes, FaEye } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import DestinationCards from '../components/DestinationCards';

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
        // Axios επιστρέφει response.data
        setDestinations(response.data || []);
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
  const displayedDestinations = selectedDestination 
    ? [selectedDestination] 
    : destinations
    .sort((a, b) => {
      // 1. Πρώτα ταξινόμηση κατά views (υψηλότερο πρώτα)
      const viewsDiff = (parseInt(b.views) || 0) - (parseInt(a.views) || 0);
      if (viewsDiff !== 0) return viewsDiff;
      
      // 2. Αν έχουν ίδια views, ταξινόμηση κατά rating (υψηλότερο πρώτα)
      const ratingDiff = parseFloat(b.rating) - parseFloat(a.rating);
      if (ratingDiff !== 0) return ratingDiff;
      
      // 3. Αν έχουν ίδιο rating και views, ταξινόμηση αλφαβητικά
      return a.name.localeCompare(b.name);
    })
    .slice(0, 3); // Δείχνουμε τους top 3 προορισμούς

  return (
    <PageContainer>
      <Box>
        {/* Hero Section */}
        <Box bg="blue.500" color="white" py={{ base: 8, md: 12 }} px={4} textAlign="center" margin={{ base: 4, md: 12 }} borderRadius="xl">
          <VStack spacing={{ base: 4, md: 6 }}>
            
            <Text fontSize={{ base: "md", md: "lg" }}>
              Find your next adventure with our curated travel destinations
            </Text>
            <Box
              bg="white"
              borderRadius="2xl"
              px={{ base: 2, md: 4 }}
              py={{ base: 2, md: 3 }}
              boxShadow="xl"
              maxW={{ base: "100%", sm: "95%", md: "lg" }}
              w="100%"
              position="relative"
              mx="auto" // Κεντράρισμα
            >
              <HStack spacing={{ base: 2, md: 3 }} align="center">
                <Box flex="1" position="relative">
                  <InputGroup size={{ base: "sm", md: "md" }}>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FaSearch} color="gray.400" />
                    </InputLeftElement>
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
                      variant="outline"
                      borderRadius="full"
                      borderColor="gray.300"
                      focusBorderColor="blue.400"
                      bg="gray.50"
                      _hover={{ bg: "gray.100" }}
                      pl={{ base: 8, md: 10 }}
                      pr={search ? { base: 8, md: 10 } : { base: 4, md: 6 }}
                      onFocus={() => {
                        if (suggestions.length > 0) setShowSuggestions(true);
                      }}
                    />
                    {search && (
                      <InputRightElement>
                        <IconButton
                          icon={<FaTimes />}
                          size="xs"
                          variant="ghost"
                          colorScheme="gray"
                          aria-label="Clear search"
                          onClick={() => {
                            setSearch('');
                            setSelectedDestination(null);
                            setSuggestions([]);
                            setShowSuggestions(false);
                          }}
                          _hover={{ bg: "gray.200" }}
                          borderRadius="full"
                        />
                      </InputRightElement>
                    )}
                  </InputGroup>

                  {/* Enhanced Typeahead Suggestions */}
                  {showSuggestions && suggestions.length > 0 && (
                    <Box
                      position="relative"
                      top="100%"
                      left="0"
                      right="0"
                      bg="white"
                      borderRadius="lg"
                      boxShadow="xl"
                      border="1px solid"
                      borderColor="gray.200"
                      zIndex="1000"
                      maxH={{ base: "200px", md: "250px" }}
                      overflowY="auto"
                      mt={2}
                    >
                      {suggestions.map((dest) => (
                        <Box
                          key={dest.id}
                          p={3}
                          cursor="pointer"
                          _hover={{ bg: "blue.50" }}
                          _active={{ bg: "blue.100" }}
                          onClick={() => handleSuggestionClick(dest)}
                          borderBottom="1px solid"
                          borderColor="gray.100"
                          _last={{ borderBottom: "none" }}
                        >
                          <HStack spacing={3}>
                            <Image
                              src={dest.image}
                              alt={dest.name}
                              boxSize="40px"
                              borderRadius="md"
                              objectFit="cover"
                              fallback={<Box bg="gray.200" boxSize="40px" borderRadius="md" />}
                            />
                            <VStack align="start" spacing={1} flex={1}>
                              <Text fontWeight="semibold" fontSize="sm" color="gray.800">
                                {dest.name}
                              </Text>
                              <Text fontSize="xs" color="gray.500" noOfLines={1}>
                                {dest.description}
                              </Text>
                              <HStack spacing={2}>
                                <Badge colorScheme="blue" size="sm">
                                  ⭐ {dest.rating}
                                </Badge>
                                <Badge colorScheme="green" size="sm">
                                  <Icon as={FaEye} boxSize={2} mr={1} />
                                  {dest.views || 0}
                                </Badge>
                              </HStack>
                            </VStack>
                          </HStack>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>

                
              </HStack>
            </Box>

          </VStack>
        </Box>

        {/* Destinations Section */}
        <Box px={{ base: 4, md: 10 }} py={10}>
          <Heading size="lg" mb={2} color="blue.500">
            Top 3 Destinations
          </Heading>
          <Text fontSize="sm" color="gray.600" mb={4}>
            Ranked by most popular views and highest ratings
          </Text>

          <Divider borderColor="blue.500" borderWidth="2px" />
          <Divider mb={4} />
          <br />

          {displayedDestinations.length === 0 ? (
            <Text textAlign="center" color="gray.500" py={8}>
              No destinations found. Try a different search term.
            </Text>
          ) : (
            <DestinationCards 
              destinations={displayedDestinations}
            />
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