/**
 * Utility functions to convert profile data (strings, dates) to uint64 for encryption
 */

/**
 * Convert a string to a uint64 by hashing and taking first 8 bytes
 * This allows us to encrypt text data while maintaining privacy
 */
export function stringToUint64(value: string): bigint {
  if (!value) return 0n;

  // Simple hash function: convert string to bytes and create a number
  let hash = 0n;
  const encoder = new TextEncoder();
  const bytes = encoder.encode(value);

  // Take up to 8 bytes (uint64 max)
  for (let i = 0; i < Math.min(bytes.length, 8); i++) {
    hash = (hash << 8n) | BigInt(bytes[i]);
  }

  return hash;
}

/**
 * Convert a date string to Unix timestamp (seconds since epoch)
 */
export function dateToUint64(dateString: string): bigint {
  if (!dateString) return 0n;

  const date = new Date(dateString);
  const timestamp = Math.floor(date.getTime() / 1000); // Convert to seconds
  return BigInt(timestamp);
}

/**
 * Convert a number string to uint64
 */
export function numberToUint64(value: string | number): bigint {
  if (typeof value === 'number') return BigInt(value);
  if (!value) return 0n;

  const num = parseInt(value, 10);
  if (isNaN(num)) return 0n;

  return BigInt(num);
}

/**
 * Convert profile form data to encrypted-ready uint64 values
 */
export function convertProfileToUint64(profileData: {
  email: string;
  dob: string;
  name: string;
  idNumber: string;
  location: string;
  experience: string;
  country: string;
}) {
  return {
    email: stringToUint64(profileData.email),
    dob: dateToUint64(profileData.dob),
    name: stringToUint64(profileData.name),
    idNumber: stringToUint64(profileData.idNumber),
    location: stringToUint64(profileData.location),
    experience: numberToUint64(profileData.experience),
    country: stringToUint64(profileData.country),
  };
}

/**
 * Format a uint64 back to a readable string representation
 * Note: This is lossy and only works for display purposes
 */
export function uint64ToString(value: bigint): string {
  if (value === 0n) return '';

  const bytes: number[] = [];
  let temp = value;

  while (temp > 0n) {
    bytes.unshift(Number(temp & 0xFFn));
    temp = temp >> 8n;
  }

  const decoder = new TextDecoder();
  return decoder.decode(new Uint8Array(bytes));
}

/**
 * Format a uint64 timestamp to a readable date
 */
export function uint64ToDate(value: bigint): string {
  if (value === 0n) return '';

  const timestamp = Number(value) * 1000; // Convert to milliseconds
  const date = new Date(timestamp);
  return date.toLocaleDateString();
}

/**
 * Format a uint64 to a number
 */
export function uint64ToNumber(value: bigint): number {
  return Number(value);
}
