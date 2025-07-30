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
  Progress,
  Checkbox,
} from '@chakra-ui/react';
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook, FaPlane, FaCheck, FaTimes } from 'react-icons/fa';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  const toast = useToast();
  const navigate = useNavigate();
  
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  // Password strength validation
  const getPasswordStrength = () => {
    const { password } = formData;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength();
  const passwordMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (passwordStrength < 3) {
      setError('Password is too weak. Please choose a stronger password.');
      setIsLoading(false);
      return;
    }

    if (!acceptTerms) {
      setError('You must accept the terms and conditions');
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: 'Account Created Successfully!',
        description: 'Welcome to TravelApp! Please check your email to verify your account.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-center',
      });
      navigate('/login');
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    toast({
      title: `${provider} Registration`,
      description: 'Social registration coming soon!',
      status: 'info',
      duration: 2000,
      isClosable: true,
      position: 'top-center',
    });
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return 'red';
    if (passwordStrength === 3) return 'yellow';
    return 'green';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength === 3) return 'Medium';
    return 'Strong';
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
                  Create your account
                </Heading>
                <Text color={textColor}>
                  Join thousands of travelers worldwide
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
                  {/* Name Fields */}
                  <HStack spacing="4">
                    <FormControl>
                      <FormLabel htmlFor="firstName">First Name</FormLabel>
                      <Input
                        id="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="John"
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
                      <FormLabel htmlFor="lastName">Last Name</FormLabel>
                      <Input
                        id="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder="Doe"
                        required
                        size="lg"
                        borderRadius="lg"
                        _focus={{
                          borderColor: 'blue.500',
                          boxShadow: '0 0 0 1px blue.500',
                        }}
                      />
                    </FormControl>
                  </HStack>
                  
                  <FormControl>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="john.doe@example.com"
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
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        placeholder="Create a strong password"
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
                    
                    {/* Password Strength Indicator */}
                    {formData.password && (
                      <Stack spacing={2} mt={2}>
                        <HStack justify="space-between">
                          <Text fontSize="sm" color={textColor}>
                            Password strength:
                          </Text>
                          <Text fontSize="sm" color={getPasswordStrengthColor() + '.500'} fontWeight="semibold">
                            {getPasswordStrengthText()}
                          </Text>
                        </HStack>
                        <Progress
                          value={(passwordStrength / 5) * 100}
                          colorScheme={getPasswordStrengthColor()}
                          size="sm"
                          borderRadius="full"
                        />
                      </Stack>
                    )}
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                    <InputGroup size="lg">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        placeholder="Confirm your password"
                        required
                        borderRadius="lg"
                        borderColor={
                          formData.confirmPassword 
                            ? passwordMatch 
                              ? 'green.300' 
                              : 'red.300'
                            : undefined
                        }
                        _focus={{
                          borderColor: 'blue.500',
                          boxShadow: '0 0 0 1px blue.500',
                        }}
                      />
                      <InputRightElement>
                        <HStack spacing={1}>
                          {formData.confirmPassword && (
                            <Icon
                              as={passwordMatch ? FaCheck : FaTimes}
                              color={passwordMatch ? 'green.500' : 'red.500'}
                              boxSize={4}
                            />
                          )}
                          <Button
                            variant="ghost"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            h="1.75rem"
                            size="sm"
                          >
                            <Icon as={showConfirmPassword ? FaEyeSlash : FaEye} />
                          </Button>
                        </HStack>
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                  
                  <Stack spacing="6">
                    <Checkbox
                      isChecked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      colorScheme="blue"
                    >
                      <Text fontSize="sm" color={textColor}>
                        I accept the{' '}
                        <Link color="blue.500" href="#" textDecoration="underline">
                          Terms and Conditions
                        </Link>
                        {' '}and{' '}
                        <Link color="blue.500" href="#" textDecoration="underline">
                          Privacy Policy
                        </Link>
                      </Text>
                    </Checkbox>
                    
                    <Button
                      type="submit"
                      colorScheme="blue"
                      size="lg"
                      fontSize="md"
                      isLoading={isLoading}
                      loadingText="Creating account..."
                      bgGradient="linear(to-r, blue.500, cyan.500)"
                      _hover={{
                        bgGradient: "linear(to-r, blue.600, cyan.600)",
                        transform: 'translateY(-2px)',
                        boxShadow: 'xl',
                      }}
                      borderRadius="lg"
                      transition="all 0.2s"
                      isDisabled={!acceptTerms}
                    >
                      Create Account
                    </Button>
                  </Stack>
                </Stack>
              </form>
              
              <HStack>
                <Divider />
                <Text fontSize="sm" whiteSpace="nowrap" color={textColor}>
                  or register with
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
              <Text color={textColor}>Already have an account?</Text>
              <Link as={RouterLink} to="/login" color="blue.500" fontWeight="semibold">
                Sign in
              </Link>
            </HStack>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

export default Register;