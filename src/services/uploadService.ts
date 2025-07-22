import { api } from '../api/config';

export const uploadService = {
  uploadImages: (formData: FormData) => api.post<{ files: string[] }>('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
};
