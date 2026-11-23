import {
  validateUsername,
  validatePassword,
  validateEmail,
  validateName,
} from '../src/utils/validation';

describe('Validation Utility Tests', () => {
  describe('validateUsername', () => {
    it('returns error when username is empty or whitespace', () => {
      expect(validateUsername('')).toBe('Username is required');
      expect(validateUsername('   ')).toBe('Username is required');
    });

    it('returns error when username is shorter than 3 characters', () => {
      expect(validateUsername('ab')).toBe('Username must be at least 3 characters');
    });

    it('returns undefined for valid username', () => {
      expect(validateUsername('emilys')).toBeUndefined();
      expect(validateUsername('michaelw')).toBeUndefined();
    });
  });

  describe('validatePassword', () => {
    it('returns error when password is empty', () => {
      expect(validatePassword('')).toBe('Password is required');
    });

    it('returns error when password is shorter than 4 characters', () => {
      expect(validatePassword('123')).toBe('Password must be at least 4 characters');
    });

    it('returns undefined for valid password', () => {
      expect(validatePassword('emilyspass')).toBeUndefined();
      expect(validatePassword('secret123')).toBeUndefined();
    });
  });

  describe('validateEmail', () => {
    it('returns error when email is empty', () => {
      expect(validateEmail('')).toBe('Email is required');
    });

    it('returns error for invalid email formats', () => {
      expect(validateEmail('invalid-email')).toBe('Please enter a valid email address');
      expect(validateEmail('user@com')).toBe('Please enter a valid email address');
      expect(validateEmail('@domain.com')).toBe('Please enter a valid email address');
    });

    it('returns undefined for valid email addresses', () => {
      expect(validateEmail('emily.johnson@x.dummyjson.com')).toBeUndefined();
      expect(validateEmail('test@example.com')).toBeUndefined();
    });
  });

  describe('validateName', () => {
    it('returns error when name is empty', () => {
      expect(validateName('', 'First name')).toBe('First name is required');
    });

    it('returns error when name is too short', () => {
      expect(validateName('A', 'Last name')).toBe('Last name must be at least 2 characters');
    });

    it('returns undefined for valid name', () => {
      expect(validateName('Emily', 'First name')).toBeUndefined();
    });
  });
});
