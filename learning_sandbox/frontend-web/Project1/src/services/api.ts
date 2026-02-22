import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const getWeather = (city: string) => {
  return axios.get(`${API_URL}/weather`, { params: { city } });
};