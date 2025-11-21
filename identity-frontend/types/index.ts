// Data field enum matching contract
export enum DataField {
  EMAIL = 0,
  DOB = 1,
  NAME = 2,
  ID_NUMBER = 3,
  LOCATION = 4,
  EXPERIENCE = 5,
  COUNTRY = 6,
}

// Field labels for UI
export const FIELD_LABELS: Record<DataField, string> = {
  [DataField.EMAIL]: 'Email',
  [DataField.DOB]: 'Date of Birth',
  [DataField.NAME]: 'Name',
  [DataField.ID_NUMBER]: 'ID Number',
  [DataField.LOCATION]: 'Location',
  [DataField.EXPERIENCE]: 'Years of Experience',
  [DataField.COUNTRY]: 'Country',
};

// Profile structure
export interface Profile {
  owner: string;
  exists: boolean;
  createdAt: number;
}

// Access request structure
export interface AccessRequest {
  requester: string;
  message: string;
  timestamp: number;
  pending: boolean;
  granted: boolean;
}

// Decryption status (same as fundraising for consistency)
export enum DecryptStatus {
  NONE = 'none',
  PROCESSING = 'processing',
  DECRYPTED = 'decrypted',
}

// Decryption info for fields
export interface DecryptionInfo {
  status: DecryptStatus;
  value: bigint;
  timestamp: number;
}

// Field access map
export type FieldAccessMap = Record<DataField, boolean>;

// Profile data (encrypted handles)
export interface ProfileData {
  email: string;
  dob: string;
  name: string;
  idNumber: string;
  location: string;
  experience: string;
  country: string;
}

// Decrypted profile data
export interface DecryptedProfileData {
  email: bigint;
  dob: bigint;
  name: bigint;
  idNumber: bigint;
  location: bigint;
  experience: bigint;
  country: bigint;
}
