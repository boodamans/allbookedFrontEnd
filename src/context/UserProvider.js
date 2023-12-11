// UserProvider.js

import React, { useState, useEffect } from 'react';
import UserContext from './UserContext';
import allbookedApi from '../api/allbookedApi';
import { jwtDecode } from "jwt-decode";

const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  useEffect(() => {
    if (token) {
      allbookedApi.token = token;

      const fetchCurrentUser = async () => {
        try {
          const user = jwtDecode(token);
          setCurrentUser(user);
        } catch (error) {
          console.error('Error fetching current user:', error);
        }
      };

      fetchCurrentUser();
    }
  }, [token]);

  const loginUser = async (username, password) => {
    try {
      const token = await allbookedApi.login({ username, password });
      setToken(token);
      localStorage.setItem('token', token);

      const user = await allbookedApi.getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const logoutUser = () => {
    setToken(null);
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  const signupUser = async (formData) => {
    try {
      const token = await allbookedApi.signup(formData);
      setToken(token);
      localStorage.setItem('token', token);

      const user = await allbookedApi.getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  return (
    <UserContext.Provider value={{ currentUser, loginUser, logoutUser, signupUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;