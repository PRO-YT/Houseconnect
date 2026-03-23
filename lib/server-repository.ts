import "server-only";

import type {
  Message as PrismaMessage,
  Notification as PrismaNotification,
  Prisma,
  SubscriptionPlan as PrismaSubscriptionPlan,
  User as PrismaUser,
  UserProfile as PrismaUserProfile,
  VerificationRequest as PrismaVerificationRequest,
  ViewingBooking as PrismaViewingBooking,
} from "@prisma/client";

import { prisma, hasDatabaseUrl } from "@/lib/prisma";
import { demoProperties } from "@/lib/data/demo";
import {
  getActiveSubscription,
  getAgentById,
  getBookingsForUser,
  getBuyerShortlist,
  getFeaturedProperties,
  getNotificationsForUser,
  getPropertiesForOwner,
  getPropertyBySlug,
  getPropertyById,
  getReportsQueue,
  getSessionUser,
  getSimilarProperties,
  getThreadsForUser,
  getVerificationQueue,
  searchProperties,
} from "@/lib/repository";
import type {
  DemoSession,
  Message,
  Notification,
  Property,
  Role,
  SearchFilters,
  SubscriptionPlan,
  User,
  UserProfile,
  UserSubscription,
  VerificationRequest,
  ViewingBooking,
} from "@/lib/types";

const PAGE_SIZE = 6;
const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=800&q=80";

type PropertyRecord = Prisma.PropertyGetPayload<{
  include: { images: { orderBy: { sortOrder: "asc" } } };
}>;

type ThreadRecord = Prisma.MessageThreadGetPayload<{
  include: {
    messages: { orderBy: { createdAt: "asc" } };
    property: { include: { images: { orderBy: { sortOrder: "asc" } } } };
  };
}>;

type SubscriptionRecord = Prisma.UserSubscriptionGetPayload<{
  include: { plan: true };
}>;

type VerificationQueueRecord = Prisma.VerificationRequestGetPayload<{
  include: { user: { include: { profile: true } } };
}>;

type ReportQueueRecord = Prisma.ReportGetPayload<{
  include: {
    property: { include: { images: { orderBy: { sortOrder: "asc" } } } };
    reporter: true;
    reportedUser: true;
  };
}>;

function normalizeEnum<T extends string>(value: string): T {
  return value.toLowerCase().replace(/_/g, "-") as T;
}

function decimalToNumber(value: Prisma.Decimal | null | undefined) {
  return value ? value.toNumber() : undefined;
}

function deriveSubscriptionTier(plan: { name: string; price: Prisma.Decimal; listingLimit: number }) {
  const normalizedName = plan.name.toLowerCase();

  if (normalizedName.includes("free") || plan.price.toNumber() === 0) {
    return "free" as const;
  }

  if (normalizedName.includes("pro") || plan.listingLimit <= 20) {
    return "pro" as const;
  }

  return "premium" as const;
}

