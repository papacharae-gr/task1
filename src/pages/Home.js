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
  useColorModeValue
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
    <Box px={{ base: 4, md: 10 }} py={8}>
      <VStack spacing={6} align="stretch">
        <VStack spacing={2}>
          <Heading size="2xl" textAlign="center">
            Discover Amazing Places
          </Heading>
          <Text fontSize="lg" textAlign="center" color="gray.500">
            Find your next adventure with our curated travel destinations
          </Text>
        </VStack>

        <Flex justify="center">
          <Input
            maxW="500px"
            placeholder="Search destinations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            variant="filled"
            size="lg"
            borderRadius="xl"
          />
        </Flex>

        <Heading size="lg" mt={6}>
          Popular Destinations
        </Heading>

        <Grid
          templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }}
          gap={8}
          pt={4}
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
                <Text mt={3} fontWeight="semibold" fontSize="sm">
                  ⭐ {dest.rating}/5
                </Text>
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
      </VStack>
    </Box>
  );
}

export default Home;
