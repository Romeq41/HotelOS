import { Hotel } from "./Hotel";

export enum RoomStatus {
    AVAILABLE = "AVAILABLE",
    OCCUPIED = "OCCUPIED",
    RESERVED = "RESERVED",
    MAINTENANCE = "MAINTENANCE",
}

export enum RoomType {
    STANDARD = "STANDARD",
    FAMILY = "FAMILY",
    SUITE = "SUITE",
    PRESIDENTIAL_SUITE = "PRESIDENTIAL_SUITE",
    FAMILY_ROOM = "FAMILY_ROOM"
};



export interface Room {
    roomId: string;
    hotel: Hotel | null;
    roomNumber: string;
    roomType: RoomType;
    capacity: number | null;
    price: number;
    status: string;
    description: string;
    imagePath: string | null;
}
