

import api from './api';

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response;
};

export const logout = () => {
  // Clear local storage handled in context
};

export const getProfile = async () => {
  const response = await api.get('/auth/profile');
  return response;
};