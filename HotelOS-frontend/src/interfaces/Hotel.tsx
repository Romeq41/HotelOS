import { Amenity } from "./Amenity";
import { Room } from "./Room";

interface AddressInformation {
    id: number;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

interface ContactInformation {
    id: number;
    phoneNumber: string;
    email: string;
}

export interface Hotel {
    id: number;
    name: string;
    basePrice: number;
    description: string;
    addressInformation: AddressInformation;
    contactInformation: ContactInformation;
    phoneNumber?: string;
    email?: string;
    imagePath?: string;
    // For backward compatibility with UI
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
    cheapestRoom?: Room;
    cheapestRoomByTypeMap?: Record<string, Room>;
    roomTypeCountAvailableMap?: Record<string, number>; // Changed from Room to number
    amenities?: Amenity[];
}
