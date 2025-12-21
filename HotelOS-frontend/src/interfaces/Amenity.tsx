import { Hotel } from "./Hotel";

export enum AmenityType {
    CULTURE = "CULTURE",
    ENTERTAINMENT = "ENTERTAINMENT",
    FOOD = "FOOD",
    HEALTH = "HEALTH",
    PARKING = "PARKING",
    POOL = "POOL",
    RECREATION = "RECREATION",
    SHOPPING = "SHOPPING",
    SPORTS = "SPORTS",
    TRANSPORTATION = "TRANSPORTATION",
    OTHER = "OTHER"
}

export interface Amenity {
    id?: number;
    hotel: Hotel;
    name: string;
    description?: string;
    type?: AmenityType;
    distanceKm?: number;
    imageUrl?: string;
}