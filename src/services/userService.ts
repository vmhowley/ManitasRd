import axios from 'axios';
import type { User } from '../types/User';

const API_BASE_URL = 'http://localhost:5000/api';

export const userService = {
  getTechnicians: async (): Promise<User[]> => {
    const response = await axios.get(`${API_BASE_URL}/technicians`);
    return response.data;
  },
};