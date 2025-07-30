import React, { useEffect, useState, useRef } from 'react';
import { destinationsAPI } from '../services/api';
import {
  Box, Text, Heading, Button, Input, VStack, HStack, Divider, useToast, Image,
  Icon, InputGroup, InputLeftElement, InputRightElement, IconButton, Fade
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
  const searchRef = useRef();

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
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    if (showSuggestions) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
        {/* Hero Section with Search */}
        <Box
          bgGradient="linear(to-r, blue.500, cyan.400)"
          py={{ base: 16, md: 24 }}
          px={6}
          margin={6}
          textAlign="center"
          borderRadius="2xl"
          boxShadow="2xl"
          position="relative"
          // αφαιρέσαμε το overflow για να μην κόβεται το dropdown
        >
          {/* Decorative Blobs */}
          <Box
            position="absolute"
            top="-60px"
            left="-60px"
            w="220px"
            h="220px"
            bg="whiteAlpha.200"
            borderRadius="full"
            filter="blur(50px)"
          />
          <Box
            position="absolute"
            bottom="-80px"
            right="-80px"
            w="260px"
            h="260px"
            bg="whiteAlpha.300"
            borderRadius="full"
            filter="blur(70px)"
          />

          <VStack spacing={8} position="relative" zIndex="1">
            <Heading
              size="2xl"
              fontWeight="extrabold"
              color="white"
              textShadow="0 4px 12px rgba(0,0,0,0.2)"
            >
              Where would you like to go?
            </Heading>
            <Text fontSize="lg" color="whiteAlpha.900" maxW="lg">
              Discover your dream destinations with top picks and hidden gems worldwide.
            </Text>

            {/* Search Bar */}
            <Box position="relative" width={{ base: "100%", md: "600px" }} ref={searchRef}>
              <InputGroup size="lg">
                <InputLeftElement pointerEvents="none">
                  <Icon as={FaSearch} color="blue.500" boxSize={6} />
                </InputLeftElement>
                <Input
                  placeholder="Search destinations..."
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearchSubmit();
                  }}
                  bg="whiteAlpha.900"
                  backdropFilter="blur(8px)"
                  border="2px solid"
                  borderColor="whiteAlpha.600"
                  borderRadius="full"
                  color="gray.800"
                  fontSize="md"
                  pl="3rem"
                  pr="5rem"
                  _focus={{
                    borderColor: "blue.600",
                    boxShadow: "0 0 0 4px rgba(66, 153, 225, 0.3)",
                  }}
                  onFocus={() => {
                    if (suggestions.length > 0) setShowSuggestions(true);
                  }}
                />
                {search && (
                  <InputRightElement width="4rem">
                    <IconButton
                      icon={<FaTimes />}
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
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

              {/* Suggestions */}
              <Fade in={showSuggestions && suggestions.length > 0}>
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
                  zIndex="9999"
                  maxH="300px"
                  overflowY="auto"
                  px={2}
                  py={2}
                >
                  {suggestions.map((dest) => (
                    <Box
                      key={dest.id}
                      p={3}
                      cursor="pointer"
                      borderRadius="md"
                      _hover={{ bg: "blue.50" }}
                      onClick={() => handleSuggestionClick(dest)}
                      transition="background 0.2s ease"
                    >
                      <HStack spacing={4}>
                        <Image
                          src={dest.image}
                          alt={dest.name}
                          boxSize="50px"
                          borderRadius="md"
                          objectFit="cover"
                        />
                        <VStack align="start" spacing={1} flex={1}>
                          <Text fontWeight="semibold" fontSize="sm" color="gray.700">
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
              </Fade>
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
              bgGradient="linear(to-r, blue.500, cyan.500)"
              color="white"
              size="lg"
              borderRadius="full"
              fontWeight="bold"
              px={10}
              py={6}
              _hover={{
                transform: 'translateY(-4px)',
                boxShadow: '2xl',
                bgGradient: "linear(to-r, blue.600, cyan.600)"
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