function serializeUser(user: PrismaUser): User {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone || "",
    role: normalizeEnum<User["role"]>(user.role),
    avatar: user.avatar || DEFAULT_AVATAR,
    isEmailVerified: user.isEmailVerified,
    isPhoneVerified: user.isPhoneVerified,
    isActive: user.isActive,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

function serializeProfile(profile: PrismaUserProfile): UserProfile {
  return {
    userId: profile.userId,
    bio: profile.bio || "",
    location: profile.location || "",
    preferences: profile.preferences,
    companyName: profile.companyName || undefined,
    licenseNumber: profile.licenseNumber || undefined,
    verificationStatus: normalizeEnum<UserProfile["verificationStatus"]>(profile.verificationStatus),
    trustScore: profile.trustScore,
    whatsappNumber: profile.whatsappNumber || undefined,
  };
}

function serializeProperty(property: PropertyRecord): Property {
  return {
    id: property.id,
    title: property.title,
    slug: property.slug,
    description: property.description,
    purpose: normalizeEnum<Property["purpose"]>(property.purpose),
    propertyType: normalizeEnum<Property["propertyType"]>(property.propertyType),
    price: property.price.toNumber(),
    currency: property.currency,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    toilets: property.toilets || undefined,
    size: property.size,
    furnishingStatus: normalizeEnum<Property["furnishingStatus"]>(property.furnishingStatus),
    availabilityStatus: normalizeEnum<Property["availabilityStatus"]>(property.availabilityStatus),
    address: property.address,
    city: property.city,
    state: property.state,
    area: property.area,
    neighborhood: property.neighborhood || "",
    latitude: property.latitude,
    longitude: property.longitude,
    amenities: property.amenities,
    featured: property.featured,
    reviewedListing: property.reviewedListing,
    status: normalizeEnum<Property["status"]>(property.status),
    createdByUserId: property.createdByUserId,
    assignedAgentId: property.assignedAgentId,
    landlordId: property.landlordId,
    approvedByAdminId: property.approvedByAdminId,
    images: property.images.map((image) => ({
      id: image.id,
      propertyId: image.propertyId,
      url: image.url,
      alt: image.alt || property.title,
      sortOrder: image.sortOrder,
    })),
    yearBuilt: property.yearBuilt || new Date(property.createdAt).getFullYear(),
    reference: property.reference,
    fees: {
      serviceCharge: decimalToNumber(property.serviceCharge),
      cautionFee: decimalToNumber(property.cautionFee),
      agencyFee: decimalToNumber(property.agencyFee),
      legalFee: decimalToNumber(property.legalFee),
      commissionFee: decimalToNumber(property.commissionFee),
    },
    isPetFriendly: property.isPetFriendly,
    parkingSpaces: property.parkingSpaces,
    availableFrom: property.availableFrom?.toISOString() || "",
    listedAt: property.createdAt.toISOString(),
    updatedAt: property.updatedAt.toISOString(),
    expiresAt: property.expiresAt?.toISOString() || null,
  };
}

function serializeMessage(message: PrismaMessage): Message {
  return {
    id: message.id,
    threadId: message.threadId,
    senderId: message.senderId,
    body: message.body,
    isRead: message.isRead,
    createdAt: message.createdAt.toISOString(),
  };
}

function serializeBooking(booking: PrismaViewingBooking): ViewingBooking {
  return {
    id: booking.id,
    propertyId: booking.propertyId,
    requesterId: booking.requesterId,
    agentId: booking.agentId,
    scheduledAt: booking.scheduledAt.toISOString(),
    status: normalizeEnum<ViewingBooking["status"]>(booking.status),
    note: booking.note || "",
    createdAt: booking.createdAt.toISOString(),
  };
}

function serializePlan(plan: PrismaSubscriptionPlan): SubscriptionPlan {
  return {
    id: plan.id,
    name: plan.name,
    tier: deriveSubscriptionTier(plan),
    price: plan.price.toNumber(),
    billingInterval: normalizeEnum<SubscriptionPlan["billingInterval"]>(plan.billingInterval),
    listingLimit: plan.listingLimit,
    featuredLimit: plan.featuredLimit,
    analyticsEnabled: plan.analyticsEnabled,
    prioritySupport: plan.prioritySupport,
    verificationFeeIncluded: plan.verificationFeeIncluded,
    isActive: plan.isActive,
  };
}

function serializeSubscription(subscription: SubscriptionRecord): UserSubscription & {
  plan: SubscriptionPlan | null;
} {
  return {
    id: subscription.id,
    userId: subscription.userId,
    planId: subscription.planId,
    status: normalizeEnum<UserSubscription["status"]>(subscription.status),
    startedAt: subscription.startedAt.toISOString(),
    expiresAt: subscription.expiresAt.toISOString(),
    paymentProviderReference: subscription.paymentProviderReference || "",
    plan: subscription.plan ? serializePlan(subscription.plan) : null,
  };
}

function serializeVerificationRequest(request: PrismaVerificationRequest): VerificationRequest {
  return {
    id: request.id,
    userId: request.userId,
    type: normalizeEnum<VerificationRequest["type"]>(request.type),
    documentUrls: request.documentUrls,
    status: normalizeEnum<VerificationRequest["status"]>(request.status),
    adminNote: request.adminNote || "",
    createdAt: request.createdAt.toISOString(),
    reviewedAt: request.reviewedAt?.toISOString(),
  };
}

function serializeNotification(notification: PrismaNotification): Notification {
  return {
    id: notification.id,
    userId: notification.userId,
    type: normalizeEnum<Notification["type"]>(notification.type),
    title: notification.title,
    body: notification.body,
    isRead: notification.isRead,
    createdAt: notification.createdAt.toISOString(),
  };
}

function matchesText(property: Property, filters: SearchFilters) {
  const query = `${filters.q ?? ""} ${filters.location ?? ""}`.trim().toLowerCase();

  if (!query) {
    return true;
  }

  return [
    property.title,
    property.description,
    property.city,
    property.state,
    property.area,
    property.neighborhood,
    property.propertyType,
  ]
    .join(" ")
    .toLowerCase()
    .includes(query);
}

function matchesAmenities(property: Property, filters: SearchFilters) {
  if (!filters.amenities?.length) {
    return true;
  }

  return filters.amenities.every((amenity) =>
    property.amenities.some((item) => item.toLowerCase() === amenity.toLowerCase()),
  );
}

function filterProperties(properties: Property[], filters: SearchFilters) {
  const filtered = properties
    .filter((property) => property.status === "approved")
    .filter((property) => matchesText(property, filters))
    .filter((property) =>
      !filters.purpose || filters.purpose === "all" ? true : property.purpose === filters.purpose,
    )
    .filter((property) =>
      !filters.propertyType || filters.propertyType === "all"
        ? true
        : property.propertyType === filters.propertyType,
    )
    .filter((property) => (filters.minPrice ? property.price >= filters.minPrice : true))
    .filter((property) => (filters.maxPrice ? property.price <= filters.maxPrice : true))
    .filter((property) => (filters.bedrooms ? property.bedrooms >= filters.bedrooms : true))
    .filter((property) => (filters.bathrooms ? property.bathrooms >= filters.bathrooms : true))
    .filter((property) =>
      !filters.furnishingStatus || filters.furnishingStatus === "all"
        ? true
        : property.furnishingStatus === filters.furnishingStatus,
    )
    .filter((property) =>
      filters.area
        ? `${property.area} ${property.neighborhood}`.toLowerCase().includes(filters.area.toLowerCase())
        : true,
    )
    .filter((property) => matchesAmenities(property, filters))
    .filter((property) => (filters.parking ? property.parkingSpaces > 0 : true))
    .filter((property) => (filters.petFriendly ? property.isPetFriendly : true))
    .filter((property) => (filters.featured ? property.featured : true))
    .filter((property) =>
      filters.availableNow ? property.availabilityStatus === "available-now" : true,
    );

  return [...filtered].sort((left, right) => {
    switch (filters.sort) {
      case "price-asc":
        return left.price - right.price;
      case "price-desc":
        return right.price - left.price;
      case "newest":
        return new Date(right.listedAt).getTime() - new Date(left.listedAt).getTime();
      case "featured":
      case "relevant":
      default:
        return Number(right.featured) - Number(left.featured);
    }
  });
}

async function getPropertyCollection() {
  if (!hasDatabaseUrl()) {
    return null;
  }

  try {
    const properties = await prisma.property.findMany({
      include: { images: { orderBy: { sortOrder: "asc" } } },
      orderBy: { createdAt: "desc" },
    });

    return properties.length ? properties.map(serializeProperty) : null;
  } catch {
    return null;
  }
}

export async function searchPropertiesServer(filters: SearchFilters) {
  const properties = (await getPropertyCollection()) || null;
  if (!properties) {
    return searchProperties(filters);
  }

  const sorted = filterProperties(properties, filters);
  const page = filters.page || 1;
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));

  return {
    items: sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    total: sorted.length,
    totalPages,
    page,
  };
}

