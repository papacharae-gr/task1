import {
  Box,
  Flex,
  Heading,
  Tabs,
  TabList,
  Tab,
  useColorModeValue,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import React from 'react';

const navTabs = [
  { label: 'Home', path: '/' },
  { label: 'Destinations', path: '/DestinationDetails' },
  { label: 'My Trips', path: '/MyTrips' },
];

function Navbar() {
  const location = useLocation();
  const bg = useColorModeValue('blue.600');
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Active tab index based on URL
  const activeIndex = navTabs.findIndex(tab => {
  if (tab.path === '/') {
    return location.pathname === '/';
  }
  return location.pathname.startsWith(tab.path);
});

  return (
    <Box bg={bg} px={6} py={4} shadow="md">
      <Flex justify="space-between" align="center">
        <Heading size="md" color="white">
          <Link to="/">🌍 Travel Guide</Link>
        </Heading>

        {/* Desktop Tabs */}
        <Box display={{ base: 'none', md: 'block' }}>
          <Tabs
            index={activeIndex === -1 ? 0 : activeIndex}
            variant="unstyled" // <-- removes all borders/styling
          >
            <TabList border="none">
              {navTabs.map(({ label, path }) => (
                <Tab
                  key={path}
                  as={Link}
                  to={path}
                  _selected={{
                    bg: 'white',
                    color: 'blue.600',
                    fontWeight: 'bold',
                    rounded: 'md',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 2px 2px rgba(0,0,0,0.1)',
                  }}
                  _hover={{ 
                    bg: 'blue.50',
                    color: 'blue.700',
                    transform: 'translateY(-1px)',
                    rounded: 'md',
                  }}
                  color="white"
                  px={4}
                  py={2}
                  transition="all 0.2s"
                >
                  {label}
                </Tab>
              ))}
            </TabList>
          </Tabs>
        </Box>

        {/* Mobile Hamburger */}
        <IconButton
          aria-label="Open menu"
          icon={<HamburgerIcon />}
          display={{ base: 'flex', md: 'none' }}
          onClick={onOpen}
          colorScheme="whiteAlpha"
          variant="ghost"
          fontSize="2xl"
        />

        {/* Drawer for mobile */}
        <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
          <DrawerOverlay />
          <DrawerContent bg={bg} color="white">
            <DrawerBody>
              <Flex justify="flex-end" mt={2}>
                <IconButton
                  aria-label="Close menu"
                  icon={<CloseIcon />}
                  onClick={onClose}
                  variant="ghost"
                  color="white"
                />
              </Flex>
              <VStack spacing={6} mt={8}>
                {navTabs.map(({ label, path }) => {
                  const isActive = path === '/' 
                    ? location.pathname === '/' 
                    : location.pathname.startsWith(path);
                  
                  return (
                    <Box
                      as={Link}
                      to={path}
                      key={path}
                      fontWeight={isActive ? 'bold' : 'normal'}
                      color={isActive ? 'yellow.300' : 'white'}
                      fontSize="lg"
                      onClick={onClose}
                      _hover={{ 
                        color: 'teal.200',
                        rounded: 'full',
                        bg: 'whiteAlpha.100',
                      }}
                      px={4}
                      py={2}
                      rounded="md"
                      bg={isActive ? 'whiteAlpha.200' : 'transparent'}
                      border={isActive ? '2px solid' : 'none'}
                      borderColor={isActive ? 'yellow.300' : 'transparent'}
                      transition="all 0.2s"
                    >
                      {label}
                    </Box>
                  );
                })}
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Flex>
    </Box>
  );
}

export default Navbar;
