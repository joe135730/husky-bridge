import { describe, it, expect } from 'vitest';

/**
 * Format date utility
 * Tests date formatting functions
 */
export function formatDate(dateString: string | Date): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Check if date is in the past
 */
export function isPastDate(date: Date | string): boolean {
  const inputDate = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  inputDate.setHours(0, 0, 0, 0);
  return inputDate < today;
}

/**
 * Get date range in days
 */
export function getDaysBetween(startDate: Date | string, endDate: Date | string): number {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

describe('Date Utilities', () => {
  describe('formatDate', () => {
    it('should format date string correctly', () => {
      // Use a specific date that won't have timezone issues
      const dateString = '2024-01-15T12:00:00.000Z';
      const formatted = formatDate(dateString);
      // Just check that it contains the year and month name
      expect(formatted).toMatch(/2024/);
      expect(formatted).toMatch(/January/);
    });

    it('should format Date object correctly', () => {
      const date = new Date('2024-12-25T12:00:00.000Z');
      const formatted = formatDate(date);
      expect(formatted).toMatch(/2024/);
      expect(formatted).toMatch(/December/);
    });

    it('should handle different date formats', () => {
      const dateString = '2024-03-01T12:00:00.000Z';
      const formatted = formatDate(dateString);
      expect(formatted).toMatch(/March/);
      expect(formatted).toMatch(/2024/);
    });
  });

  describe('isPastDate', () => {
    it('should return true for past dates', () => {
      const pastDate = new Date('2020-01-01');
      expect(isPastDate(pastDate)).toBe(true);

      const pastDateString = '2020-01-01';
      expect(isPastDate(pastDateString)).toBe(true);
    });

    it('should return false for future dates', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      expect(isPastDate(futureDate)).toBe(false);
    });

    it('should return false for today', () => {
      const today = new Date();
      expect(isPastDate(today)).toBe(false);
    });
  });

  describe('getDaysBetween', () => {
    it('should calculate days between two dates', () => {
      const start = new Date('2024-01-01');
      const end = new Date('2024-01-10');
      expect(getDaysBetween(start, end)).toBe(9);
    });

    it('should handle date strings', () => {
      expect(getDaysBetween('2024-01-01', '2024-01-31')).toBe(30);
    });

    it('should return 0 for same date', () => {
      const date = new Date('2024-01-15');
      expect(getDaysBetween(date, date)).toBe(0);
    });

    it('should handle reversed dates (end before start)', () => {
      const start = new Date('2024-01-10');
      const end = new Date('2024-01-01');
      expect(getDaysBetween(start, end)).toBe(9);
    });
  });
});

