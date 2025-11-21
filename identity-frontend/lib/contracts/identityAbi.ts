export const IDENTITY_REGISTRY_ABI = [
  {
    "inputs": [],
    "name": "AccessNotGranted",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "CannotRequestOwnData",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidField",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NoAccessRequest",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ProfileAlreadyExists",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ProfileNotFound",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "RequestAlreadyPending",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ZamaProtocolUnsupported",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "dataOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "requester",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "enum DataTypes.DataField[]",
        "name": "fields",
        "type": "uint8[]"
      }
    ],
    "name": "AccessGranted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "requester",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "dataOwner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "message",
        "type": "string"
      }
    ],
    "name": "AccessRequested",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "dataOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "requester",
        "type": "address"
      }
    ],
    "name": "AccessRevoked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "ProfileCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "ProfileUpdated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "accessRequests",
    "outputs": [
      {
        "internalType": "address",
        "name": "requester",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "message",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "pending",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "granted",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "confidentialProtocolId",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "externalEuint64",
        "name": "encryptedEmail",
        "type": "bytes32"
      },
      {
        "internalType": "externalEuint64",
        "name": "encryptedDob",
        "type": "bytes32"
      },
      {
        "internalType": "externalEuint64",
        "name": "encryptedName",
        "type": "bytes32"
      },
      {
        "internalType": "externalEuint64",
        "name": "encryptedIdNumber",
        "type": "bytes32"
      },
      {
        "internalType": "externalEuint64",
        "name": "encryptedLocation",
        "type": "bytes32"
      },
      {
        "internalType": "externalEuint64",
        "name": "encryptedExperience",
        "type": "bytes32"
      },
      {
        "internalType": "externalEuint64",
        "name": "encryptedCountry",
        "type": "bytes32"
      },
      {
        "internalType": "bytes",
        "name": "inputProof",
        "type": "bytes"
      }
    ],
    "name": "createProfile",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "enum DataTypes.DataField",
        "name": "",
        "type": "uint8"
      }
    ],
    "name": "fieldAccess",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "dataOwner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "requester",
        "type": "address"
      }
    ],
    "name": "getAccessRequestStatus",
    "outputs": [
      {
        "internalType": "bool",
        "name": "exists",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "pending",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "granted",
        "type": "bool"
      },
      {
        "internalType": "string",
        "name": "message",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllProfileOwners",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "dataOwner",
        "type": "address"
      },
      {
        "internalType": "enum DataTypes.DataField",
        "name": "field",
        "type": "uint8"
      }
    ],
    "name": "getEncryptedField",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "dataOwner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "requester",
        "type": "address"
      }
    ],
    "name": "getGrantedFields",
    "outputs": [
      {
        "internalType": "bool[7]",
        "name": "granted",
        "type": "bool[7]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getMyIncomingRequests",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getMyOutgoingRequests",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getMyProfile",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "emailHandle",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "dobHandle",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "nameHandle",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "idNumberHandle",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "locationHandle",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "experienceHandle",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "countryHandle",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "requester",
        "type": "address"
      },
      {
        "internalType": "enum DataTypes.DataField[]",
        "name": "fields",
        "type": "uint8[]"
      }
    ],
    "name": "grantAccess",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "hasProfile",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "incomingRequests",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "outgoingRequests",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "profileOwners",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "dataOwner",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "message",
        "type": "string"
      }
    ],
    "name": "requestAccess",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "requester",
        "type": "address"
      }
    ],
    "name": "revokeAccess",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "externalEuint64",
        "name": "encryptedEmail",
        "type": "bytes32"
      },
      {
        "internalType": "externalEuint64",
        "name": "encryptedDob",
        "type": "bytes32"
      },
      {
        "internalType": "externalEuint64",
        "name": "encryptedName",
        "type": "bytes32"
      },
      {
        "internalType": "externalEuint64",
        "name": "encryptedIdNumber",
        "type": "bytes32"
      },
      {
        "internalType": "externalEuint64",
        "name": "encryptedLocation",
        "type": "bytes32"
      },
      {
        "internalType": "externalEuint64",
        "name": "encryptedExperience",
        "type": "bytes32"
      },
      {
        "internalType": "externalEuint64",
        "name": "encryptedCountry",
        "type": "bytes32"
      },
      {
        "internalType": "bytes",
        "name": "inputProof",
        "type": "bytes"
      }
    ],
    "name": "updateProfile",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;
