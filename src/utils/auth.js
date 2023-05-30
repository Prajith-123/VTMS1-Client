import jwt_decode from 'jwt-decode';
import { setAuthToken } from './api';

export const getCurrentUser = () => {
  const token = localStorage.getItem('token');
  if (token) {
    const decodedToken = jwt_decode(token);
    return decodedToken.user;
  }
  return null;
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return token !== null;
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  setAuthToken(null);
};