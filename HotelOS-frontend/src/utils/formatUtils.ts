import moment, { Moment } from 'moment';

/**
 * Common formatting and calculation utilities
 */

/**
 * Format a price with currency symbol and decimals
 * @param price - The price value
 * @param currency - The currency symbol (default: $)
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted price string
 */
export const formatPrice = (price: number | null | undefined, currency = '$', decimals = 2): string => {
    if (price === null || price === undefined) {
        return `${currency}0.00`;
    }
    return `${currency}${price.toFixed(decimals)}`;
};

/**
 * Format a date to a standard format
 * @param date - The date to format
 * @param format - The format string (default: YYYY-MM-DD)
 * @returns Formatted date string
 */
export const formatDate = (date: string | Date | Moment | null | undefined, format = 'YYYY-MM-DD'): string => {
    if (!date) return '';
    return moment(date).format(format);
};

/**
 * Calculate the number of nights between two dates
 * @param checkIn - Check-in date
 * @param checkOut - Check-out date
 * @returns Number of nights or 0 if invalid
 */
export const calculateNights = (checkIn: Date | Moment | string, checkOut: Date | Moment | string): number => {
    const start = moment(checkIn);
    const end = moment(checkOut);

    if (!start.isValid() || !end.isValid() || end.isSameOrBefore(start)) {
        return 0;
    }

    return end.diff(start, 'days');
};

/**
 * Calculate total price based on per-night rate and duration
 * @param pricePerNight - Price per night
 * @param checkIn - Check-in date
 * @param checkOut - Check-out date
 * @returns Total price or 0 if invalid
 */
export const calculateTotalPrice = (
    pricePerNight: number | null | undefined,
    checkIn: Date | Moment | string,
    checkOut: Date | Moment | string
): number => {
    if (pricePerNight === null || pricePerNight === undefined) {
        return 0;
    }

    const nights = calculateNights(checkIn, checkOut);
    return nights * pricePerNight;
};
