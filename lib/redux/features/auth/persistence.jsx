'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCredentials } from './slice';

export default function AuthPersistence() {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  // On initial load, try to load credentials from localStorage into Redux
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');
      if (user && token) {
        dispatch(setCredentials({ user, token }));
      }
    } catch (e) {
      console.error("Failed to parse auth credentials from localStorage", e);
    }
  }, [dispatch]);

  // Whenever the user or token changes in Redux, update localStorage
  useEffect(() => {
    if (user && token) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }, [user, token]);

  return null; // This component does not render anything
}