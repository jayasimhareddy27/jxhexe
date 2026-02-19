"use client";

import { useSelector } from 'react-redux';

// Rename the component to ToastHandler
export default function ToastPersistence() { 
  const { message, type, visible } = useSelector((state) => state.toast);

  const typeStyles = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-[color:var(--color-cta-bg)]',
  };

  if (!visible || !message) return null;

  return (
    <div
      className={`
        fixed top-4 left-1/2 transform -translate-x-1/2
        text-white
        px-5 py-3 rounded-md shadow-lg z-50
        font-medium text-sm select-none
        ring-2 ring-[color:var(--color-button-primary-hover-bg)]
        ${typeStyles[type]}
      `}
      role="alert"
      aria-live="assertive"
    >
      {type === "error" ? "⚠️ " : "✅ "} {message}
    </div>
  );
}