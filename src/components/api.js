import axios from 'axios';

// Set base URL for API requests (adjust with your backend URL)
const API_BASE_URL = 'http://207.154.218.245:8000/api';
// const API_BASE_URL = 'http://localhost:8000/api';

// Create an Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to get the Bearer token from localStorage (or sessionStorage)
const getToken = () => {
  return localStorage.getItem('token') || ''; // Adjust if you use a different storage method
};

// Add a request interceptor to include the Bearer token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      // Attach the Bearer token to the request headers
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request errors here (e.g., network issues)
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle unauthorized errors (401) or token expiry
api.interceptors.response.use(
  (response) => {
    // Successfully received the response
    return response;
  },
  (error) => {
    // Handle errors
    if (error.response && error.response.status === 401) {
      // Token expired or unauthorized, handle this (e.g., logout, redirect to login page)
      console.log('Unauthorized! Redirecting to login...');
      localStorage.removeItem('token'); // Remove expired token
      window.location.href = '/login'; // Redirect to the login page or show a login modal
    }
    return Promise.reject(error);
  }
);


// Login function (API request for login)
const login = async (email, password) => {
  try {
    const response = await api.post('/login', { email, password });
    // Save the token in localStorage after successful login
    localStorage.setItem('token', response.data?.token);
    localStorage.setItem('user', JSON.stringify(response.data?.user));
    return response.data; // You can return data like user info, token, etc.
  } catch (error) {
    throw error; // Propagate error for handling in components
  }
};

// Signup function (API request for signup)
const signup = async (email, password, username, fullname) => {
  try {
    const response = await api.post('/signup', { email, password, username, fullname });
    return response.data; // You can return user info, success message, etc.
  } catch (error) {
    throw error; // Propagate error for handling in components
  }
};


export { api, login, signup };
