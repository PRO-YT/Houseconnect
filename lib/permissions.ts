import type { Property, Role } from "@/lib/types";

export function canManageProperty(role: Role, property: Property, userId: string) {
  if (role === "admin") {
    return true;
  }

  if (role === "agent") {
    return property.assignedAgentId === userId || property.createdByUserId === userId;
  }

  if (role === "landlord") {
    return property.landlordId === userId;
  }

  return false;
}

export function canModerate(role: Role) {
  return role === "admin";
}

export function canAccessRole(role: Role, expected: Role[]) {
  return expected.includes(role);
}
