import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('dyslexai_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle unauthorized errors
    if (error.response?.status === 401) {
      localStorage.removeItem('dyslexai_token');
      localStorage.removeItem('dyslexai_user');
      window.location.href = '/';
    }
    
    // Extract error message from response
    const errorMessage = error.response?.data?.message || 
                       error.message || 
                       'An unexpected error occurred';
    
    return Promise.reject(new Error(errorMessage));
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
};

// Sessions API
export const sessionsAPI = {
  getSessions: (params) => api.get('/sessions', { params }),
  getSession: (id) => api.get(`/sessions/${id}`),
  createSession: (data) => api.post('/sessions', data),
  updateSession: (id, data) => api.put(`/sessions/${id}`, data),
  updatePosition: (id, position) => api.patch(`/sessions/${id}/position`, { position }),
  deleteSession: (id) => api.delete(`/sessions/${id}`),
};

// Upload API
export const uploadAPI = {
  uploadPDF: (formData) => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return api.post('/upload/pdf', formData, config);
  },
  parseText: (text) => api.post('/upload/text', { text }),
};

// Exercises API
export const exercisesAPI = {
  getExercises: (params) => api.get('/exercises', { params }),
  getExercise: (id) => api.get(`/exercises/${id}`),
  saveResult: (data) => api.post('/exercises/result', data),
  getResults: (params) => api.get('/exercises/results', { params }),
  getStats: () => api.get('/exercises/stats'),
};

// Reports API
export const reportsAPI = {
  getSummary: () => api.get('/reports/summary'),
  getFull: () => api.get('/reports/full'),
  generate: () => api.post('/reports/generate'),
};

export default api;
