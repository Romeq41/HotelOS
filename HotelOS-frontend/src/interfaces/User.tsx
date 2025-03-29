export interface User {
    userId: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    userType: string;
    address: string;
    position: string
    hotel: string | Object;
    state: string;
    city: string;
    zipCode: string;
    country: string;
}