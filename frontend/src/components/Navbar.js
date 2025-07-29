import {
  Box,
  Flex,
  Heading,
  Tabs,
  TabList,
  Tab,
  useColorModeValue,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { HamburgerIcon } from '@chakra-ui/icons';
import React from 'react';

const navTabs = [
  { label: 'Home', path: '/' },
  { label: 'Destinations', path: '/DestinationDetails' },
  { label: 'My Trips', path: '/MyTrips' },
];

function Navbar() {
  const location = useLocation();
  const bg = useColorModeValue('blue.600');

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
            variant="unstyled"
          >
            <TabList>
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

        {/* Mobile Dropdown Menu */}
        <Box display={{ base: 'block', md: 'none' }}>
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Menu"
              icon={<HamburgerIcon />}
              variant="ghost"
              color="white"
              bg="blue.600"
              _hover={{ bg: "blue.500" }}
              _active={{ bg: "blue.700" }}
              rounded="md"
              border="1px solid"
              borderColor="whiteAlpha.300"
              shadow="sm"
            />
            <MenuList 
              bg={bg} 
              border="none" 
              shadow="lg" 
              py={2} 
              rounded="lg"
            >
              {navTabs.map(({ label, path }) => {
                const isActive = path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(path);

                return (
                  <MenuItem
                    as={Link}
                    to={path}
                    key={path}
                    bg={isActive ? 'whiteAlpha.400' : 'transparent'} 
                    color={isActive ? 'yellow.300' : 'white'}
                    fontWeight={isActive ? 'white' : 'medium'}
                    rounded="md"
                    px={4}
                    py={3}
                    transition="all 0.2s"
                    _hover={{
                      bg: isActive ? 'whiteAlpha.400' : 'whiteAlpha.200',
                      color: 'teal.200',
                      transform: 'translateX(4px)',
                    }}
                    _focus={{ outline: 'none' }}
                  >
                    {isActive && '⭐ '} {label}
                  </MenuItem>
                );
              })}
            </MenuList>

          </Menu>
        </Box>
      </Flex>
    </Box>
  );
}

export default Navbar;
