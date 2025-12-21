import { Hotel } from "../../interfaces/Hotel";

/**
 * Gets the formatted location string from a hotel object
 */
export function getLocationString(hotel: Hotel): string {
    const city = hotel.addressInformation?.city || hotel.city || '';
    const state = hotel.addressInformation?.state || hotel.state || '';
    const country = hotel.addressInformation?.country || hotel.country || '';

    let locationParts = [];
    if (city) locationParts.push(city);
    if (state) locationParts.push(state);
    if (country) locationParts.push(country);

    return locationParts.join(', ');
}

/**
 * Gets the hotel image URL
 */
export function getHotelImageUrl(hotelId: string): string {
    return `http://localhost:8080/api/hotels/${hotelId}/image`;
}

/**
 * Gets the room image URL
 */
export function getRoomImageUrl(roomId: string): string {
    return `http://localhost:8080/api/rooms/${roomId}/image`;
}
