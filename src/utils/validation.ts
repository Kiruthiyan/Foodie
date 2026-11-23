export interface ValidationErrors {
  username?: string;
  password?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

export const validateUsername = (username: string): string | undefined => {
  if (!username || username.trim().length === 0) {
    return 'Username is required';
  }
  if (username.trim().length < 3) {
    return 'Username must be at least 3 characters';
  }
  return undefined;
};

export const validatePassword = (password: string): string | undefined => {
  if (!password || password.length === 0) {
    return 'Password is required';
  }
  if (password.length < 4) {
    return 'Password must be at least 4 characters';
  }
  return undefined;
};

export const validateEmail = (email: string): string | undefined => {
  if (!email || email.trim().length === 0) {
    return 'Email is required';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Please enter a valid email address';
  }
  return undefined;
};

export const validateName = (name: string, fieldName: string): string | undefined => {
  if (!name || name.trim().length === 0) {
    return `${fieldName} is required`;
  }
  if (name.trim().length < 2) {
    return `${fieldName} must be at least 2 characters`;
  }
  return undefined;
};
