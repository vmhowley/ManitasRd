import { api } from '../api/config';

import type { Service } from '../types/Service';

// --- SERVICE METHODS ---

export const standardService = {
  /**
   * Fetches all active standard services.
   */
  getAllServices: () => 
    api.get<Service[]>('/services'),
};

