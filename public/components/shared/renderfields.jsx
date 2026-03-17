"use client";
import React from "react";
import { DateFieldInput, RichTextarea } from "../../../lib/redux/features/editor/index";
import { formatLabel } from "../../../lib/redux/features/editor/index";

const renderField = ([key, rawVal],formData = {},setFormData,parentIndex = null,isLoading = false) => {
  const label = formatLabel(key);
  const value = rawVal ?? "";
  const id = parentIndex !== null ? `${key}-${parentIndex}` : key;
  const isDate = key.toLowerCase().includes("date");

  const handleOnChange = (newValue) => {
    const sanitizedValue = typeof newValue === "string" ? newValue : String(newValue);
    const updatedObject = { ...formData, [key]: sanitizedValue };
    setFormData(updatedObject);
  };

  return isDate ? 
  (<DateFieldInput  key={id}  id={id}  name={key}  label={label}  value={value}  disabled={isLoading}  onChange={handleOnChange}/>) : 
  (<RichTextarea  key={id}  id={id}  name={key}  label={label}  value={value}  disabled={isLoading}  placeholder={label}  onChange={handleOnChange}/>);
};

export default renderField;