import { sanitizeEmail, sanitizeText } from "@/lib/sanitize";
import { extractCoordinatesFromMapLink } from "@/lib/maps";
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

function sanitizeBoolean(input: unknown) {
  return input === true || input === "true" || input === "on";
}

function sanitizeNumber(input: unknown) {
  const value = typeof input === "string" && !input.trim() ? Number.NaN : Number(input);
  return Number.isFinite(value) ? value : Number.NaN;
}

function sanitizeStringArray(input: unknown, maxItems = 20, maxLength = 120) {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .map((item) => sanitizeText(item, maxLength))
    .filter(Boolean)
    .slice(0, maxItems);
}

function sanitizeHttpsUrl(input: unknown) {
  const value = sanitizeText(input, 500);
  if (!value) {
    return "";
  }

  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : "";
  } catch {
    return "";
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
  const description = sanitizeText(input.description, 4000);
  const address = sanitizeText(input.address, 160);
  const city = sanitizeText(input.city, 80);
  const state = sanitizeText(input.state, 80);
  const area = sanitizeText(input.area, 80);
  const neighborhood = sanitizeText(input.neighborhood, 80);
  const purpose = sanitizeText(input.purpose, 20);
  const propertyType = sanitizeText(input.propertyType, 40);
  const price = sanitizeNumber(input.price);
  const bedrooms = sanitizeNumber(input.bedrooms);
  const bathrooms = sanitizeNumber(input.bathrooms);
  const toilets = sanitizeNumber(input.toilets);
  const size = sanitizeNumber(input.size);
  const furnishingStatus = sanitizeText(input.furnishingStatus, 30);
  const availabilityStatus = sanitizeText(input.availabilityStatus, 30);
  const latitude = sanitizeNumber(input.latitude);
  const longitude = sanitizeNumber(input.longitude);
  const mapUrl = sanitizeHttpsUrl(input.mapUrl);
  const mapCoordinates = extractCoordinatesFromMapLink(mapUrl);
  const amenities = sanitizeStringArray(input.amenities, 24, 60);
  const imageUrls = sanitizeStringArray(input.imageUrls, 8, 500)
    .map((value) => sanitizeHttpsUrl(value))
    .filter(Boolean);
  const parkingSpaces = sanitizeNumber(input.parkingSpaces);
  const isPetFriendly = sanitizeBoolean(input.isPetFriendly);
  const availableFrom = sanitizeText(input.availableFrom, 32);
  const serviceCharge = sanitizeNumber(input.serviceCharge);
  const cautionFee = sanitizeNumber(input.cautionFee);
  const agencyFee = sanitizeNumber(input.agencyFee);
  const legalFee = sanitizeNumber(input.legalFee);
  const commissionFee = sanitizeNumber(input.commissionFee);

  assert(title.length >= 10, "Listing title is too short.");
  assert(description.length >= 40, "Add a fuller description so seekers understand the property.");
  assert(address.length >= 6, "Address is required.");
  assert(city.length >= 2, "City is required.");
  assert(state.length >= 2, "State is required.");
  assert(area.length >= 2, "Area is required.");
  assert(["rent", "sale"].includes(purpose), "Purpose must be rent or sale.");
  assert(
    ["apartment", "duplex", "studio", "short-let", "land", "commercial", "terrace"].includes(
      propertyType,
    ),
    "Property type is required.",
  );
  assert(Number.isFinite(price) && price > 0, "Price must be a valid amount.");
  assert(Number.isFinite(bedrooms) && bedrooms >= 0, "Bedrooms must be 0 or more.");
  assert(Number.isFinite(bathrooms) && bathrooms >= 0, "Bathrooms must be 0 or more.");
  assert(!Number.isNaN(toilets) ? toilets >= 0 : true, "Toilets must be 0 or more.");
  assert(Number.isFinite(size) && size > 0, "Property size must be a valid number.");
  assert(
    ["furnished", "semi-furnished", "unfurnished"].includes(furnishingStatus),
    "Choose a valid furnishing status.",
  );
  assert(
    ["available-now", "coming-soon", "occupied"].includes(availabilityStatus),
    "Choose a valid availability status.",
  );
  assert(
    (Number.isFinite(latitude) && Number.isFinite(longitude)) || Boolean(mapCoordinates),
    "Add latitude and longitude or paste a Google Maps link.",
  );
  assert(
    !Number.isFinite(latitude) || (latitude >= -90 && latitude <= 90),
    "Latitude must be between -90 and 90.",
  );
  assert(
    !Number.isFinite(longitude) || (longitude >= -180 && longitude <= 180),
    "Longitude must be between -180 and 180.",
  );
  assert(imageUrls.length > 0, "Add at least one HTTPS image URL or placeholder image.");
  assert(
    Number.isFinite(parkingSpaces) && parkingSpaces >= 0,
    "Parking spaces must be 0 or more.",
  );
  assert(availableFrom.length > 0, "Available from date is required.");
  assert(!Number.isNaN(new Date(availableFrom).getTime()), "Available from date is invalid.");
  assert(!Number.isNaN(serviceCharge) ? serviceCharge >= 0 : true, "Service charge must be 0 or more.");
  assert(!Number.isNaN(cautionFee) ? cautionFee >= 0 : true, "Caution fee must be 0 or more.");
  assert(!Number.isNaN(agencyFee) ? agencyFee >= 0 : true, "Agency fee must be 0 or more.");
  assert(!Number.isNaN(legalFee) ? legalFee >= 0 : true, "Legal fee must be 0 or more.");
  assert(
    !Number.isNaN(commissionFee) ? commissionFee >= 0 : true,
    "Commission fee must be 0 or more.",
  );

  return {
    title,
    description,
    address,
    city,
    state,
    area,
    neighborhood,
    purpose,
    propertyType,
    price,
    bedrooms,
    bathrooms,
    toilets: Number.isNaN(toilets) ? undefined : toilets,
    size,
    furnishingStatus,
    availabilityStatus,
    latitude: Number.isFinite(latitude) ? latitude : mapCoordinates!.latitude,
    longitude: Number.isFinite(longitude) ? longitude : mapCoordinates!.longitude,
    mapUrl,
    amenities,
    imageUrls,
    parkingSpaces,
    isPetFriendly,
    availableFrom,
    serviceCharge: Number.isNaN(serviceCharge) ? undefined : serviceCharge,
    cautionFee: Number.isNaN(cautionFee) ? undefined : cautionFee,
    agencyFee: Number.isNaN(agencyFee) ? undefined : agencyFee,
    legalFee: Number.isNaN(legalFee) ? undefined : legalFee,
    commissionFee: Number.isNaN(commissionFee) ? undefined : commissionFee,
  };
}
