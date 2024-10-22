// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://your-api-url'
});

export const projectService = {
  getAllProjects: async () => {
    const response = await api.get('/projects');
    return response.data;
  },
  // Add other API calls as needed
  searchProjects: async (query) => {
    const response = await api.get(`/projects/search?q=${query}`);
    return response.data;
  }
};