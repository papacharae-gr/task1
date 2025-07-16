import {
  Box,
  Heading,
  Text,
  Stack,
  HStack,
  VStack,
  Button,
  Icon,
  Divider,
  List,
  ListItem,
  ListIcon,
  SimpleGrid,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaCheckCircle, FaMapMarkerAlt, FaUtensils, FaStar } from 'react-icons/fa';

function DestinationDetails() {
  const cardBg = useColorModeValue('white', 'gray.800');

  return (
    <Box px={{ base: 4, md: 10 }} py={8} maxW="1000px" mx="auto">
      {/* Header */}
      <VStack spacing={2} textAlign="center" mb={8}>
        <Heading size="xl">Paris, France</Heading>
        <Text fontSize="lg" color="gray.500">
          The City of Light
        </Text>
      </VStack>

      {/* Image */}
      <Box
        height="250px"
        bg="gray.200"
        borderRadius="xl"
        mb={8}
        backgroundImage="url('https://ma.visamiddleeast.com/content/dam/VCOM/regional/cemea/generic-cemea/travel-with-visa/destinations/paris/marquee-travel-paris-800x450.jpg')"
        backgroundPosition="center"
      />

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        {/* Left Section */}
        <Stack spacing={6} gridColumn="span 2">
          {/* About */}
          <Box bg={cardBg} p={5} borderRadius="lg" shadow="md">
            <Heading size="md" mb={2}>About Paris</Heading>
            <Text fontSize="sm">
              Paris, the capital of France, is renowned for its art, fashion, gastronomy, and culture.
              The city is home to iconic landmarks like the Eiffel Tower, Notre-Dame Cathedral,
              and the Louvre Museum.
            </Text>
          </Box>

          {/* Top Attractions */}
          <Box bg={cardBg} p={5} borderRadius="lg" shadow="md">
            <Heading size="md" mb={4}>
              <HStack><Icon as={FaMapMarkerAlt} /> <Text>Top Attractions</Text></HStack>
            </Heading>
            <List spacing={2} fontSize="sm">
              {["Eiffel Tower", "Louvre Museum", "Notre-Dame Cathedral", "Champs-Élysées", "Montmartre"].map(item => (
                <ListItem key={item}>
                  <ListIcon as={FaCheckCircle} color="green.500" />
                  {item}
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Local Cuisine */}
          <Box bg={cardBg} p={5} borderRadius="lg" shadow="md">
            <Heading size="md" mb={2}>
              <HStack><Icon as={FaUtensils} /> <Text>Local Cuisine</Text></HStack>
            </Heading>
            <Text fontSize="sm">
              Experience authentic French cuisine including croissants, macarons, escargot, and world-class wines.
              Visit local bistros and patisseries for an unforgettable taste of Paris.
            </Text>
          </Box>
        </Stack>

        {/* Right Sidebar */}
        <VStack spacing={4} align="stretch">
          <Box bg="gray.50" p={5} borderRadius="lg" shadow="md">
            <Heading size="sm" mb={3}>Trip Information</Heading>
            <Text fontSize="sm"><b>Best Time to Visit:</b> April to October</Text>
            <Text fontSize="sm"><b>Currency:</b> Euro (€)</Text>
            <Text fontSize="sm"><b>Language:</b> French</Text>
            <Text fontSize="sm"><b>Average Cost:</b> €850-1200</Text>
          </Box>

          <Button colorScheme="blue" size="sm">Add to My Trips</Button>
          <Button colorScheme="green" size="sm" variant="outline">Book Now</Button>
        </VStack>
      </SimpleGrid>
    </Box>
  );
}

export default DestinationDetails;
