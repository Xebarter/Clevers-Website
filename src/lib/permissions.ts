"use client";

// Define user roles
export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  AUTHOR = 'author',
  VIEWER = 'viewer'
}

// Define permission types
export enum PermissionType {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  PUBLISH = 'publish',
  MANAGE_USERS = 'manage_users',
  MANAGE_ROLES = 'manage_roles',
  VIEW_ANALYTICS = 'view_analytics'
}

// Define resource types
export enum ResourceType {
  ANNOUNCEMENT = 'announcement',
  EVENT = 'event',
  PAGE = 'page',
  MEDIA = 'media',
  USER = 'user',
  SETTINGS = 'settings',
  ANALYTICS = 'analytics'
}

// Define permission for a specific resource
export interface Permission {
  resourceType: ResourceType;
  actions: PermissionType[];
}

// Role-based permissions map
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    {
      resourceType: ResourceType.ANNOUNCEMENT,
      actions: [PermissionType.CREATE, PermissionType.READ, PermissionType.UPDATE, PermissionType.DELETE, PermissionType.PUBLISH]
    },
    {
      resourceType: ResourceType.EVENT,
      actions: [PermissionType.CREATE, PermissionType.READ, PermissionType.UPDATE, PermissionType.DELETE, PermissionType.PUBLISH]
    },
    {
      resourceType: ResourceType.PAGE,
      actions: [PermissionType.CREATE, PermissionType.READ, PermissionType.UPDATE, PermissionType.DELETE, PermissionType.PUBLISH]
    },
    {
      resourceType: ResourceType.MEDIA,
      actions: [PermissionType.CREATE, PermissionType.READ, PermissionType.UPDATE, PermissionType.DELETE]
    },
    {
      resourceType: ResourceType.USER,
      actions: [PermissionType.CREATE, PermissionType.READ, PermissionType.UPDATE, PermissionType.DELETE]
    },
    {
      resourceType: ResourceType.SETTINGS,
      actions: [PermissionType.READ, PermissionType.UPDATE]
    },
    {
      resourceType: ResourceType.ANALYTICS,
      actions: [PermissionType.READ]
    }
  ],
  [UserRole.EDITOR]: [
    {
      resourceType: ResourceType.ANNOUNCEMENT,
      actions: [PermissionType.CREATE, PermissionType.READ, PermissionType.UPDATE, PermissionType.PUBLISH]
    },
    {
      resourceType: ResourceType.EVENT,
      actions: [PermissionType.CREATE, PermissionType.READ, PermissionType.UPDATE, PermissionType.PUBLISH]
    },
    {
      resourceType: ResourceType.PAGE,
      actions: [PermissionType.CREATE, PermissionType.READ, PermissionType.UPDATE, PermissionType.PUBLISH]
    },
    {
      resourceType: ResourceType.MEDIA,
      actions: [PermissionType.CREATE, PermissionType.READ, PermissionType.UPDATE]
    },
    {
      resourceType: ResourceType.ANALYTICS,
      actions: [PermissionType.READ]
    }
  ],
  [UserRole.AUTHOR]: [
    {
      resourceType: ResourceType.ANNOUNCEMENT,
      actions: [PermissionType.CREATE, PermissionType.READ, PermissionType.UPDATE]
    },
    {
      resourceType: ResourceType.EVENT,
      actions: [PermissionType.CREATE, PermissionType.READ, PermissionType.UPDATE]
    },
    {
      resourceType: ResourceType.PAGE,
      actions: [PermissionType.READ, PermissionType.UPDATE]
    },
    {
      resourceType: ResourceType.MEDIA,
      actions: [PermissionType.CREATE, PermissionType.READ]
    }
  ],
  [UserRole.VIEWER]: [
    {
      resourceType: ResourceType.ANNOUNCEMENT,
      actions: [PermissionType.READ]
    },
    {
      resourceType: ResourceType.EVENT,
      actions: [PermissionType.READ]
    },
    {
      resourceType: ResourceType.PAGE,
      actions: [PermissionType.READ]
    },
    {
      resourceType: ResourceType.MEDIA,
      actions: [PermissionType.READ]
    }
  ]
};

// User model with role and permissions
export interface AppUser {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  customPermissions?: Permission[]; // For custom permissions outside of role
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
}

// Check if a user has permission for a specific action on a resource
export function hasPermission(
  user: AppUser,
  resourceType: ResourceType,
  action: PermissionType
): boolean {
  // Check role-based permissions
  const rolePermissions = ROLE_PERMISSIONS[user.role] || [];
  const resourcePermission = rolePermissions.find(p => p.resourceType === resourceType);

  if (resourcePermission && resourcePermission.actions.includes(action)) {
    return true;
  }

  // Check custom permissions (if any)
  if (user.customPermissions) {
    const customPermission = user.customPermissions.find(p => p.resourceType === resourceType);
    if (customPermission && customPermission.actions.includes(action)) {
      return true;
    }
  }

  return false;
}

// Generate a list of all possible permissions (for UI selection)
export function getAllPossiblePermissions(): { resource: ResourceType, action: PermissionType }[] {
  const allPermissions: { resource: ResourceType, action: PermissionType }[] = [];

  Object.values(ResourceType).forEach(resource => {
    Object.values(PermissionType).forEach(action => {
      allPermissions.push({ resource, action });
    });
  });

  return allPermissions;
}
