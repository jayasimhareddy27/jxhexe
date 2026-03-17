"use client";

import { useSelector } from "react-redux";

export default function ToastPersistence() {
  const { message, type, visible } = useSelector((state) => state.toast);

  if (!visible || !message) return null;

  let background = "#1f2937"; 
  let icon = "ℹ️";

  if (type === "success") {
    background = "#059669";
    icon = "✅";
  }

  if (type === "error") {
    background = "#e11d48";
    icon = "⚠️";
  }

  return (
    <div style={{  position: "fixed",  bottom: "40px",  left: "50%",  transform: "translateX(-50%)",  background: background,  color: "white",  padding: "12px 20px",  borderRadius: "8px",  zIndex: 999999,  display: "flex",  alignItems: "center",  gap: "8px",  boxShadow: "0 10px 20px rgba(0,0,0,0.25)"}} role="alert" aria-live="assertive">
      <span style={{ fontSize: "18px" }}>{icon}</span>
      <span style={{ fontWeight: 500 }}>{message}</span>
    </div>
  );
}