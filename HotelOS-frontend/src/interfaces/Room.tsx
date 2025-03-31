export interface Room {
    roomId: string;
    hotelId: string;
    roomNumber: string;
    type: string;
    capacity: number | null;
    rate: number;
    status: string;
    description: string;
    imagePath: string | null;
}
