export type Role = "SUPER_ADMIN" | "EVENT_LEADER" | "MANAGEMENT" | "SOCIAL_MEDIA";

export interface UserSession {
  id: string;
  accountId: string;
  email: string;
  name: string;
  role: Role;
  avatarUrl?: string | null;
}

export const PERMISSIONS = {
  // User Management
  MANAGE_USERS: ["SUPER_ADMIN"],
  VIEW_AUDIT_LOGS: ["SUPER_ADMIN"],
  MANAGE_SITE_SETTINGS: ["SUPER_ADMIN", "EVENT_LEADER"],
  
  // Carousel & Global Content
  MANAGE_CAROUSEL: ["SUPER_ADMIN", "EVENT_LEADER"],
  
  // Event Management
  CREATE_EVENT: ["SUPER_ADMIN", "EVENT_LEADER"],
  EDIT_ANY_EVENT: ["SUPER_ADMIN"],
  DELETE_EVENT: ["SUPER_ADMIN"],
  EDIT_ASSIGNED_EVENT: ["SUPER_ADMIN", "EVENT_LEADER", "MANAGEMENT"],
  CHANGE_EVENT_STATUS: ["SUPER_ADMIN", "EVENT_LEADER"],
  
  // Media & Gallery
  UPLOAD_GALLERY: ["SUPER_ADMIN", "SOCIAL_MEDIA", "EVENT_LEADER"],
  DELETE_GALLERY: ["SUPER_ADMIN", "SOCIAL_MEDIA"],
  FEATURE_GALLERY: ["SUPER_ADMIN", "SOCIAL_MEDIA"],
  
  // Winners
  MANAGE_WINNERS: ["SUPER_ADMIN", "EVENT_LEADER", "MANAGEMENT", "SOCIAL_MEDIA"],
  
  // Team Management
  MANAGE_TEAM: ["SUPER_ADMIN", "EVENT_LEADER"],
  
  // Documents
  UPLOAD_DOCUMENTS: ["SUPER_ADMIN", "EVENT_LEADER", "MANAGEMENT"],
  DELETE_DOCUMENTS: ["SUPER_ADMIN", "EVENT_LEADER"],
} as const;

export function hasPermission(role: Role, allowedRoles: readonly string[]): boolean {
  return allowedRoles.includes(role);
}

export function canManageEvent(
  user: UserSession,
  event: { eventLeaderId?: string | null; createdById?: string }
): boolean {
  if (user.role === "SUPER_ADMIN") return true;
  if (user.role === "EVENT_LEADER") {
    return event.eventLeaderId === user.id || event.createdById === user.id;
  }
  if (user.role === "MANAGEMENT") {
    return event.eventLeaderId === user.id || event.createdById === user.id;
  }
  return false;
}
