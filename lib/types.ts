export type Role = "guest" | "buyer" | "agent" | "landlord" | "admin";

export type VerificationStatus =
  | "unverified"
  | "pending"
  | "verified"
  | "rejected";

export type ListingStatus =
  | "draft"
  | "pending-review"
  | "approved"
  | "rejected"
  | "archived"
  | "expired";

export type Purpose = "rent" | "sale";

export type PropertyType =
  | "apartment"
  | "duplex"
  | "studio"
  | "short-let"
  | "land"
  | "commercial"
  | "terrace";

export type FurnishingStatus =
  | "furnished"
  | "semi-furnished"
  | "unfurnished";

export type AvailabilityStatus =
  | "available-now"
  | "coming-soon"
  | "occupied";

export type LeadStatus =
  | "new"
  | "contacted"
  | "inspection-scheduled"
  | "negotiation"
  | "closed"
  | "lost";

export type BookingStatus =
  | "pending"
  | "approved"
  | "rescheduled"
  | "rejected"
  | "completed";

export type SubscriptionTier = "free" | "pro" | "premium";

export type NotificationType =
  | "message"
  | "inquiry"
  | "booking"
  | "verification"
  | "listing"
  | "subscription";

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: Role;
  avatar: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  userId: string;
  bio: string;
  location: string;
  preferences: string[];
  companyName?: string;
  licenseNumber?: string;
  verificationStatus: VerificationStatus;
  trustScore: number;
  whatsappNumber?: string;
}

export interface PropertyImage {
  id: string;
  propertyId: string;
  url: string;
  alt: string;
  sortOrder: number;
}

export interface PropertyFeeBreakdown {
  serviceCharge?: number;
  cautionFee?: number;
  agencyFee?: number;
  legalFee?: number;
  commissionFee?: number;
}

export interface Property {
  id: string;
  title: string;
  slug: string;
  description: string;
  purpose: Purpose;
  propertyType: PropertyType;
  price: number;
  currency: string;
  bedrooms: number;
  bathrooms: number;
  toilets?: number;
  size: number;
  furnishingStatus: FurnishingStatus;
  availabilityStatus: AvailabilityStatus;
  address: string;
  city: string;
  state: string;
  area: string;
  neighborhood: string;
  latitude: number;
  longitude: number;
  amenities: string[];
  featured: boolean;
  reviewedListing: boolean;
  status: ListingStatus;
  createdByUserId: string;
  assignedAgentId?: string | null;
  landlordId?: string | null;
  approvedByAdminId?: string | null;
  images: PropertyImage[];
  yearBuilt: number;
  reference: string;
  fees: PropertyFeeBreakdown;
  isPetFriendly: boolean;
  parkingSpaces: number;
  availableFrom: string;
  listedAt: string;
  updatedAt: string;
  expiresAt?: string | null;
}

export interface Inquiry {
  id: string;
  propertyId: string;
  buyerId: string;
  agentId: string;
  landlordId?: string | null;
  message: string;
  status: LeadStatus;
  source: string;
  createdAt: string;
  updatedAt: string;
}

export interface MessageThread {
  id: string;
  propertyId?: string | null;
  participantIds: string[];
  createdAt: string;
  subject: string;
}

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

export interface ViewingBooking {
  id: string;
  propertyId: string;
  requesterId: string;
  agentId: string;
  scheduledAt: string;
  status: BookingStatus;
  note: string;
  createdAt: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: SubscriptionTier;
  price: number;
  billingInterval: "monthly" | "yearly";
  listingLimit: number;
  featuredLimit: number;
  analyticsEnabled: boolean;
  prioritySupport: boolean;
  verificationFeeIncluded: boolean;
  isActive: boolean;
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  status: "active" | "trialing" | "past_due" | "canceled";
  startedAt: string;
  expiresAt: string;
  paymentProviderReference: string;
}

export interface VerificationRequest {
  id: string;
  userId: string;
  type: "agent-license" | "identity" | "landlord-proof";
  documentUrls: string[];
  status: VerificationStatus | "under-review";
  adminNote: string;
  createdAt: string;
  reviewedAt?: string;
}

export interface Report {
  id: string;
  reporterId: string;
  propertyId?: string | null;
  reportedUserId?: string | null;
  reason: string;
  details: string;
  status: "new" | "reviewing" | "resolved";
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
}

export interface DashboardMetric {
  label: string;
  value: string;
  trend?: string;
}

export interface SearchFilters {
  q?: string;
  purpose?: Purpose | "all";
  propertyType?: PropertyType | "all";
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  furnishingStatus?: FurnishingStatus | "all";
  location?: string;
  area?: string;
  amenities?: string[];
  parking?: boolean;
  petFriendly?: boolean;
  featured?: boolean;
  verifiedAgentOnly?: boolean;
  availableNow?: boolean;
  sort?: "relevant" | "newest" | "price-asc" | "price-desc" | "featured";
  page?: number;
}

export interface DemoSession {
  userId: string;
  role: Exclude<Role, "guest">;
  email: string;
  fullName: string;
  issuedAt: number;
}
