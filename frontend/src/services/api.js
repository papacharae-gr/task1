import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Destinations API
export const destinationsAPI = {
  getAll: () => api.get('/destinations'),
  getById: (id) => api.get(`/destinations/${id}`),
  incrementViews: (id) => api.patch(`/destinations/${id}/views`),
};

// Trips API
export const tripsAPI = {
  // Saved trips
  getSaved: () => api.get('/trips/saved'),
  addSaved: (destinationId) => api.post('/trips/saved', { destinationId }),
  removeSaved: (id) => api.delete(`/trips/saved/${id}`),
  
  // Planned trips
  getPlanned: () => api.get('/trips/planned'),
  addPlanned: (tripData) => api.post('/trips/planned', tripData),
  updatePlanned: (id, tripData) => api.put(`/trips/planned/${id}`, tripData),
  removePlanned: (id) => api.delete(`/trips/planned/${id}`),
};



export default api;