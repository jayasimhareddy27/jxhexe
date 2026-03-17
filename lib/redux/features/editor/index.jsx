

export { default as RichTextarea } from '../../../../public/components/shared/richtextarea';
export { default as DateFieldInput } from '../../../../public/components/shared/datefieldinput';

// This is a pure utility function for formatting strings. It stays.
export function formatLabel(key) {
  if (!key) return "";
  return key
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^\w/, (c) => c.toUpperCase());
}
