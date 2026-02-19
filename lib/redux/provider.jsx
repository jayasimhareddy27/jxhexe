"use client";

import React from 'react';
import { Provider } from 'react-redux';
import { makeStore } from './store';

export default function ReduxProvider({ children }) {
  const storeRef = React.useRef(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}