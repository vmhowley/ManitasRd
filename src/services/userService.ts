import axios from 'axios';
import type { User } from '../types/User';
import { API_BASE_URL } from '../api/config';

const USER_API_URL = `${API_BASE_URL}/api`;

export const userService = {
  getTechnicians: async (): Promise<User[]> => {
    const response = await axios.get(`${USER_API_URL}/technicians`);
    return response.data;
  },
};