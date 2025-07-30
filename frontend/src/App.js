import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import Home from './pages/Home';
import DestinationDetails from './pages/DestinationDetails';
import MyTrips from './pages/MyTrips';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';  
import './App.css';

function App() {
  return (
    <Box>
      <Navbar />
      <Box p={4}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/DestinationDetails" element={<DestinationDetails />} />
          <Route path="/DestinationDetails/:id" element={<DestinationDetails />} />
          <Route path="/MyTrips" element={<MyTrips />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
