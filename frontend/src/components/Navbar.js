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
                    bg: 'blue.600',
                    color: 'white',
                    fontWeight: 'bold',
                    rounded: 'md',
                  }}
                  _hover={{ bg: 'whiteAlpha.200' }}
                  color="white"
                  px={4}
                  py={2}
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
                {navTabs.map(({ label, path }) => (
                  <Box
                    as={Link}
                    to={path}
                    key={path}
                    fontWeight={location.pathname.startsWith(path) ? 'bold' : 'normal'}
                    color="white"
                    fontSize="lg"
                    onClick={onClose}
                    _hover={{ color: 'teal.200' }}
                  >
                    {label}
                  </Box>
                ))}
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Flex>
    </Box>
  );
}

export default Navbar;
