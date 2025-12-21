import { UserType } from '../interfaces/User';

/**
 * Utility functions for route handling, URL generation, and permission context
 */

/**
 * Determines the permission context (user type) based on the current URL path
 * @param pathname - The current location pathname
 * @returns The determined UserType or undefined
 */
export const getPermissionContext = (pathname: string): UserType | undefined => {
    if (pathname.includes('/admin/')) {
        return UserType.Admin;
    } else if (pathname.includes('/manager/')) {
        return UserType.Manager;
    } else if (pathname.includes('/staff/')) {
        return UserType.Staff;
    }
    return undefined;
};

/**
 * Gets the base URL for navigation based on the permission context
 * @param permissionContext - The current user type context
 * @param hotelId - The ID of the hotel
 * @returns The base URL path string
 */
export const getBaseUrl = (permissionContext: UserType | undefined, hotelId: string | number): string => {
    if (permissionContext === UserType.Admin) {
        return `/admin/hotels/${hotelId}`;
    } else if (permissionContext === UserType.Manager) {
        return `/manager/hotel/${hotelId}`;
    } else if (permissionContext === UserType.Staff) {
        return `/staff/${hotelId}`;
    }
    return '';
};

/**
 * Gets the return URL for back navigation after form submissions
 * @param permissionContext - The current user type context
 * @param hotelId - The ID of the hotel
 * @param section - Optional section to append to the URL (e.g., 'reservations', 'rooms')
 * @returns The full return URL path string
 */
export const getReturnUrl = (
    permissionContext: UserType | undefined,
    hotelId: string | number,
    section?: string
): string => {
    const base = getBaseUrl(permissionContext, hotelId);
    return section ? `${base}/${section}` : base;
};

/**
 * Gets the edit URL for a specific entity based on permission context
 * @param permissionContext - The current user type context
 * @param hotelId - The ID of the hotel
 * @param entityType - The type of entity (e.g., 'rooms', 'reservations')
 * @param entityId - The ID of the entity to edit
 * @returns The full edit URL path string
 */
export const getEditUrl = (
    permissionContext: UserType | undefined,
    hotelId: string | number,
    entityType: string,
    entityId: string | number
): string => {
    const base = getBaseUrl(permissionContext, hotelId);
    return `${base}/${entityType}/${entityId}/edit`;
};

/**
 * Gets the view URL for a specific entity based on permission context
 * @param permissionContext - The current user type context
 * @param hotelId - The ID of the hotel
 * @param entityType - The type of entity (e.g., 'rooms', 'reservations')
 * @param entityId - The ID of the entity to view
 * @returns The full view URL path string
 */
export const getViewUrl = (
    permissionContext: UserType | undefined,
    hotelId: string | number,
    entityType: string,
    entityId: string | number
): string => {
    const base = getBaseUrl(permissionContext, hotelId);
    return `${base}/${entityType}/${entityId}`;
};
