export enum UserType {
    GUEST = "GUEST",
    STAFF = "STAFF",
    MANAGER = "MANAGER",
    ADMIN = "ADMIN",
}

export interface User {
    userId: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    userType: UserType;
    address: string;
    position: string
    hotel: any;
    state: string;
    city: string;
    zipCode: string;
    country: string;
}