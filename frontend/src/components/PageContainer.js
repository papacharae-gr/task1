import { Box } from '@chakra-ui/react';

function PageContainer({ children }) {
  return (
    <Box
      maxW="1000px"
      mx="auto"
      px={{ base: 4, md: 10 }}
      py={8}
      w="100%"
    >
      {children}
    </Box>
  );
}

export default PageContainer;