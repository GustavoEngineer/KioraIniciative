/**
 * Utility functions for common validations across KioraWeb
 */

export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const hasMinLength = (text, minLength = 6) => {
    return text && text.length >= minLength;
};

export const doPasswordsMatch = (password, confirmPassword) => {
    return password === confirmPassword;
};
