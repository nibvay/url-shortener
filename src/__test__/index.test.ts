import { isValidUrl } from '../routes/url';

describe("isValidUrl", () => {
  it('should return true for valid url', () => {
    const testUrl = 'https://www.google.com';
    expect(isValidUrl(testUrl)).toBe(true);
  });

  it('should return false for invalid url', () => {
    const testUrl = 'https://';
    const testEmptyUrl = '';
    expect(isValidUrl(testUrl)).toBe(false);
    expect(isValidUrl(testEmptyUrl)).toBe(false);
  })
})