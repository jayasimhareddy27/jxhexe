'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setTheme } from './slice';

export default function ThemePersistence() {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);
  const user = useSelector((state) => state.auth.user);
  const dbTheme = useSelector((state) => state.auth.references?.theme);
  
  // Track if we have already done the first load from LocalStorage
  const [hasInitialized, setHasInitialized] = useState(false);

  // --- EFFECT 1: Initial Load (Only runs ONCE on startup) ---
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      dispatch(setTheme(storedTheme));
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      dispatch(setTheme(prefersDark ? 'dark' : 'light'));
    }
    setHasInitialized(true);
  }, [dispatch]);

  // --- EFFECT 2: Login Override ---
  useEffect(() => {
    if (user && dbTheme) {
      dispatch(setTheme(dbTheme));
    }
  }, [user, dbTheme, dispatch]);

  // --- EFFECT 3: Save to LocalStorage and UI ---
  useEffect(() => {
    // Only save to localStorage AFTER the initial load is done
    // This prevents overwriting your saved theme with the default 'light' on refresh
    if (hasInitialized) {
      localStorage.setItem('theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme, hasInitialized]);

  return null;
}