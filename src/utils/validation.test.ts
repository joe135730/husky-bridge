import { describe, it, expect } from 'vitest';

/**
 * Email validation utility
 * Tests email format validation
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Password validation utility
 * Tests password strength validation
 */
export function validatePassword(password: string): boolean {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?]).{8,}$/;
  return passwordRegex.test(password);
}

describe('Validation Utilities', () => {
  describe('validateEmail', () => {
    it('should return true for valid email addresses', () => {
      expect(validateEmail('user@example.com')).toBe(true);
      expect(validateEmail('test.user@domain.co.uk')).toBe(true);
      expect(validateEmail('user123@test-domain.com')).toBe(true);
    });

    it('should return false for invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('user@domain')).toBe(false);
      expect(validateEmail('')).toBe(false);
      expect(validateEmail('user name@example.com')).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(validateEmail('user+tag@example.com')).toBe(true);
      expect(validateEmail('user_name@example.com')).toBe(true);
    });
  });

  describe('validatePassword', () => {
    it('should return true for valid passwords', () => {
      expect(validatePassword('Password123!')).toBe(true);
      expect(validatePassword('MyP@ssw0rd')).toBe(true);
      expect(validatePassword('Test1234#')).toBe(true);
    });

    it('should return false for passwords without uppercase letter', () => {
      expect(validatePassword('password123!')).toBe(false);
    });

    it('should return false for passwords without lowercase letter', () => {
      expect(validatePassword('PASSWORD123!')).toBe(false);
    });

    it('should return false for passwords without number', () => {
      expect(validatePassword('Password!')).toBe(false);
    });

    it('should return false for passwords without special character', () => {
      expect(validatePassword('Password123')).toBe(false);
    });

    it('should return false for passwords shorter than 8 characters', () => {
      expect(validatePassword('Pass1!')).toBe(false);
      expect(validatePassword('P1!')).toBe(false);
    });

    it('should return false for empty password', () => {
      expect(validatePassword('')).toBe(false);
    });
  });
});

