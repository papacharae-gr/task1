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
  Icon,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
  Fade,
} from '@chakra-ui/react';
import { FaSearch, FaTimes } from 'react-icons/fa';
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

  useEffect(() => {
    const handleClickOutside = () => setShowSuggestions(false);
    if (showSuggestions) document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showSuggestions]);

  const handleSearchChange = (value) => {
    setSearch(value);
    if (value.trim().length > 0) {
      const filtered = destinations.filter(dest =>
        dest.name.toLowerCase().includes(value.toLowerCase()) ||
        dest.description.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setSelectedDestination(null);
    }
  };

  const handleSuggestionClick = (destination) => {
    setSearch(destination.name);
    setSelectedDestination(destination);
    setShowSuggestions(false);
    navigate(`/DestinationDetails/${destination.id}`);
  };

  const handleSearchSubmit = () => {
    if (selectedDestination) {
      navigate(`/DestinationDetails/${selectedDestination.id}`);
    } else if (search.trim()) {
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
          position: 'top-center',
        });
      }
    }
  };

  const displayedDestinations = selectedDestination
    ? [selectedDestination]
    : destinations
        .sort((a, b) => {
          const viewsDiff = (parseInt(b.views) || 0) - (parseInt(a.views) || 0);
          if (viewsDiff !== 0) return viewsDiff;
          const ratingDiff = parseFloat(b.rating) - parseFloat(a.rating);
          if (ratingDiff !== 0) return ratingDiff;
          return a.name.localeCompare(b.name);
        })
        .slice(0, 3);

  return (
    <PageContainer>
      <Box>
        {/* Top Search Section */}
        <Box
          bgGradient="linear(to-r, blue.400, blue.400)"
          py={{ base: 12, md: 20 }}
          px={4}
          textAlign="center"
          borderRadius="lg"
          boxShadow="xl"
          position="relative"
        >
          <VStack spacing={6}>
            <Text fontSize="xl" fontWeight="semibold" color="whiteAlpha.900">
              Where would you like to go?
            </Text>

            <Box position="relative" width={{ base: "100%", md: "600px" }}>
              <InputGroup size="lg">
                <InputLeftElement pointerEvents="none">
                  <Icon as={FaSearch} color="blue.400" boxSize={5} />
                </InputLeftElement>
                <Input
                  placeholder="Search destinations..."
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearchSubmit();
                  }}
                  color="gray.800"
                  borderRadius="full"
                  borderColor="blue.200"
                  focusBorderColor="blue.400"
                  bg="gray.50"
                  _hover={{ bg: "gray.100" }}
                  onFocus={() => {
                    if (suggestions.length > 0) setShowSuggestions(true);
                  }}
                />
                {search && (
                  <InputRightElement>
                    <IconButton
                      icon={<FaTimes />}
                      size="sm"
                      variant="ghost"
                      colorScheme="gray"
                      aria-label="Clear search"
                      onClick={() => {
                        setSearch('');
                        setSelectedDestination(null);
                        setSuggestions([]);
                        setShowSuggestions(false);
                      }}
                    />
                  </InputRightElement>
                )}
              </InputGroup>

              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <Box
                  position="absolute"
                  top="100%"
                  left="0"
                  right="0"
                  mt={2}
                  bg="white"
                  borderRadius="lg"
                  boxShadow="2xl"
                  border="1px solid"
                  borderColor="blue.200"
                  zIndex="1000"
                  maxH="350px"
                  overflowY="auto"
                >
                  {suggestions.map((dest) => (
                    <Box
                      key={dest.id}
                      p={3}
                      cursor="pointer"
                      _hover={{ bg: "blue.50" }}
                      onClick={() => handleSuggestionClick(dest)}
                      borderBottom="1px solid"
                      borderColor="gray.100"
                      _last={{ borderBottom: "none" }}
                    >
                      <HStack spacing={3}>
                        <Image
                          src={dest.image}
                          alt={dest.name}
                          boxSize="50px"
                          borderRadius="md"
                          objectFit="cover"
                        />
                        <VStack align="start" spacing={1} flex={1}>
                          <Text fontWeight="medium" fontSize="sm" color="gray.800">
                            {dest.name}
                          </Text>
                          <Text fontSize="xs" color="gray.500" noOfLines={1}>
                            {dest.description}
                          </Text>
                          <HStack spacing={2} fontSize="xs" color="gray.600">
                            <Text>{dest.views || 0} views</Text>
                            <Text>•</Text>
                            <Text>⭐ {dest.rating}</Text>
                          </HStack>
                        </VStack>
                      </HStack>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </VStack>
        </Box>

        {/* Destinations Section */}
        <Box px={{ base: 4, md: 10 }} py={10}>
          <Heading size="lg" mb={2} color="blue.600">
            Top 3 Destinations
          </Heading>
          <Text fontSize="sm" color="gray.600" mb={4}>
            Ranked by most popular views and highest ratings
          </Text>

          <Divider borderColor="blue.400" borderWidth="2px" />
          <Divider mb={4} />
          <br />

          {displayedDestinations.length === 0 ? (
            <Text textAlign="center" color="gray.500" py={8}>
              No destinations found. Try a different search term.
            </Text>
          ) : (
            <Fade in>
              <DestinationCards destinations={displayedDestinations} />
            </Fade>
          )}

          <Box textAlign="center" mt={{ base: 6, md: 8 }}>
            <Button
              as={Link}
              to={'/DestinationDetails'}
              bgGradient="linear(to-r, blue.500, blue.700)"
              color="white"
              size="lg"
              borderRadius="full"
              fontWeight="semibold"
              px={10}
              py={6}
              _hover={{
                transform: 'translateY(-3px)',
                boxShadow: 'xl',
                bgGradient: "linear(to-r, blue.600, blue.800)"
              }}
              transition="all 0.3s ease"
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