export async function getFeaturedPropertiesServer() {
  const properties = await getPropertyCollection();
  if (!properties) {
    return getFeaturedProperties();
  }

  return properties.filter((property) => property.featured && property.status === "approved");
}

export async function getPropertyBySlugServer(slug: string) {
  if (!hasDatabaseUrl()) {
    return getPropertyBySlug(slug);
  }

  try {
    const property = await prisma.property.findUnique({
      where: { slug },
      include: { images: { orderBy: { sortOrder: "asc" } } },
    });

    return property ? serializeProperty(property) : getPropertyBySlug(slug);
  } catch {
    return getPropertyBySlug(slug);
  }
}

export async function getPropertyByIdServer(propertyId: string) {
  if (!hasDatabaseUrl()) {
    return getPropertyById(propertyId);
  }

  try {
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: { images: { orderBy: { sortOrder: "asc" } } },
    });

    return property ? serializeProperty(property) : getPropertyById(propertyId);
  } catch {
    return getPropertyById(propertyId);
  }
}

export async function getSimilarPropertiesServer(property: Property) {
  const properties = await getPropertyCollection();
  if (!properties) {
    return getSimilarProperties(property);
  }

  return properties
    .filter((item) => item.id !== property.id)
    .filter((item) => item.city === property.city || item.purpose === property.purpose)
    .slice(0, 3);
}

