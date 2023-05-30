import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/login`, userData);
    const { token } = response.data;
    localStorage.setItem('token', token);
    setAuthToken(token);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/register`, userData);
    const { token } = response.data;
    localStorage.setItem('token', token);
    setAuthToken(token);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const recoverPassword = async (email) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/recover-password`, {
      email,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};