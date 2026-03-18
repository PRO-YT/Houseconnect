import {
  demoBookings,
  demoInquiries,
  demoMessages,
  demoNotifications,
  demoProfiles,
  demoProperties,
  demoReports,
  demoSubscriptions,
  demoThreads,
  demoUsers,
  demoVerificationRequests,
  faqItems,
  popularLocations,
  subscriptionPlans,
  testimonials,
  trustHighlights,
} from "@/lib/data/demo";
import type {
  DemoSession,
  Property,
  Role,
  SearchFilters,
  SubscriptionPlan,
  User,
  UserProfile,
} from "@/lib/types";

const PAGE_SIZE = 6;

export function getUsers() {
  return demoUsers;
}

export function getUserById(userId: string) {
  return demoUsers.find((user) => user.id === userId) ?? null;
}

export function getUserByEmail(email: string) {
  return (
    demoUsers.find((user) => user.email.toLowerCase() === email.toLowerCase()) ?? null
  );
}

export function getProfileByUserId(userId: string) {
  return demoProfiles.find((profile) => profile.userId === userId) ?? null;
}

export function getAgentById(agentId: string) {
  const user = getUserById(agentId);
  if (!user || user.role !== "agent") {
    return null;
  }

  return {
    user,
    profile: getProfileByUserId(agentId),
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

export function searchProperties(filters: SearchFilters) {
  const filtered = demoProperties
    .filter((property) => property.status === "approved")
    .filter((property) => matchesText(property, filters))
    .filter((property) =>
      !filters.purpose || filters.purpose === "all"
        ? true
        : property.purpose === filters.purpose,
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
        ? `${property.area} ${property.neighborhood}`
            .toLowerCase()
            .includes(filters.area.toLowerCase())
        : true,
    )
    .filter((property) => matchesAmenities(property, filters))
    .filter((property) => (filters.parking ? property.parkingSpaces > 0 : true))
    .filter((property) => (filters.petFriendly ? property.isPetFriendly : true))
    .filter((property) => (filters.featured ? property.featured : true))
    .filter((property) =>
      filters.verifiedAgentOnly
        ? getProfileByUserId(property.assignedAgentId || "")?.verificationStatus === "verified"
        : true,
    )
    .filter((property) =>
      filters.availableNow ? property.availabilityStatus === "available-now" : true,
    );

  const sorted = [...filtered].sort((left, right) => {
    switch (filters.sort) {
      case "price-asc":
        return left.price - right.price;
      case "price-desc":
        return right.price - left.price;
      case "featured":
        return Number(right.featured) - Number(left.featured);
      case "newest":
        return new Date(right.listedAt).getTime() - new Date(left.listedAt).getTime();
      case "relevant":
      default:
        return Number(right.featured) - Number(left.featured);
    }
  });

  const page = filters.page || 1;
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));

  return {
    items: sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    total: sorted.length,
    totalPages,
    page,
  };
}

export function getFeaturedProperties() {
  return demoProperties.filter(
    (property) => property.featured && property.status === "approved",
  );
}

export function getPropertyBySlug(slug: string) {
  return demoProperties.find((property) => property.slug === slug) ?? null;
}

export function getPropertyById(propertyId: string) {
  return demoProperties.find((property) => property.id === propertyId) ?? null;
}

export function getSimilarProperties(property: Property) {
  return demoProperties
    .filter((item) => item.id !== property.id)
    .filter((item) => item.city === property.city || item.purpose === property.purpose)
    .slice(0, 3);
}

export function getPropertyInquiries(propertyId: string) {
  return demoInquiries.filter((inquiry) => inquiry.propertyId === propertyId);
}

export function getThreadsForUser(userId: string) {
  return demoThreads
    .filter((thread) => thread.participantIds.includes(userId))
    .map((thread) => ({
      ...thread,
      messages: demoMessages.filter((message) => message.threadId === thread.id),
      property: thread.propertyId ? getPropertyById(thread.propertyId) : null,
    }));
}

