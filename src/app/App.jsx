import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Loading from '../components/initialpages/loading';
import Login from '../components/initialpages/login';
import Homepage from '../components/initialpages/home';

export default function App() {
  const { user, loading } = useSelector((state) => state.auth);
  const currentTheme = useSelector((state) => state.theme.theme); 
  const dbTheme = useSelector((state) => state.auth.references?.theme);


  // Sync the theme to the DOM
  useEffect(() => {
    const themeToApply = dbTheme || currentTheme || 'light';
    document.documentElement.setAttribute('data-theme', themeToApply);
  }, [dbTheme, currentTheme]);

  if (loading === 'loading') return <Loading />;
  if (!user) return <Login />;
  
  return <Homepage />;
}