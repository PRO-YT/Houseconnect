export function sanitizeText(input: unknown, maxLength = 5000) {
  if (typeof input !== "string") {
    return "";
  }

  return input
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

export function sanitizeEmail(input: unknown) {
  const value = sanitizeText(input, 120).toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? value : "";
}
