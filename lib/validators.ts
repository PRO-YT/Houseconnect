import { sanitizeEmail, sanitizeText } from "@/lib/sanitize";
import type { Role } from "@/lib/types";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new ValidationError(message);
  }
}

export function validateAuthPayload(input: Record<string, unknown>) {
  const email = sanitizeEmail(input.email);
  const password = sanitizeText(input.password, 120);

  assert(Boolean(email), "A valid email address is required.");
  assert(password.length >= 8, "Password must be at least 8 characters.");

  return { email, password };
}

export function validateRegistrationPayload(input: Record<string, unknown>) {
  const fullName = sanitizeText(input.fullName, 120);
  const email = sanitizeEmail(input.email);
  const password = sanitizeText(input.password, 120);
  const phone = sanitizeText(input.phone, 32);
  const role = sanitizeText(input.role, 20) as Exclude<Role, "guest">;
  const allowedRoles: Array<Exclude<Role, "guest">> = ["buyer", "agent", "landlord"];

  assert(fullName.length >= 2, "Full name is required.");
  assert(Boolean(email), "A valid email address is required.");
  assert(password.length >= 8, "Password must be at least 8 characters.");
  assert(phone.length >= 7, "Phone number is required.");
  assert(allowedRoles.includes(role), "Choose a valid account role.");

  return {
    fullName,
    email,
    password,
    phone,
    role,
  };
}

export function validateInquiryPayload(input: Record<string, unknown>) {
  const propertyId = sanitizeText(input.propertyId, 64);
  const name = sanitizeText(input.name, 120);
  const email = sanitizeEmail(input.email);
  const phone = sanitizeText(input.phone, 32);
  const message = sanitizeText(input.message, 1200);

  assert(propertyId.length > 0, "Property reference is required.");
  assert(name.length >= 2, "Your name is required.");
  assert(Boolean(email), "A valid email is required.");
  assert(phone.length >= 7, "A phone number is required.");
  assert(message.length >= 10, "Please add a short inquiry message.");

  return { propertyId, name, email, phone, message };
}

export function validateBookingPayload(input: Record<string, unknown>) {
  const propertyId = sanitizeText(input.propertyId, 64);
  const preferredDate = sanitizeText(input.preferredDate, 32);
  const preferredTime = sanitizeText(input.preferredTime, 32);
  const note = sanitizeText(input.note, 1000);

  assert(propertyId.length > 0, "Property reference is required.");
  assert(preferredDate.length > 0, "Preferred date is required.");
  assert(preferredTime.length > 0, "Preferred time is required.");
  assert(note.length >= 8, "Please add context for the booking.");

  return { propertyId, preferredDate, preferredTime, note };
}

export function validateListingPayload(input: Record<string, unknown>) {
  const title = sanitizeText(input.title, 160);
  const city = sanitizeText(input.city, 80);
  const area = sanitizeText(input.area, 80);
  const purpose = sanitizeText(input.purpose, 20);
  const propertyType = sanitizeText(input.propertyType, 40);
  const price = Number(input.price);

  assert(title.length >= 10, "Listing title is too short.");
  assert(city.length >= 2, "City is required.");
  assert(area.length >= 2, "Area is required.");
  assert(["rent", "sale"].includes(purpose), "Purpose must be rent or sale.");
  assert(propertyType.length >= 3, "Property type is required.");
  assert(Number.isFinite(price) && price > 0, "Price must be a valid amount.");

  return {
    title,
    city,
    area,
    purpose,
    propertyType,
    price,
  };
}