export async function getAgentByIdServer(agentId: string) {
  if (!hasDatabaseUrl()) {
    return getAgentById(agentId);
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: agentId },
      include: { profile: true },
    });

    if (!user || user.role !== "AGENT") {
      return null;
    }

    return {
      user: serializeUser(user),
      profile: user.profile ? serializeProfile(user.profile) : null,
    };
  } catch {
    return getAgentById(agentId);
  }
}

export async function getSessionUserServer(session: DemoSession | null) {
  if (!session || !hasDatabaseUrl()) {
    return getSessionUser(session);
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: { profile: true },
    });

    if (!user) {
      return { user: null, profile: null };
    }

    return {
      user: serializeUser(user),
      profile: user.profile ? serializeProfile(user.profile) : null,
    };
  } catch {
    return getSessionUser(session);
  }
}

export async function getThreadsForUserServer(userId: string) {
  if (!hasDatabaseUrl()) {
    return getThreadsForUser(userId);
  }

  try {
    const threads = await prisma.messageThread.findMany({
      where: { participantIds: { has: userId } },
      include: {
        messages: { orderBy: { createdAt: "asc" } },
        property: { include: { images: { orderBy: { sortOrder: "asc" } } } },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!threads.length) {
      return getThreadsForUser(userId);
    }

    return threads.map((thread: ThreadRecord) => ({
      id: thread.id,
      propertyId: thread.propertyId,
      participantIds: thread.participantIds,
      createdAt: thread.createdAt.toISOString(),
      subject: thread.subject || "Marketplace conversation",
      messages: thread.messages.map(serializeMessage),
      property: thread.property ? serializeProperty(thread.property) : null,
    }));
  } catch {
    return getThreadsForUser(userId);
  }
}

export async function getBookingsForUserServer(userId: string, role: Role) {
  if (!hasDatabaseUrl()) {
    return getBookingsForUser(userId, role);
  }

  try {
    const bookings = await prisma.viewingBooking.findMany({
      where: role === "agent" ? { agentId: userId } : { requesterId: userId },
      orderBy: { scheduledAt: "asc" },
    });

    return bookings.length ? bookings.map(serializeBooking) : getBookingsForUser(userId, role);
  } catch {
    return getBookingsForUser(userId, role);
  }
}

export async function getNotificationsForUserServer(userId: string) {
  if (!hasDatabaseUrl()) {
    return getNotificationsForUser(userId);
  }

  try {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return notifications.length
      ? notifications.map(serializeNotification)
      : getNotificationsForUser(userId);
  } catch {
    return getNotificationsForUser(userId);
  }
}

export async function getBuyerShortlistServer() {
  const properties = await getPropertyCollection();
  if (!properties) {
    return getBuyerShortlist();
  }

  return properties.filter((property) =>
    ["property-1", "property-3", "property-7", "property-8"].includes(property.id),
  );
}

export async function getPropertiesForOwnerServer(userId: string) {
  if (!hasDatabaseUrl()) {
    return getPropertiesForOwner(userId);
  }

  try {
    const properties = await prisma.property.findMany({
      where: {
        OR: [{ assignedAgentId: userId }, { landlordId: userId }, { createdByUserId: userId }],
      },
      include: { images: { orderBy: { sortOrder: "asc" } } },
      orderBy: { updatedAt: "desc" },
    });

    return properties.length ? properties.map(serializeProperty) : getPropertiesForOwner(userId);
  } catch {
    return getPropertiesForOwner(userId);
  }
}

export async function getListingManagerPropertiesServer(userId: string, role: Exclude<Role, "guest">) {
  if (!hasDatabaseUrl()) {
    return role === "admin" ? demoProperties : getPropertiesForOwner(userId);
  }

  try {
    const properties = await prisma.property.findMany({
      where:
        role === "admin"
          ? undefined
          : {
              OR: [{ assignedAgentId: userId }, { createdByUserId: userId }, { landlordId: userId }],
            },
      include: { images: { orderBy: { sortOrder: "asc" } } },
      orderBy: { updatedAt: "desc" },
    });

    if (!properties.length) {
      return role === "admin" ? demoProperties : getPropertiesForOwner(userId);
    }

    return properties.map(serializeProperty);
  } catch {
    return role === "admin" ? demoProperties : getPropertiesForOwner(userId);
  }
}

export async function getActiveSubscriptionServer(userId: string) {
  if (!hasDatabaseUrl()) {
    return getActiveSubscription(userId);
  }

  try {
    const subscription = await prisma.userSubscription.findFirst({
      where: { userId, status: { in: ["ACTIVE", "TRIALING", "PAST_DUE"] } },
      include: { plan: true },
      orderBy: { expiresAt: "desc" },
    });

    return subscription ? serializeSubscription(subscription) : getActiveSubscription(userId);
  } catch {
    return getActiveSubscription(userId);
  }
}

export async function getVerificationQueueServer() {
  if (!hasDatabaseUrl()) {
    return getVerificationQueue();
  }

  try {
    const queue = await prisma.verificationRequest.findMany({
      include: { user: { include: { profile: true } } },
      orderBy: { createdAt: "desc" },
    });

    return queue.length
      ? queue.map((item: VerificationQueueRecord) => ({
          ...serializeVerificationRequest(item),
          user: serializeUser(item.user),
          profile: item.user.profile ? serializeProfile(item.user.profile) : null,
        }))
      : getVerificationQueue();
  } catch {
    return getVerificationQueue();
  }
}

export async function getReportsQueueServer() {
  if (!hasDatabaseUrl()) {
    return getReportsQueue();
  }

  try {
    const reports = await prisma.report.findMany({
      include: {
        property: { include: { images: { orderBy: { sortOrder: "asc" } } } },
        reporter: true,
        reportedUser: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return reports.length
      ? reports.map((item: ReportQueueRecord) => ({
          id: item.id,
          reporterId: item.reporterId,
          propertyId: item.propertyId,
          reportedUserId: item.reportedUserId,
          reason: item.reason,
          details: item.details,
          status: normalizeEnum<"new" | "reviewing" | "resolved">(item.status),
          createdAt: item.createdAt.toISOString(),
          property: item.property ? serializeProperty(item.property) : null,
          reporter: item.reporter ? serializeUser(item.reporter) : null,
          reportedUser: item.reportedUser ? serializeUser(item.reportedUser) : null,
        }))
      : getReportsQueue();
  } catch {
    return getReportsQueue();
  }
}
