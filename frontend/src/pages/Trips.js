import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Badge,
  Flex,
  Spacer,
  useColorModeValue,
  Grid,
  GridItem,
  Icon,
  Divider,
  Select,
  InputGroup,
  InputLeftElement,
  Input,
  useToast,
  Card,
  CardBody,
  SimpleGrid,
} from '@chakra-ui/react';
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaDownload,
  FaSearch,
  FaSort,
  FaPlane,
} from 'react-icons/fa';
import { tripsAPI } from '../services/api';
import PageContainer from '../components/PageContainer';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function Trips() {
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('departure_date');
  const [filterStatus, setFilterStatus] = useState('all');
  const toast = useToast();

  const cardBg = useColorModeValue('white', 'gray.800');
  const cardShadow = useColorModeValue('lg', 'dark-lg');

  // Status configurations
  const statusConfig = {
    Planning: {
      color: 'orange',
      bgColor: 'orange.100',
      borderColor: 'orange.300',
      textColor: 'orange.800',
      icon: FaClock,
    },
    Confirmed: {
      color: 'green',
      bgColor: 'green.100',
      borderColor: 'green.300',
      textColor: 'green.800',
      icon: FaCheckCircle,
    },
    Cancelled: {
      color: 'red',
      bgColor: 'red.100',
      borderColor: 'red.300',
      textColor: 'red.800',
      icon: FaTimesCircle,
    },
  };

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
        const response = await tripsAPI.getPlanned();
        setTrips(response.data || []);
      } catch (error) {
        console.error('Error fetching trips:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch trips',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [toast]);

  // Filter and sort trips
  useEffect(() => {
    let filtered = [...trips];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(trip =>
        trip.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.destinations?.some(dest => 
          dest.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(trip => trip.status === filterStatus);
    }

    // Sort trips
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title?.localeCompare(b.title) || 0;
        case 'status':
          return a.status?.localeCompare(b.status) || 0;
        case 'departure_date':
          return new Date(a.departure_date) - new Date(b.departure_date);
        case 'return_date':
          return new Date(a.return_date) - new Date(b.return_date);
        default:
          return 0;
      }
    });

    setFilteredTrips(filtered);
  }, [trips, searchTerm, sortBy, filterStatus]);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('el-GR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Calculate trip duration
  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.setTextColor(44, 82, 130);
    doc.text('My Trips Report', 20, 30);
    
    // Add generation date
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString('el-GR')}`, 20, 40);
    
    // Prepare table data
    const tableData = filteredTrips.map(trip => [
      trip.title || 'Untitled',
      Array.isArray(trip.destinations) ? trip.destinations.join(', ') : trip.destinations || '',
      formatDate(trip.departure_date),
      formatDate(trip.return_date),
      calculateDuration(trip.departure_date, trip.return_date) + ' days',
      trip.status || 'Unknown'
    ]);

    // Add table
    doc.autoTable({
      head: [['Title', 'Destinations', 'Departure', 'Return', 'Duration', 'Status']],
      body: tableData,
      startY: 50,
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [44, 82, 130],
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    // Save the PDF
    doc.save('my-trips-report.pdf');
    
    toast({
      title: 'Success',
      description: 'PDF report downloaded successfully!',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  if (loading) {
    return (
      <PageContainer>
        <Box textAlign="center" py={10}>
          <Text>Loading trips...</Text>
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Box px={{ base: 4, md: 8, lg: 12 }} py={6} maxW="1200px" mx="auto">
        {/* Header */}
        <VStack spacing={6} mb={8}>
          <HStack spacing={4}>
            <Icon as={FaPlane} boxSize={8} color="blue.500" />
            <Heading size="2xl" color="blue.700">All Trips</Heading>
          </HStack>
          <Text fontSize="lg" color="gray.600" textAlign="center">
            Manage and view all your travel plans in one place
          </Text>
          <Divider borderColor="blue.400" />
        </VStack>

        {/* Controls */}
        <Card mb={6} bg={cardBg} shadow={cardShadow}>
          <CardBody>
            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr", lg: "2fr 1fr 1fr 1fr" }} gap={4} alignItems="end">
              {/* Search */}
              <GridItem>
                <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.700">
                  Search Trips
                </Text>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaSearch} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder="Search by title or destination..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </GridItem>

              {/* Sort */}
              <GridItem>
                <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.700">
                  Sort By
                </Text>
                <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} icon={<FaSort />}>
                  <option value="departure_date">Departure Date</option>
                  <option value="return_date">Return Date</option>
                  <option value="title">Title</option>
                  <option value="status">Status</option>
                </Select>
              </GridItem>

              {/* Filter Status */}
              <GridItem>
                <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.700">
                  Filter Status
                </Text>
                <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="all">All Status</option>
                  <option value="Planning">Planning</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Cancelled">Cancelled</option>
                </Select>
              </GridItem>

              {/* Export */}
              <GridItem>
                <Button
                  leftIcon={<FaDownload />}
                  colorScheme="blue"
                  onClick={exportToPDF}
                  isDisabled={filteredTrips.length === 0}
                  w="full"
                >
                  Export PDF
                </Button>
              </GridItem>
            </Grid>
          </CardBody>
        </Card>

        {/* Results Count */}
        <Box mb={6}>
          <Text fontSize="lg" fontWeight="medium" color="gray.700">
            Showing {filteredTrips.length} of {trips.length} trips
          </Text>
        </Box>

        {/* Trips Grid */}
        {filteredTrips.length === 0 ? (
          <Card bg={cardBg} shadow={cardShadow}>
            <CardBody>
              <VStack spacing={4} py={10}>
                <Icon as={FaPlane} boxSize={12} color="gray.400" />
                <Text fontSize="xl" color="gray.500">
                  {trips.length === 0 ? 'No trips found' : 'No trips match your filters'}
                </Text>
                <Text color="gray.400">
                  {trips.length === 0 ? 'Start planning your next adventure!' : 'Try adjusting your search or filters'}
                </Text>
              </VStack>
            </CardBody>
          </Card>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {filteredTrips.map((trip) => {
              const config = statusConfig[trip.status] || statusConfig.Planning;
              return (
                <Card
                  key={trip.id}
                  bg={cardBg}
                  shadow={cardShadow}
                  borderRadius="xl"
                  borderWidth={2}
                  borderColor={config.borderColor}
                  _hover={{ 
                    transform: 'translateY(-4px)', 
                    shadow: '2xl',
                    borderColor: config.color + '.400'
                  }}
                  transition="all 0.3s ease"
                >
                  <CardBody p={6}>
                    <VStack align="stretch" spacing={4}>
                      {/* Header */}
                      <Flex align="center" justify="space-between">
                        <Heading size="md" color="blue.700" noOfLines={1}>
                          {trip.title || 'Untitled Trip'}
                        </Heading>
                        <Badge
                          colorScheme={config.color}
                          variant="solid"
                          px={3}
                          py={1}
                          borderRadius="full"
                          fontSize="xs"
                        >
                          <HStack spacing={1}>
                            <Icon as={config.icon} boxSize={3} />
                            <Text>{trip.status}</Text>
                          </HStack>
                        </Badge>
                      </Flex>

                      <Divider borderColor={config.borderColor} />

                      {/* Destinations */}
                      <HStack align="start" spacing={3}>
                        <Icon as={FaMapMarkerAlt} color={config.color + '.500'} mt={1} />
                        <Box flex="1">
                          <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={1}>
                            Destinations
                          </Text>
                          <Text fontSize="sm" color="gray.600" noOfLines={2}>
                            {Array.isArray(trip.destinations) 
                              ? trip.destinations.join(', ') 
                              : trip.destinations || 'Not specified'
                            }
                          </Text>
                        </Box>
                      </HStack>

                      {/* Dates */}
                      <VStack align="stretch" spacing={2}>
                        <HStack>
                          <Icon as={FaCalendarAlt} color={config.color + '.500'} />
                          <Text fontSize="sm" fontWeight="medium" color="gray.700">
                            Departure:
                          </Text>
                          <Spacer />
                          <Text fontSize="sm" color="gray.600">
                            {formatDate(trip.departure_date)}
                          </Text>
                        </HStack>
                        
                        <HStack>
                          <Icon as={FaCalendarAlt} color={config.color + '.500'} />
                          <Text fontSize="sm" fontWeight="medium" color="gray.700">
                            Return:
                          </Text>
                          <Spacer />
                          <Text fontSize="sm" color="gray.600">
                            {formatDate(trip.return_date)}
                          </Text>
                        </HStack>

                        <HStack>
                          <Icon as={FaClock} color={config.color + '.500'} />
                          <Text fontSize="sm" fontWeight="medium" color="gray.700">
                            Duration:
                          </Text>
                          <Spacer />
                          <Text fontSize="sm" color="gray.600" fontWeight="medium">
                            {calculateDuration(trip.departure_date, trip.return_date)} days
                          </Text>
                        </HStack>
                      </VStack>
                    </VStack>
                  </CardBody>
                </Card>
              );
            })}
          </SimpleGrid>
        )}
      </Box>
    </PageContainer>
  );
}

export default Trips;