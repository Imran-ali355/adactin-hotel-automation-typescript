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
  return { location: 'Sydney', hotel: 'Hotel Creek', roomType: 'Standard', rooms: '1',
    checkIn: dateAfter(7), checkOut: dateAfter(9), adults: '1', children: '0', ...overrides };
}
export function bookingData(overrides: Partial<BookingData> = {}): BookingData {
  return { firstName: 'Automation', lastName: 'Test', address: 'Test Address Sydney',
    card: '4111111111111111', cardType: 'VISA', month: '12',
    year: String(new Date().getFullYear() + 1), cvv: '123', ...overrides };
}
