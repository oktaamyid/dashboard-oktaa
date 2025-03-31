/**
 * Format short URL to be URL-friendly
 * - Trim whitespace
 * - Convert to lowercase
 * - Replace spaces with hyphens
 * - Remove special characters
 * - Encode URI components
 */
export const formatShortUrl = (input: string): string => {
     if (!input) return '';

     return input
          .trim()
          .toLowerCase()
          .replace(/\s+/g, '-') // Replace spaces with hyphens
          .replace(/[^a-z0-9-]/g, '') // Remove special chars
          .replace(/-+/g, '-') // Replace multiple hyphens with single
          .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

/**
 * Validate if a short URL is valid
 */
export const validateShortUrl = (input: string): boolean => {
     if (!input) return false;
     return /^[a-z0-9-]+$/.test(input);
};