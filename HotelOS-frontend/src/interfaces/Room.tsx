import { Hotel } from "./Hotel";

export enum RoomStatus {
    AVAILABLE = "AVAILABLE",
    OCCUPIED = "OCCUPIED",
    RESERVED = "RESERVED",
    MAINTENANCE = "MAINTENANCE",
}

export interface Room {
    roomId: string;
    hotel: Hotel | null;
    roomNumber: string;
    type: string;
    capacity: number | null;
    rate: number;
    status: string;
    description: string;
    imagePath: string | null;
}
