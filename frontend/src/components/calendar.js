import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  VStack,
  HStack,
  Button,
  Badge,
  Icon,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Stack,
  Tooltip,
  Grid,
  GridItem,
  Checkbox,
} from '@chakra-ui/react';
import { tripsAPI } from '../services/api';
import { useDisclosure } from '@chakra-ui/react';
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';

function Calendar({ plannedTrips: propTrips, onRefresh }) {
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedStatuses, setSelectedStatuses] = useState({
    planning: true,
    confirmed: true,
    cancelled: true,
  });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const calendarBg = useColorModeValue('white', 'gray.700');
  const todayBg = useColorModeValue('blue.100', 'blue.800');

  // Status configurations with colors
  const statusConfig = {
    planning: {
      color: 'orange',
      bgColor: 'orange.100',
      borderColor: 'orange.300',
      textColor: 'orange.800',
      icon: FaClock,
      label: 'Planning',
    },
    confirmed: {
      color: 'green',
      bgColor: 'green.100',
      borderColor: 'green.300',
      textColor: 'green.800',
      icon: FaCheckCircle,
      label: 'Confirmed',
    },
    cancelled: {
      color: 'red',
      bgColor: 'red.100',
      borderColor: 'red.300',
      textColor: 'red.800',
      icon: FaTimesCircle,
      label: 'Cancelled',
    },
  };

  // Fetch trips from props or API
  useEffect(() => {
    if (propTrips && propTrips.length > 0) {
      setTrips(propTrips);
    } else {
      // Fallback: try to fetch from API or use mock data
      const fetchTrips = async () => {
        try {
          const response = await tripsAPI.getPlanned();
          setTrips(response.data || []);
        } catch (error) {
          console.error('Error fetching trips:', error);
          setTrips([]);
        }
      };
      fetchTrips();
    }
  }, [propTrips]);

  // Get trips for a specific date with status filtering
  const getTripsForDate = (date) => {
    return trips.filter(trip => {
      const tripStartDate = new Date(trip.departure_date);
      const tripEndDate = new Date(trip.return_date);
      const currentDate = new Date(date);
      
      // Check if the date falls within the trip period
      const isInDateRange = currentDate >= tripStartDate && currentDate <= tripEndDate;
      
      // Check if the trip status is selected
      const statusKey = trip.status?.toLowerCase() || 'planning';
      const isStatusSelected = selectedStatuses[statusKey];
      
      return isInDateRange && isStatusSelected;
    });
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const firstDay = new Date(selectedYear, selectedMonth, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay()); // Start from Sunday

    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 42; i++) { // 6 weeks * 7 days
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = currentDate.getMonth() === selectedMonth;
      const isToday = currentDate.getTime() === today.getTime();
      const tripsOnDate = getTripsForDate(currentDate);
      
      days.push({
        date: currentDate,
        day: currentDate.getDate(),
        isCurrentMonth,
        isToday,
        trips: tripsOnDate,
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  // Get the primary status for a date (if multiple trips, show the most important)
  const getPrimaryStatusForDate = (trips) => {
    if (trips.length === 0) return null;
    
    // Priority: Confirmed > Planning > Cancelled
    const statusPriority = { 'Confirmed': 3, 'Planning': 2, 'Cancelled': 1 };
    
    const sortedTrips = trips.sort((a, b) => {
      return (statusPriority[b.status] || 0) - (statusPriority[a.status] || 0);
    });
    
    return sortedTrips[0].status;
  };

  const handleDayClick = (dayData) => {
    if (dayData.trips.length > 0) {
      // If multiple trips, show the first one (could be enhanced to show a list)
      setSelectedTrip(dayData.trips[0]);
      onOpen();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getStatusConfig = (status) => {
    const normalizedStatus = status?.toLowerCase() || 'planning';
    return statusConfig[normalizedStatus] || statusConfig.planning;
  };

  // Handle status filter change
  const handleStatusChange = (status, isChecked) => {
    setSelectedStatuses(prev => ({
      ...prev,
      [status]: isChecked
    }));
  };

  return (
    <Box
      p={{ base: 2, md: 4, lg: 3 }}
      bg={calendarBg}
      borderRadius="lg"
      boxShadow="md"
      border="1px solid"
      borderColor={borderColor}
      
      
    >
      {/* Header */}
      <VStack spacing={{ base: 2, md: 3, lg: 2 }} mb={{ base: 3, md: 4, lg: 3 }}>
        <HStack spacing={3} align="center">
          <Icon as={FaCalendarAlt} boxSize={{ base: 5, md: 6, lg: 5 }} color="blue.500" />
          <Text fontSize={{ base: "lg", md: "xl", lg: "lg" }} fontWeight="bold" color="blue.600">
            Calendar
          </Text>
        </HStack>

        {/* Month/Year Navigation */}
        <HStack spacing={2} align="center">
          <Button
            leftIcon={<FaChevronLeft />}
            onClick={() => {
              if (selectedMonth === 0) {
                setSelectedMonth(11);
                setSelectedYear(selectedYear - 1);
              } else {
                setSelectedMonth(selectedMonth - 1);
              }
            }}
            colorScheme="blue"
            variant="outline"
            size={{ base: "xs", md: "sm", lg: "xs" }}
          >
            Previous
          </Button>
          
          <Text fontSize={{ base: "md", md: "lg", lg: "md" }} fontWeight="bold" minW={{ base: "140px", md: "180px", lg: "140px" }} textAlign="center" color="blue.600">
            {months[selectedMonth]} {selectedYear}
          </Text>
          
          <Button
            rightIcon={<FaChevronRight />}
            onClick={() => {
              if (selectedMonth === 11) {
                setSelectedMonth(0);
                setSelectedYear(selectedYear + 1);
              } else {
                setSelectedMonth(selectedMonth + 1);
              }
            }}
            colorScheme="blue"
            variant="outline"
            size={{ base: "xs", md: "sm", lg: "xs" }}
          >
            Next
          </Button>
        </HStack>

        {/* Status Legend with Checkboxes */}
        <VStack spacing={3}>
          <Text fontSize={{ base: "sm", md: "md", lg: "sm" }} fontWeight="bold" color="blue.600">
            Filter by Status:
          </Text>
          <HStack spacing={{ base: 4, md: 6, lg: 4 }} wrap="wrap" justify="center">
            {Object.entries(statusConfig).map(([status, config]) => (
              <HStack key={status} spacing={2}>
                <Checkbox
                  isChecked={selectedStatuses[status]}
                  onChange={(e) => handleStatusChange(status, e.target.checked)}
                  colorScheme={config.color}
                  size="sm"
                >
                  <HStack spacing={1}>
                    <Box w={{ base: 2, lg: 2 }} h={{ base: 2, lg: 2 }} bg={config.bgColor} borderRadius="sm" border="1px solid" borderColor={config.borderColor} />
                    <Text fontSize={{ base: "2xs", md: "xs", lg: "2xs" }} color={config.textColor} fontWeight="medium">
                      {config.label}
                    </Text>
                  </HStack>
                </Checkbox>
              </HStack>
            ))}
          </HStack>
        </VStack>
      </VStack>

      {/* Calendar Grid */}
      <Box bg={calendarBg} borderRadius="lg" p={{ base: 2, md: 3, lg: 2 }} boxShadow="sm" border="1px solid" borderColor={borderColor}>
        {/* Week Days Header */}
        <Grid templateColumns="repeat(7, 1fr)" gap={{ base: 0.5, md: 1, lg: 0.5 }} mb={{ base: 2, md: 3, lg: 2 }}>
          {weekDays.map((day) => (
            <GridItem key={day}>
              <Text textAlign="center" fontWeight="bold" color="gray.600" fontSize={{ base: "2xs", md: "xs", lg: "2xs" }} py={1}>
                {day}
              </Text>
            </GridItem>
          ))}
        </Grid>

        {/* Calendar Days */}
        <Grid templateColumns="repeat(7, 1fr)" gap={{ base: 0.5, md: 1, lg: 0.5 }}>
          {calendarDays.map((dayData, index) => {
            const primaryStatus = getPrimaryStatusForDate(dayData.trips);
            const config = primaryStatus ? getStatusConfig(primaryStatus) : null;
            const hasTrips = dayData.trips.length > 0;
            
            return (
              <GridItem key={index}>
                <Tooltip 
                  label={
                    hasTrips 
                      ? `${dayData.trips.length} trip${dayData.trips.length > 1 ? 's' : ''} on this date`
                      : 'No trips scheduled'
                  }
                  placement="top"
                >
                  <Box
                    minH={{ base: "32px", md: "45px", lg: "35px" }}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="md"
                    cursor={hasTrips ? "pointer" : "default"}
                    position="relative"
                    transition="all 0.2s ease"
                    bg={
                      dayData.isToday 
                        ? todayBg
                        : hasTrips && config
                        ? config.bgColor
                        : 'transparent'
                    }
                    border="1px solid"
                    borderColor={
                      dayData.isToday
                        ? "blue.400"
                        : hasTrips && config
                        ? config.borderColor
                        : "transparent"
                    }
                    opacity={dayData.isCurrentMonth ? 1 : 0.4}
                    _hover={hasTrips ? {
                      transform: "scale(1.02)",
                      boxShadow: "sm",
                      borderColor: config?.color + ".400"
                    } : {}}
                    onClick={() => handleDayClick(dayData)}
                  >
                    <Text
                      fontSize={{ base: "xs", md: "sm", lg: "xs" }}
                      fontWeight={dayData.isToday ? "bold" : "normal"}
                      color={
                        dayData.isToday
                          ? "blue.800"
                          : hasTrips && config
                          ? config.textColor
                          : dayData.isCurrentMonth
                          ? "gray.700"
                          : "gray.400"
                      }
                    >
                      {dayData.day}
                    </Text>
                    
                    {hasTrips && (
                      <Box
                        position="absolute"
                        bottom={0.5}
                        display="flex"
                        gap={0.5}
                      >
                        {dayData.trips.slice(0, 3).map((trip, tripIndex) => {
                          const tripConfig = getStatusConfig(trip.status);
                          return (
                            <Box
                              key={tripIndex}
                              w={{ base: 1, md: 1.5, lg: 1 }}
                              h={{ base: 1, md: 1.5, lg: 1 }}
                              bg={tripConfig.color + ".500"}
                              borderRadius="full"
                            />
                          );
                        })}
                        {dayData.trips.length > 3 && (
                          <Text fontSize="3xs" color="gray.600">
                            +{dayData.trips.length - 3}
                          </Text>
                        )}
                      </Box>
                    )}
                  </Box>
                </Tooltip>
              </GridItem>
            );
          })}
        </Grid>
      </Box>

      {/* Trip Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack spacing={3}>
              <Text>{selectedTrip?.title}</Text>
              {selectedTrip && (
                <Badge
                  colorScheme={getStatusConfig(selectedTrip.status).color}
                  variant="solid"
                >
                  {selectedTrip.status}
                </Badge>
              )}
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedTrip && (
              <Stack spacing={4}>
                <VStack align="start" spacing={3}>
                  <HStack>
                    <Icon as={FaMapMarkerAlt} color="blue.500" />
                    <Text><strong>Destinations:</strong> {
                      Array.isArray(selectedTrip.destinations) 
                        ? selectedTrip.destinations.join(', ')
                        : selectedTrip.destinations || 'Not specified'
                    }</Text>
                  </HStack>
                  
                  <HStack>
                    <Icon as={FaCalendarAlt} color="blue.500" />
                    <Text><strong>Departure:</strong> {formatDate(selectedTrip.departure_date)}</Text>
                  </HStack>
                  
                  <HStack>
                    <Icon as={FaCalendarAlt} color="blue.500" />
                    <Text><strong>Return:</strong> {formatDate(selectedTrip.return_date)}</Text>
                  </HStack>
                  
                  <HStack>
                    <Icon as={FaClock} color="blue.500" />
                    <Text><strong>Duration:</strong> {
                      Math.ceil((new Date(selectedTrip.return_date) - new Date(selectedTrip.departure_date)) / (1000 * 60 * 60 * 24))
                    } days</Text>
                  </HStack>

                  <HStack>
                    <Icon as={getStatusConfig(selectedTrip.status).icon} color={getStatusConfig(selectedTrip.status).color + ".500"} />
                    <Text><strong>Status:</strong> {selectedTrip.status}</Text>
                  </HStack>
                </VStack>
              </Stack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default Calendar;