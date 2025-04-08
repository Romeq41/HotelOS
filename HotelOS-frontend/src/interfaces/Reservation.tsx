import { Room } from "./Room";
import { User } from "./User";

export enum ReservationStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    CHECKED_IN = "CHECKED_IN",
    CHECKED_OUT = "CHECKED_OUT",
    CANCELLED = "CANCELLED"
}

export interface Reservation {
    reservationId: number;
    guest: User;
    room: Room;
    checkInDate: string;
    checkOutDate: string;
    status: ReservationStatus;
    totalAmount: number;
    reservationName: string;
}