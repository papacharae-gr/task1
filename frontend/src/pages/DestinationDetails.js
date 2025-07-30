import {
  Box,
  Heading,
  Text,
  Stack,
  HStack,
  VStack,
  Button,
  Icon,
  List,
  ListItem,
  ListIcon,
  SimpleGrid,
  Image,
  useColorModeValue,
  useDisclosure,
  useToast,
  Input,
  Select,
  Flex,
  Badge,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { FaCheckCircle, FaMapMarkerAlt, FaUtensils, FaSearch, FaChevronLeft, FaChevronRight, FaEye, FaTimes } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';

import AddTripModal from '../components/AddTripModal';
import { useState, useEffect } from 'react';
import PageContainer from '../components/PageContainer';
import DestinationCards from '../components/DestinationCards';
import { destinationsAPI, tripsAPI } from '../services/api'; // <-- Πρόσθεσε αυτό

function DestinationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [destination, setDestination] = useState(null);
  
  // Search and Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('views'); // 'views', 'rating', 'alphabetical'
  const [currentPage, setCurrentPage] = useState(1);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [destinationsPerPage, setDestinationsPerPage] = useState(3);

  const cardBg = useColorModeValue('white', 'gray.800');
  const sidebarBg = useColorModeValue('gray.50', 'gray.700');

  const handleSaveToMyTrips = async () => {
    try {
      await tripsAPI.addSaved(destination.id);
      toast({ title: 'Saved!', status: 'success', duration: 2000, isClosable: true, position: 'top-center' });
    } catch (error) {
      if (error.response?.status === 409) {
        toast({ title: 'Already in My Trips.', status: 'info', duration: 2000, isClosable: true, position: 'top-center' });
      } else {
        console.error('Error saving destination:', error);
        toast({ title: 'Error saving destination', status: 'error', duration: 2000, isClosable: true, position: 'top-center' });
      }
    }
  };

  const handleAddPlannedTrip = async (tripData) => {
    try {
      await tripsAPI.addPlanned({
        ...tripData,
        destinations: [destination.name],
      });
      
      toast({ title: 'Trip Planned!', status: 'success', duration: 3000, isClosable: true, position: 'top-center' });
    } catch (error) {
      console.error('Error adding planned trip:', error);
      toast({ title: 'Error planning trip', status: 'error', duration: 2000, isClosable: true, position: 'top-center' });
    }
  };

  // Filter and sort destinations
  const getFilteredAndSortedDestinations = () => {
    let filtered = destinations.filter(dest =>
      dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort destinations
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'views':
          return (parseInt(b.views) || 0) - (parseInt(a.views) || 0);
        case 'rating':
          return parseFloat(b.rating) - parseFloat(a.rating);
        case 'alphabetical':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  };

  // Get current page destinations
  const getCurrentPageDestinations = () => {
    const filtered = getFilteredAndSortedDestinations();
    const startIndex = (currentPage - 1) * destinationsPerPage;
    const endIndex = startIndex + destinationsPerPage;
    return filtered.slice(startIndex, endIndex);
  };

  // Get total pages
  const getTotalPages = () => {
    const filtered = getFilteredAndSortedDestinations();
    return Math.ceil(filtered.length / destinationsPerPage);
  };

  // Handle search with typeahead
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
    
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
    }
  };

  // Handle suggestion selection
  const handleSuggestionClick = (destination) => {
    setSearchTerm(destination.name);
    setShowSuggestions(false);
    setCurrentPage(1);
  };

  // Handle sort change
  const handleSortChange = (value) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  // Handle results per page change
  const handleResultsPerPageChange = (value) => {
    setDestinationsPerPage(parseInt(value));
    setCurrentPage(1); // Reset to first page when changing results per page
  };

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

  useEffect(() => {
    if (id) {
      // Increment view count only once when the page loads
      const handlePageLoad = async () => {
        try {
          // First increment views
          await destinationsAPI.incrementViews(id);
          console.log('View incremented for destination:', id);
          
          // Then fetch destination data
          const response = await destinationsAPI.getById(id);
          const data = response.data;
          
          setDestination({
            ...data,
            attractions: data.attractions || [],
            cuisine: data.cuisine || 'Information not available',
            tripInfo: data.tripInfo || data.trip_info || {},
          });
        } catch (error) {
          console.error('Error loading destination:', error);
          setDestination(null);
        } finally {
          setLoading(false);
        }
      };
      
      handlePageLoad();
    } else {
      // Otherwise, fetch all destinations
      const loadAllDestinations = async () => {
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
        } finally {
          setLoading(false);
        }
      };
      
      loadAllDestinations();
    }
  }, [id, toast]); // Only depend on id and toast

  // 1. ΠΡΩΤΑ το loading
  if (loading) {
    return (
      <PageContainer>
        <Box textAlign="center" py={10}>
          <Text>Loading...</Text>
        </Box>
      </PageContainer>
    );
  }

  // 2. Αν δεν υπάρχει id, δείξε όλα τα destinations με search/filter
  if (!id) {
    const currentDestinations = getCurrentPageDestinations();
    const totalPages = getTotalPages();

    return (
      <PageContainer>
        {/* Header */}

        {/* Compact Search and Filter Bar */}
        <Box bg="white" p={4} borderRadius="xl" shadow="md" mb={6}>
          <Flex direction={{ base: "column", md: "row" }} gap={4} align={{ md: "end" }}>
            {/* Search Section */}
            <Box flex={1} position="relative">
              <Text fontSize="sm" fontWeight="semibold" mb={2} color="gray.600">
                Search Destinations
              </Text>
              <InputGroup size="md">
                <InputLeftElement pointerEvents="none">
                  <Icon as={FaSearch} color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Type to search destinations..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => {
                    if (suggestions.length > 0) setShowSuggestions(true);
                  }}
                  focusBorderColor="blue.400"
                  borderRadius="lg"
                  bg="gray.50"
                  _hover={{ bg: "white" }}
                  _focus={{ bg: "white", shadow: "sm" }}
                  pr={searchTerm ? "2.5rem" : "1rem"}
                />
                {searchTerm && (
                  <InputRightElement>
                    <IconButton
                      icon={<FaTimes />}
                      size="sm"
                      variant="ghost"
                      colorScheme="gray"
                      aria-label="Clear search"
                      onClick={() => handleSearchChange('')}
                      _hover={{ bg: "gray.100" }}
                      borderRadius="full"
                    />
                  </InputRightElement>
                )}
              </InputGroup>

              {/* Compact Typeahead Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <Box
                  position="absolute"
                  top="100%"
                  left={0}
                  right={0}
                  bg="white"
                  borderRadius="lg"
                  shadow="xl"
                  border="1px solid"
                  borderColor="gray.200"
                  zIndex={10}
                  mt={1}
                  maxH="250px"
                  overflowY="auto"
                >
                  {suggestions.map((dest) => (
                    <Box
                      key={dest.id}
                      p={2}
                      cursor="pointer"
                      _hover={{ bg: "blue.50" }}
                      onClick={() => handleSuggestionClick(dest)}
                      borderBottom="1px solid"
                      borderColor="gray.100"
                      _last={{ borderBottom: "none" }}
                    >
                      <HStack spacing={2}>
                        <Image
                          src={dest.image}
                          alt={dest.name}
                          boxSize="30px"
                          borderRadius="sm"
                          objectFit="cover"
                        />
                        <VStack align="start" spacing={0} flex={1}>
                          <Text fontWeight="semibold" fontSize="xs">
                            {dest.name}
                          </Text>
                          <HStack spacing={1}>
                            <Badge colorScheme="blue" size="xs">
                              ⭐ {dest.rating}
                            </Badge>
                            <Badge colorScheme="green" size="xs">
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

            {/* Filter Section */}
            <Box minW={{ base: "full", md: "200px" }}>
              <Text fontSize="sm" fontWeight="semibold" mb={2} color="gray.600">
                Sort By
              </Text>
              <Select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                size="md"
                focusBorderColor="blue.400"
                borderRadius="lg"
                bg="gray.50"
                _hover={{ bg: "white" }}
              >
                <option value="views">🔥 Most Popular</option>
                <option value="rating">⭐ Highest Rating</option>
                <option value="alphabetical">🔤 Alphabetical</option>
              </Select>
            </Box>

            {/* Results Per Page Section */}
            <Box minW={{ base: "full", md: "150px" }}>
              <Text fontSize="sm" fontWeight="semibold" mb={2} color="gray.600">
                Per Page
              </Text>
              <Select
                value={destinationsPerPage}
                onChange={(e) => handleResultsPerPageChange(e.target.value)}
                size="md"
                focusBorderColor="blue.400"
                borderRadius="lg"
                bg="gray.50"
                _hover={{ bg: "white" }}
              >
                <option value={3}>3 results</option>
                <option value={6}>6 results</option>
                <option value={9}>9 results</option>
                <option value={12}>12 results</option>
                <option value={15}>15 results</option>
              </Select>
            </Box>

            {/* Results Info */}
            <Box minW={{ base: "full", md: "180px" }}>
              <Text fontSize="sm" fontWeight="semibold" mb={2} color="gray.600">
                Results
              </Text>
              <Box p={2} bg="blue.50" borderRadius="lg" textAlign="center">
                <Text fontSize="sm" color="blue.700" fontWeight="bold">
                  {getFilteredAndSortedDestinations().length} found
                </Text>
                <Text fontSize="xs" color="blue.600">
                  {destinationsPerPage} per page
                </Text>
                {searchTerm && (
                  <Text fontSize="xs" color="blue.600" noOfLines={1}>
                    "{searchTerm}"
                  </Text>
                )}
              </Box>
            </Box>
          </Flex>
        </Box>

        {/* Destinations Grid */}
        {currentDestinations.length === 0 ? (
          <Box textAlign="center" py={16}>
            <Text color="gray.500" fontSize="xl" mb={2}>
              {searchTerm ? '🔍 No destinations found' : '📍 No destinations available'}
            </Text>
            <Text color="gray.400" fontSize="md">
              {searchTerm 
                ? 'Try adjusting your search terms or filters' 
                : 'Check back later for new destinations'}
            </Text>
          </Box>
        ) : (
          <DestinationCards 
            destinations={currentDestinations}
            gridColumns={{ 
              base: '1fr', 
              md: destinationsPerPage >= 6 ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
              lg: destinationsPerPage >= 9 ? 'repeat(3, 1fr)' : destinationsPerPage >= 6 ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
              xl: destinationsPerPage >= 12 ? 'repeat(4, 1fr)' : destinationsPerPage >= 9 ? 'repeat(3, 1fr)' : 'repeat(3, 1fr)'
            }}
          />
        )}

        {/* Pagination with Arrow Navigation - Always Visible */}
        <Box mt={12}>
          <Flex justify="center" align="center" gap={{ base: 2, md: 3 }} wrap="wrap">
            {/* Previous Button with Arrow */}
            <Button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || totalPages === 0}
              colorScheme="blue"
              variant="outline"
              size={{ base: "sm", md: "md" }}
              leftIcon={<FaChevronLeft />}
              borderRadius="full"
              minW={{ base: "auto", sm: "100px" }}
              px={{ base: 3, sm: 6 }}
              fontSize={{ base: "sm", md: "md" }}
              _disabled={{ opacity: 0.4, cursor: "not-allowed" }}
              _hover={{
                transform: "translateY(-1px)",
                shadow: "md"
              }}
              transition="all 0.2s"
            >
              <Text display={{ base: "none", sm: "block" }}>Previous</Text>
            </Button>

            {/* Page Numbers */}
            <HStack spacing={{ base: 1, md: 2 }} mx={{ base: 2, md: 4 }}>
              {totalPages === 0 ? (
                <Button
                  colorScheme="gray"
                  variant="outline"
                  size={{ base: "sm", md: "md" }}
                  minW={{ base: "35px", md: "45px" }}
                  h={{ base: "35px", md: "45px" }}
                  borderRadius="full"
                  fontWeight="bold"
                  fontSize={{ base: "sm", md: "md" }}
                  disabled
                >
                  0
                </Button>
              ) : (
                Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    colorScheme={currentPage === page ? "blue" : "gray"}
                    variant={currentPage === page ? "solid" : "outline"}
                    size={{ base: "sm", md: "md" }}
                    minW={{ base: "35px", md: "45px" }}
                    h={{ base: "35px", md: "45px" }}
                    borderRadius="full"
                    fontWeight="bold"
                    fontSize={{ base: "sm", md: "md" }}
                    _hover={{
                      transform: currentPage !== page ? "translateY(-2px)" : "none",
                      shadow: "md"
                    }}
                    transition="all 0.2s"
                  >
                    {page}
                  </Button>
                ))
              )}
            </HStack>

            {/* Next Button with Arrow */}
            <Button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              colorScheme="blue"
              variant="outline"
              size={{ base: "sm", md: "md" }}
              rightIcon={<FaChevronRight />}
              borderRadius="full"
              minW={{ base: "auto", sm: "80px" }}
              px={{ base: 3, sm: 6 }}
              fontSize={{ base: "sm", md: "md" }}
              _disabled={{ opacity: 0.4, cursor: "not-allowed" }}
              _hover={{
                transform: "translateY(-1px)",
                shadow: "md"
              }}
              transition="all 0.2s"
            >
              <Text display={{ base: "none", sm: "block" }}>Next</Text>
            </Button>
          </Flex>

          {/* Page Info */}
          <Text textAlign="center" mt={4} fontSize="sm" color="gray.600">
            {totalPages === 0 ? (
              "No results to paginate"
            ) : (
              <>
                Page {currentPage} of {totalPages} • 
                Showing {currentDestinations.length} of {getFilteredAndSortedDestinations().length} destinations
                ({destinationsPerPage} per page)
              </>
            )}
          </Text>
        </Box>
      </PageContainer>
    );
  }

  // 3. Αν δεν βρέθηκε destination
  if (!destination) {
    return (
      <PageContainer>
        <Box textAlign="center" py={10}>
          <Heading size="lg">Destination Not Found</Heading>
          <Text mt={2}>Please check the URL or return to the home page.</Text>
          <Button mt={4} onClick={() => navigate('/')}>Go Home</Button>
        </Box>
      </PageContainer>
    );
  }

  // 4. Εμφάνιση destination details
  return (
    <PageContainer>
      {/* Header */}
      <VStack spacing={2} textAlign="center" mb={8}>
        <Heading size="xl">{destination.name}</Heading>
        <Text fontSize="lg" color="gray.500">
          {destination.tagline}
        </Text>
      </VStack>

      {/* Image */}
      <Image
        src={destination.image}
        alt={destination.name}
        borderRadius="xl"
        mb={8}
        objectFit="cover"
        height="250px"
        width="100%"
      />

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        {/* Left/Main Section */}
        <Stack spacing={6} gridColumn="span 2">
          {/* About */}
          <Box bg={cardBg} p={5} borderRadius="lg" shadow="md">
            <Heading size="md" mb={2}>About {destination.name.split(',')[0]}</Heading>
            <Text fontSize="sm">{destination.description}</Text>
          </Box>

          {/* Top Attractions */}
          <Box bg={cardBg} p={5} borderRadius="lg" shadow="md">
            <Heading size="md" mb={4}>
              <HStack><Icon as={FaMapMarkerAlt} /> <Text>Top Attractions</Text></HStack>
            </Heading>
            <List spacing={2} fontSize="sm">
              {destination?.attractions?.map(item => (
                <ListItem key={item}>
                  <ListIcon as={FaCheckCircle} color="green.500" />
                  {item}
                </ListItem>
              )) || <Text fontSize="sm" color="gray.500">No attractions available</Text>}
            </List>
          </Box>

          {/* Local Cuisine */}
          <Box bg={cardBg} p={5} borderRadius="lg" shadow="md">
            <Heading size="md" mb={2}>
              <HStack><Icon as={FaUtensils} /> <Text>Local Cuisine</Text></HStack>
            </Heading>
            <Text fontSize="sm">{destination?.cuisine || 'Information not available'}</Text>
          </Box>
        </Stack>

        {/* Right Sidebar */}
        <VStack spacing={4} align="stretch">
          <Box bg={sidebarBg} p={5} borderRadius="lg" shadow="md">
            <Heading size="sm" mb={3}>Trip Information</Heading>
            {destination?.tripInfo || destination?.trip_info ? (
              Object.entries(destination.tripInfo || destination.trip_info).map(([key, value]) => (
                <Text key={key} fontSize="sm"><b>{key}:</b> {value}</Text>
              ))
            ) : (
              <Text fontSize="sm" color="gray.500">No trip information available</Text>
            )}
            <Text mt={3}><b>Rating:</b> ⭐ {destination?.rating || 'N/A'} / 5</Text>
          </Box>

          <Button colorScheme="blue" onClick={handleSaveToMyTrips}>
            Save Destination
          </Button>

          <Button colorScheme="green" variant="outline" onClick={onOpen}>
            Book Now
          </Button>

          <AddTripModal
            isOpen={isOpen}
            onClose={onClose}
            onAddTrip={handleAddPlannedTrip}
            defaultDestination={destination.name}
          />
        </VStack>
      </SimpleGrid>
    </PageContainer>
  );
}

export default DestinationDetails;