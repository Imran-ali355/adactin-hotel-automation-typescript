import hotelData from '../test_Data/hotel.json';

export interface SearchData {
  location: string; hotel: string; roomType: string; rooms: string;
  checkIn: string; checkOut: string; adults: string; children: string;
}
export interface BookingData {
  firstName: string; lastName: string; address: string; card: string;
  cardType: string; month: string; year: string; cvv: string;
}
export function dateAfter(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
}
export function searchData(overrides: Partial<SearchData> = {}): SearchData {
  const { checkInOffset, checkOutOffset, ...defaults } = hotelData.search;
  return { ...defaults, checkIn: dateAfter(checkInOffset),
    checkOut: dateAfter(checkOutOffset), ...overrides };
}
export function bookingData(overrides: Partial<BookingData> = {}): BookingData {
  const { yearOffset, ...defaults } = hotelData.booking;
  return { ...defaults, year: String(new Date().getFullYear() + yearOffset), ...overrides };
}
