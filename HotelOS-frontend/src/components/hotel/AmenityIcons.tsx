import React from 'react';
import WifiIcon from '@mui/icons-material/Wifi';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import PoolIcon from '@mui/icons-material/Pool';
import SpaIcon from '@mui/icons-material/Spa';
import RoomServiceIcon from '@mui/icons-material/RoomService';
import AccessibleIcon from '@mui/icons-material/Accessible';
import PetsIcon from '@mui/icons-material/Pets';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import HotTubIcon from '@mui/icons-material/HotTub';
import NaturePeopleIcon from '@mui/icons-material/NaturePeople';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import CategoryIcon from '@mui/icons-material/Category';
import { Amenity } from '../../interfaces/Amenity';

/**
 * AmenityType enum values:
 * CULTURE, ENTERTAINMENT, FOOD, HEALTH, PARKING, POOL, RECREATION, SHOPPING, SPORTS, TRANSPORTATION, OTHER
 * 
 * Returns an icon for a specific amenity type from the enum
 */
export function getAmenityTypeIcon(amenity: Amenity): React.ReactNode {
    // Normalize input by trimming and converting to uppercase
    const type = amenity.type?.toUpperCase().trim() || '';

    switch (type) {
        case 'CULTURE':
            return <TheaterComedyIcon />;
        case 'ENTERTAINMENT':
            return <SportsEsportsIcon />;
        case 'FOOD':
            return <FastfoodIcon />;
        case 'HEALTH':
            return <HealthAndSafetyIcon />;
        case 'PARKING':
            return <LocalParkingIcon />;
        case 'POOL':
            return <PoolIcon />;
        case 'RECREATION':
            return <NaturePeopleIcon />;
        case 'SHOPPING':
            return <ShoppingBagIcon />;
        case 'SPORTS':
            return <SportsSoccerIcon />;
        case 'TRANSPORTATION':
            return <DirectionsBusIcon />;
        case 'OTHER':
            return <CategoryIcon />;
        default:
            // Check if it contains any of the type strings
            if (type.includes('CULTURE')) return <TheaterComedyIcon />;
            if (type.includes('ENTERTAINMENT')) return <SportsEsportsIcon />;
            if (type.includes('FOOD')) return <FastfoodIcon />;
            if (type.includes('HEALTH')) return <HealthAndSafetyIcon />;
            if (type.includes('PARKING')) return <LocalParkingIcon />;
            if (type.includes('POOL')) return <PoolIcon />;
            if (type.includes('RECREATION')) return <NaturePeopleIcon />;
            if (type.includes('SHOPPING')) return <ShoppingBagIcon />;
            if (type.includes('SPORTS')) return <SportsSoccerIcon />;
            if (type.includes('TRANSPORTATION')) return <DirectionsBusIcon />;
            return <CategoryIcon />;
    }
}
// /**
//  * Returns an icon based on amenity name/description
//  */
// export function getAmenityIcon(amenity: string): React.ReactNode {
//     const amenityLower = amenity.toLowerCase();

//     // First check if it's one of the enum types (check both exact match and if it contains the type name)
//     const amenityUpper = amenity.toUpperCase();
//     if (amenityUpper === 'CULTURE' || amenityLower.includes('culture')) {
//         return <TheaterComedyIcon />;
//     } else if (amenityUpper === 'ENTERTAINMENT' || amenityLower.includes('entertainment')) {
//         return <SportsEsportsIcon />;
//     } else if (amenityUpper === 'FOOD' || amenityLower.includes('food')) {
//         return <FastfoodIcon />;
//     } else if (amenityUpper === 'HEALTH' || amenityLower.includes('health')) {
//         return <HealthAndSafetyIcon />;
//     } else if (amenityUpper === 'PARKING' || amenityLower.includes('parking')) {
//         return <LocalParkingIcon />;
//     } else if (amenityUpper === 'POOL' || amenityLower.includes('pool')) {
//         return <PoolIcon />;
//     } else if (amenityUpper === 'RECREATION' || amenityLower.includes('recreation')) {
//         return <NaturePeopleIcon />;
//     } else if (amenityUpper === 'SHOPPING' || amenityLower.includes('shopping')) {
//         return <ShoppingBagIcon />;
//     } else if (amenityUpper === 'SPORTS' || amenityLower.includes('sports')) {
//         return <SportsSoccerIcon />;
//     } else if (amenityUpper === 'TRANSPORTATION' || amenityLower.includes('transportation')) {
//         return <DirectionsBusIcon />;
//     } else if (amenityUpper === 'OTHER') {
//         return <CategoryIcon />;
//     }
//     //todo: FIX THE BACKEND TO SEND AMENITY Object not only name :)
//     // Then check by additional keywords for more specific amenities
//     if (amenityLower.includes('wifi') || amenityLower.includes('internet')) {
//         return <WifiIcon />;
//     } else if (amenityLower.includes('garage')) {
//         return <LocalParkingIcon />;
//     } else if (amenityLower.includes('restaurant') || amenityLower.includes('dining')) {
//         return <RestaurantIcon />;
//     } else if (amenityLower.includes('fitness') || amenityLower.includes('gym')) {
//         return <FitnessCenterIcon />;
//     } else if (amenityLower.includes('air conditioning') || amenityLower.includes('ac')) {
//         return <AcUnitIcon />;
//     } else if (amenityLower.includes('swimming')) {
//         return <PoolIcon />;
//     } else if (amenityLower.includes('spa') || amenityLower.includes('wellness') || amenityLower.includes('massage')) {
//         return <SpaIcon />;
//     } else if (amenityLower.includes('room service') || amenityLower.includes('in-room')) {
//         return <RoomServiceIcon />;
//     } else if (amenityLower.includes('accessible') || amenityLower.includes('disability')) {
//         return <AccessibleIcon />;
//     } else if (amenityLower.includes('pets') || amenityLower.includes('dog') || amenityLower.includes('cat')) {
//         return <PetsIcon />;
//     } else if (amenityLower.includes('breakfast') || amenityLower.includes('coffee')) {
//         return <LocalCafeIcon />;
//     } else if (amenityLower.includes('business') || amenityLower.includes('conference')) {
//         return <BusinessCenterIcon />;
//     } else if (amenityLower.includes('theater') || amenityLower.includes('museum')) {
//         return <TheaterComedyIcon />;
//     } else if (amenityLower.includes('games') || amenityLower.includes('play')) {
//         return <SportsEsportsIcon />;
//     } else if (amenityLower.includes('nature') || amenityLower.includes('outdoor')) {
//         return <NaturePeopleIcon />;
//     } else if (amenityLower.includes('store') || amenityLower.includes('mall')) {
//         return <ShoppingBagIcon />;
//     } else if (amenityLower.includes('bus') || amenityLower.includes('shuttle') || amenityLower.includes('transit')) {
//         return <DirectionsBusIcon />;
//     } else {
//         // Default icon
//         return <CategoryIcon />;
//     }
// }
