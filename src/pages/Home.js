import React, { useEffect, useState } from 'react';
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
  Flex,
  useColorModeValue,
  Divider
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import destinationsData from '../data/destinations.json';


function Home() {
  const [destinations, setDestinations] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setDestinations(destinationsData);
  }, []);

  const filteredDestinations = destinations.filter(dest =>
    dest.name.toLowerCase().includes(search.toLowerCase())
  );

  const cardBg = useColorModeValue('white', 'gray.800');
  const cardShadow = useColorModeValue('md', 'dark-lg');

  return (
    <Box>
      
      {/* Hero Section */}
      <Box bg="blue.500" color="white" py={12} px={4} textAlign="center" margin={12} borderRadius="xl">
        <VStack spacing={6} >
          <Heading size="2xl" fontWeight="bold">
            Discover Amazing Places
          </Heading>
          <Text fontSize="lg">
            Find your next adventure with our curated travel destinations
          </Text>
          <Box
            bg="white"
            borderRadius="2xl"
            px={4}
            py={3}
            boxShadow="lg"
            maxW="md"
            w="100%"
          >
            <HStack spacing={2}>
              <Input
                placeholder="Search destinations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                color="gray.800"
                variant="unstyled"
                size="md"
                px={2}
              />
              <Button colorScheme="blue" size="sm">
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
        <Divider mb={4} />
        <Divider borderColor="blue.500" borderWidth="2px" />
        <br />

        <Grid
          templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }}
          gap={8}
        >
          {filteredDestinations.map(dest => (
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
                <HStack mt={3}>
                  <Text fontWeight="bold" fontSize="sm" color="yellow.500">★</Text>
                  <Text fontSize="sm" fontWeight="medium">{dest.rating}/5</Text>
                </HStack>
              </CardBody>
              <CardFooter>
                <Button
                  as={Link}
                  to={`/DestinationDetails/${dest.id}`}
                  colorScheme="blue"
                  size="sm"
                  borderRadius="full"
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default Home;
