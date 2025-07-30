import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  useColorModeValue,
  VStack,
  Icon,
  Link,
  Alert,
  AlertIcon,
  useToast,
  Flex,
} from '@chakra-ui/react';
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook, FaPlane } from 'react-icons/fa';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const toast = useToast();
  const navigate = useNavigate();
  
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation
      if (email === 'user@example.com' && password === 'password') {
        toast({
          title: 'Login Successful!',
          description: 'Welcome back to TravelApp',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top-center',
        });
        navigate('/');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    toast({
      title: `${provider} Login`,
      description: 'Social login coming soon!',
      status: 'info',
      duration: 2000,
      isClosable: true,
      position: 'top-center',
    });
  };

  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="lg" py={{ base: '12', md: '24' }} px={{ base: '0', sm: '8' }}>
        <Stack spacing="8">
          <Stack spacing="6">
            {/* Logo and Header */}
            <VStack spacing={4}>
              <Flex align="center" justify="center">
                <Icon as={FaPlane} boxSize={8} color="blue.500" mr={2} />
                <Heading size="xl" fontWeight="bold" color="blue.600">
                  TravelApp
                </Heading>
              </Flex>
              <Stack spacing={{ base: '2', md: '3' }} textAlign="center">
                <Heading size={{ base: 'md', md: 'lg' }}>
                  Log in to your account
                </Heading>
                <Text color={textColor}>
                  Start your journey with us today
                </Text>
              </Stack>
            </VStack>
          </Stack>
          
          <Box
            py={{ base: '8', sm: '8' }}
            px={{ base: '4', sm: '10' }}
            bg={cardBg}
            boxShadow={{ base: 'none', sm: 'xl' }}
            borderRadius={{ base: 'none', sm: 'xl' }}
            border="1px solid"
            borderColor={useColorModeValue('gray.200', 'gray.700')}
          >
            <Stack spacing="6">
              {error && (
                <Alert status="error" borderRadius="md">
                  <AlertIcon />
                  {error}
                </Alert>
              )}
              
              <form onSubmit={handleSubmit}>
                <Stack spacing="5">
                  <FormControl>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      size="lg"
                      borderRadius="lg"
                      _focus={{
                        borderColor: 'blue.500',
                        boxShadow: '0 0 0 1px blue.500',
                      }}
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <InputGroup size="lg">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                        borderRadius="lg"
                        _focus={{
                          borderColor: 'blue.500',
                          boxShadow: '0 0 0 1px blue.500',
                        }}
                      />
                      <InputRightElement>
                        <Button
                          variant="ghost"
                          onClick={() => setShowPassword(!showPassword)}
                          h="1.75rem"
                          size="sm"
                        >
                          <Icon as={showPassword ? FaEyeSlash : FaEye} />
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                  
                  <Stack spacing="6">
                    <Stack direction="row" align="center" justify="space-between">
                      <Text fontSize="sm" color={textColor}>
                        Demo: user@example.com / password
                      </Text>
                      <Link color="blue.500" fontSize="sm">
                        Forgot password?
                      </Link>
                    </Stack>
                    
                    <Button
                      type="submit"
                      colorScheme="blue"
                      size="lg"
                      fontSize="md"
                      isLoading={isLoading}
                      loadingText="Signing in..."
                      bgGradient="linear(to-r, blue.500, cyan.500)"
                      _hover={{
                        bgGradient: "linear(to-r, blue.600, cyan.600)",
                        transform: 'translateY(-2px)',
                        boxShadow: 'xl',
                      }}
                      borderRadius="lg"
                      transition="all 0.2s"
                    >
                      Sign in
                    </Button>
                  </Stack>
                </Stack>
              </form>
              
              <HStack>
                <Divider />
                <Text fontSize="sm" whiteSpace="nowrap" color={textColor}>
                  or continue with
                </Text>
                <Divider />
              </HStack>
              
              <Stack direction="row" spacing="3">
                <Button
                  variant="outline"
                  leftIcon={<FaGoogle />}
                  onClick={() => handleSocialLogin('Google')}
                  flex={1}
                  borderRadius="lg"
                  _hover={{
                    bg: 'red.50',
                    borderColor: 'red.300',
                    transform: 'translateY(-1px)',
                  }}
                  transition="all 0.2s"
                >
                  Google
                </Button>
                <Button
                  variant="outline"
                  leftIcon={<FaFacebook />}
                  onClick={() => handleSocialLogin('Facebook')}
                  flex={1}
                  borderRadius="lg"
                  _hover={{
                    bg: 'blue.50',
                    borderColor: 'blue.300',
                    transform: 'translateY(-1px)',
                  }}
                  transition="all 0.2s"
                >
                  Facebook
                </Button>
              </Stack>
            </Stack>
          </Box>
          
          <Stack spacing="6">
            <HStack spacing="1" justify="center">
              <Text color={textColor}>Don't have an account?</Text>
              <Link as={RouterLink} to="/register" color="blue.500" fontWeight="semibold">
                Sign up
              </Link>
            </HStack>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

export default Login;