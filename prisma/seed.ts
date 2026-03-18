import { PrismaClient, Prisma } from "@prisma/client";
import { randomBytes, scryptSync } from "node:crypto";

import {
  demoProfiles,
  demoProperties,
  demoUsers,
  subscriptionPlans,
} from "../lib/data/demo";
const prisma = new PrismaClient();

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function toEnum(value: string) {
  return value.toUpperCase().replace(/-/g, "_");
}

async function main() {
  await prisma.compareItem.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.report.deleteMany();
  await prisma.verificationRequest.deleteMany();
  await prisma.userSubscription.deleteMany();
  await prisma.subscriptionPlan.deleteMany();
  await prisma.viewingBooking.deleteMany();
  await prisma.message.deleteMany();
  await prisma.messageThread.deleteMany();
  await prisma.inquiry.deleteMany();
  await prisma.propertyImage.deleteMany();
  await prisma.property.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.user.deleteMany();

  for (const user of demoUsers) {
    await prisma.user.create({
      data: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        passwordHash: hashPassword("SecurePass123!"),
        phone: user.phone,
        role: toEnum(user.role) as never,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        isActive: user.isActive,
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(user.updatedAt),
      },
    });
  }

  for (const profile of demoProfiles) {
    await prisma.userProfile.create({
      data: {
        userId: profile.userId,
        bio: profile.bio,
        location: profile.location,
        preferences: profile.preferences,
        companyName: profile.companyName,
        licenseNumber: profile.licenseNumber,
        verificationStatus: toEnum(profile.verificationStatus) as never,
        trustScore: profile.trustScore,
        whatsappNumber: profile.whatsappNumber,
      },
    });
  }

  for (const plan of subscriptionPlans) {
    await prisma.subscriptionPlan.create({
      data: {
        id: plan.id,
        name: plan.name,
        price: new Prisma.Decimal(plan.price),
        billingInterval: toEnum(plan.billingInterval) as never,
        listingLimit: plan.listingLimit,
        featuredLimit: plan.featuredLimit,
        analyticsEnabled: plan.analyticsEnabled,
        prioritySupport: plan.prioritySupport,
        verificationFeeIncluded: plan.verificationFeeIncluded,
        isActive: plan.isActive,
      },
    });
  }

  for (const property of demoProperties) {
    await prisma.property.create({
      data: {
        id: property.id,
        title: property.title,
        slug: property.slug,
        description: property.description,
        purpose: toEnum(property.purpose) as never,
        propertyType: toEnum(property.propertyType) as never,
        price: new Prisma.Decimal(property.price),
        currency: property.currency,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        toilets: property.toilets,
        size: property.size,
        furnishingStatus: toEnum(property.furnishingStatus) as never,
        availabilityStatus: toEnum(property.availabilityStatus) as never,
        address: property.address,
        city: property.city,
        state: property.state,
        area: property.area,
        neighborhood: property.neighborhood,
        latitude: property.latitude,
        longitude: property.longitude,
        amenities: property.amenities,
        featured: property.featured,
        reviewedListing: property.reviewedListing,
        status: toEnum(property.status) as never,
        createdByUserId: property.createdByUserId,
        assignedAgentId: property.assignedAgentId,
        landlordId: property.landlordId,
        approvedByAdminId: property.approvedByAdminId,
        yearBuilt: property.yearBuilt,
        reference: property.reference,
        serviceCharge: property.fees.serviceCharge ? new Prisma.Decimal(property.fees.serviceCharge) : undefined,
        cautionFee: property.fees.cautionFee ? new Prisma.Decimal(property.fees.cautionFee) : undefined,
        agencyFee: property.fees.agencyFee ? new Prisma.Decimal(property.fees.agencyFee) : undefined,
        legalFee: property.fees.legalFee ? new Prisma.Decimal(property.fees.legalFee) : undefined,
        commissionFee: property.fees.commissionFee ? new Prisma.Decimal(property.fees.commissionFee) : undefined,
        isPetFriendly: property.isPetFriendly,
        parkingSpaces: property.parkingSpaces,
        availableFrom: property.availableFrom ? new Date(property.availableFrom) : undefined,
        createdAt: new Date(property.listedAt),
        updatedAt: new Date(property.updatedAt),
        expiresAt: property.expiresAt ? new Date(property.expiresAt) : undefined,
      },
    });

    for (const image of property.images) {
      await prisma.propertyImage.create({
        data: {
          id: image.id,
          propertyId: property.id,
          url: image.url,
          alt: image.alt,
          sortOrder: image.sortOrder,
        },
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
