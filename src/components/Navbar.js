import {
  Box,
  Flex,
  Heading,
  Tabs,
  TabList,
  Tab,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';

const navTabs = [
  { label: 'Home', path: '/' },
  { label: 'Destinations', path: '/DestinationDetails' },
  { label: 'My Trips', path: '/trips' },
];

function Navbar() {
  const location = useLocation();
  const bg = useColorModeValue('blue.500', 'blue.700');

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
          <Link to="/">🌍 TravelGuide</Link>
        </Heading>

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
                  bg: 'whiteAlpha.300',
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
      </Flex>
    </Box>
  );
}

export default Navbar;