export function getBookingsForUser(userId: string, role: Role) {
  return demoBookings.filter((booking) =>
    role === "agent" ? booking.agentId === userId : booking.requesterId === userId,
  );
}

export function getNotificationsForUser(userId: string) {
  return demoNotifications.filter((notification) => notification.userId === userId);
}

export function getDashboardMetricsForRole(role: Role, userId?: string) {
  if (role === "buyer" && userId) {
    return [
      { label: "Saved properties", value: "12", trend: "+4 this week" },
      { label: "Open inquiries", value: "3", trend: "2 awaiting replies" },
      { label: "Upcoming viewings", value: "2", trend: "Saturday next" },
      { label: "Compare shortlist", value: "4", trend: "Ready to review" },
    ];
  }

  if (role === "agent" && userId) {
    const listings = demoProperties.filter((property) => property.assignedAgentId === userId);
    const leads = demoInquiries.filter((inquiry) => inquiry.agentId === userId);
    const upcoming = demoBookings.filter((booking) => booking.agentId === userId);

    return [
      { label: "Active listings", value: String(listings.length), trend: "3 featured" },
      { label: "Leads received", value: String(leads.length), trend: "+18% this month" },
      { label: "Messages", value: String(getThreadsForUser(userId).length), trend: "Fast response" },
      { label: "Upcoming inspections", value: String(upcoming.length), trend: "This week" },
    ];
  }

  if (role === "landlord" && userId) {
    const listings = demoProperties.filter((property) => property.landlordId === userId);
    return [
      { label: "Submitted properties", value: String(listings.length), trend: "1 pending review" },
      { label: "Assigned agents", value: "2", trend: "Across Lagos and Abuja" },
      { label: "Active inquiries", value: "5", trend: "Moderated through agents" },
      { label: "Documents on file", value: "8", trend: "Identity and title" },
    ];
  }

  return [
    { label: "Total users", value: "1,284", trend: "+16% MoM" },
    { label: "Verified agents", value: "94", trend: "76% verification rate" },
    { label: "Pending approvals", value: "18", trend: "5 urgent" },
    { label: "Revenue run rate", value: "NGN 8.4M", trend: "Subscriptions + featured" },
  ];
}

export function getLandingContent() {
  return {
    testimonials,
    faqItems,
    trustHighlights,
    popularLocations,
  };
}

export function getSubscriptionPlans(): SubscriptionPlan[] {
  return subscriptionPlans;
}

export function getActiveSubscription(userId: string) {
  const subscription = demoSubscriptions.find((item) => item.userId === userId);
  if (!subscription) {
    return null;
  }

  return {
    ...subscription,
    plan: subscriptionPlans.find((plan) => plan.id === subscription.planId) ?? null,
  };
}

export function getVerificationQueue() {
  return demoVerificationRequests.map((request) => ({
    ...request,
    user: getUserById(request.userId),
    profile: getProfileByUserId(request.userId),
  }));
}

export function getReportsQueue() {
  return demoReports.map((report) => ({
    ...report,
    property: report.propertyId ? getPropertyById(report.propertyId) : null,
    reporter: getUserById(report.reporterId),
    reportedUser: report.reportedUserId ? getUserById(report.reportedUserId) : null,
  }));
}

export function getPropertiesForOwner(userId: string) {
  return demoProperties.filter(
    (property) => property.assignedAgentId === userId || property.landlordId === userId,
  );
}

export function getBuyerShortlist() {
  return demoProperties.filter((property) =>
    ["property-1", "property-3", "property-7", "property-8"].includes(property.id),
  );
}

export function getSessionUser(session: DemoSession | null): {
  user: User | null;
  profile: UserProfile | null;
} {
  if (!session) {
    return { user: null, profile: null };
  }

  const user = getUserById(session.userId);
  return {
    user,
    profile: user ? getProfileByUserId(user.id) : null,
  };
}
