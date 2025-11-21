// IdentityRegistry Contract ABI
export const IDENTITY_REGISTRY_ABI = [
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'timestamp', type: 'uint256' },
    ],
    name: 'ProfileCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'timestamp', type: 'uint256' },
    ],
    name: 'ProfileUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'requester', type: 'address' },
      { indexed: true, internalType: 'address', name: 'dataOwner', type: 'address' },
      { indexed: false, internalType: 'string', name: 'message', type: 'string' },
    ],
    name: 'AccessRequested',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'dataOwner', type: 'address' },
      { indexed: true, internalType: 'address', name: 'requester', type: 'address' },
      { indexed: false, internalType: 'enum IdentityRegistry.DataField[]', name: 'fields', type: 'uint8[]' },
    ],
    name: 'AccessGranted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'dataOwner', type: 'address' },
      { indexed: true, internalType: 'address', name: 'requester', type: 'address' },
    ],
    name: 'AccessRevoked',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
      { indexed: false, internalType: 'enum IdentityRegistry.DataField', name: 'field', type: 'uint8' },
    ],
    name: 'FieldMarkedForDecryption',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
      { indexed: false, internalType: 'enum IdentityRegistry.DataField', name: 'field', type: 'uint8' },
      { indexed: false, internalType: 'uint64', name: 'value', type: 'uint64' },
    ],
    name: 'FieldDecrypted',
    type: 'event',
  },
  // Profile Management
  {
    inputs: [
      { internalType: 'bytes', name: 'encryptedEmail', type: 'bytes' },
      { internalType: 'bytes', name: 'encryptedDob', type: 'bytes' },
      { internalType: 'bytes', name: 'encryptedName', type: 'bytes' },
      { internalType: 'bytes', name: 'encryptedIdNumber', type: 'bytes' },
      { internalType: 'bytes', name: 'encryptedLocation', type: 'bytes' },
      { internalType: 'bytes', name: 'encryptedExperience', type: 'bytes' },
      { internalType: 'bytes', name: 'encryptedCountry', type: 'bytes' },
    ],
    name: 'createProfile',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes', name: 'encryptedEmail', type: 'bytes' },
      { internalType: 'bytes', name: 'encryptedDob', type: 'bytes' },
      { internalType: 'bytes', name: 'encryptedName', type: 'bytes' },
      { internalType: 'bytes', name: 'encryptedIdNumber', type: 'bytes' },
      { internalType: 'bytes', name: 'encryptedLocation', type: 'bytes' },
      { internalType: 'bytes', name: 'encryptedExperience', type: 'bytes' },
      { internalType: 'bytes', name: 'encryptedCountry', type: 'bytes' },
    ],
    name: 'updateProfile',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getMyProfile',
    outputs: [
      { internalType: 'bytes32', name: 'emailHandle', type: 'bytes32' },
      { internalType: 'bytes32', name: 'dobHandle', type: 'bytes32' },
      { internalType: 'bytes32', name: 'nameHandle', type: 'bytes32' },
      { internalType: 'bytes32', name: 'idNumberHandle', type: 'bytes32' },
      { internalType: 'bytes32', name: 'locationHandle', type: 'bytes32' },
      { internalType: 'bytes32', name: 'experienceHandle', type: 'bytes32' },
      { internalType: 'bytes32', name: 'countryHandle', type: 'bytes32' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  // Access Request Management
  {
    inputs: [
      { internalType: 'address', name: 'dataOwner', type: 'address' },
      { internalType: 'string', name: 'message', type: 'string' },
    ],
    name: 'requestAccess',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'requester', type: 'address' },
      { internalType: 'enum IdentityRegistry.DataField[]', name: 'fields', type: 'uint8[]' },
    ],
    name: 'grantAccess',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'requester', type: 'address' }],
    name: 'revokeAccess',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  // Decryption Management (v0.9)
  {
    inputs: [{ internalType: 'enum IdentityRegistry.DataField', name: 'field', type: 'uint8' }],
    name: 'requestFieldDecryption',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'enum IdentityRegistry.DataField', name: 'field', type: 'uint8' },
      { internalType: 'uint64', name: 'decryptedValue', type: 'uint64' },
      { internalType: 'bytes', name: 'abiEncodedValue', type: 'bytes' },
      { internalType: 'bytes', name: 'decryptionProof', type: 'bytes' },
    ],
    name: 'submitFieldDecryption',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'enum IdentityRegistry.DataField', name: 'field', type: 'uint8' }],
    name: 'getPendingFieldHandle',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  // View Shared Data
  {
    inputs: [
      { internalType: 'address', name: 'dataOwner', type: 'address' },
      { internalType: 'enum IdentityRegistry.DataField', name: 'field', type: 'uint8' },
    ],
    name: 'viewSharedField',
    outputs: [{ internalType: 'uint64', name: '', type: 'uint64' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'dataOwner', type: 'address' },
      { internalType: 'address', name: 'requester', type: 'address' },
    ],
    name: 'getGrantedFields',
    outputs: [{ internalType: 'bool[7]', name: 'granted', type: 'bool[7]' }],
    stateMutability: 'view',
    type: 'function',
  },
  // Query Functions
  {
    inputs: [],
    name: 'getAllProfileOwners',
    outputs: [{ internalType: 'address[]', name: '', type: 'address[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getMyIncomingRequests',
    outputs: [{ internalType: 'address[]', name: '', type: 'address[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getMyOutgoingRequests',
    outputs: [{ internalType: 'address[]', name: '', type: 'address[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'dataOwner', type: 'address' },
      { internalType: 'address', name: 'requester', type: 'address' },
    ],
    name: 'getAccessRequestStatus',
    outputs: [
      { internalType: 'bool', name: 'exists', type: 'bool' },
      { internalType: 'bool', name: 'pending', type: 'bool' },
      { internalType: 'bool', name: 'granted', type: 'bool' },
      { internalType: 'string', name: 'message', type: 'string' },
      { internalType: 'uint256', name: 'timestamp', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'hasProfile',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'profileOwners',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
