import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/', // Adjust the base URL as needed
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 5000
});

api.interceptors.request.use(
  (config) => {
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      
      // If token exists, add it to request headers
      if (token) {
          config.headers.Authorization = `Bearer ${token}`;
      }
      
      return config;
  },
  (error) => {
      // Handle request errors here
      return Promise.reject(error);
  }
);

// Response interceptor - runs after each response
api.interceptors.response.use(
  (response) => {
      // Any status code between 200 and 299 triggers this function
      return response.data;
  },
  async (error) => {
      // Handle specific error cases
      if (error.response) {
          // Server responded with error status
          switch (error.response.status) {
              case 401: // Unauthorized
                  // Clear stored token
                  localStorage.removeItem('token');
                  // Redirect to login page or handle refresh token
                  window.location.href = '/login';
                  break;
              case 403: // Forbidden
                  console.error('Permission denied');
                  break;
              case 404: // Not found
                  console.error('Resource not found');
                  break;
              default:
                  console.error('Server error:', error.response.data);
          }
      } else if (error.request) {
          // Request was made but no response received
          console.error('No response received:', error.request);
      } else {
          // Error in request configuration
          console.error('Error:', error.message);
      }
      
      return Promise.reject(error);
  }
);

// API methods
export const apiService = {
  // // Auth endpoints
  // login: (credentials) => api.post('/login', credentials), // TODO
  // logout: () => api.post('/logout'), // TODO
  
  // // User endpoints - TODO, do I need these?
  // getCurrentUser: () => api.get('/user'),
  // updateProfile: (data) => api.put('/user/profile', data),
  
  // Example resource endpoints
  getEmployees: () => api.get('/employees'),
  createEmployee: (data) => api.post('/employees', data),
  getCompanyById: (id) => api.get(`/companies/${id}`),
  getCompanies: () => api.get('/companies'),
  createCompany: (data) => api.post('/companies', data),
  getEmployeesByCompanyId: (id) => api.get(`/companies/${id}/employees`),
  getEmployeeById: (id) => api.get(`/employees/${id}`),
  updateEmployee: (id, data) => api.put(`/employees/${id}`, data),
  getPerformanceMetricsByEmployeeId: (id) => api.get(`/employees/${id}/performance_metrics`),
  getPerformanceMetricsByCompanyId: (id) => api.get(`/companies/${id}/performance_metrics`),
  addPerformanceMetric: (data) => api.post('/performance_metrics', data),
  login: (credentials) => api.get('/login?email=' + credentials.email + '&password=' + credentials.password)
};

export default api;
