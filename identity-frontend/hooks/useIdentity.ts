// Main hook for identity operations (similar to useCampaigns)
import { useState, useCallback } from 'react';
import { useWallets } from '@privy-io/react-auth';
import { createPublicClient, createWalletClient, custom, http } from 'viem';
import { sepolia } from 'viem/chains';
import { useFhevm } from '../contexts/FhevmContext';
import { useEncrypt } from './useEncrypt';
import { useDecrypt } from './useDecrypt';
import { IDENTITY_REGISTRY_ADDRESS } from '../lib/contracts/config';
import { IDENTITY_REGISTRY_ABI } from '../lib/contracts/identityAbi';
import { DataField, FieldAccessMap } from '../types';
import { convertProfileToUint64 } from '../lib/utils/encoding';

/**
 * Convert Uint8Array to hex string
 */
function toHex(bytes: Uint8Array): `0x${string}` {
  return `0x${Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')}` as `0x${string}`;
}

export function useIdentity() {
  const { wallets } = useWallets();
  const { instance: fhevm, isInitialized } = useFhevm();
  const { encryptProfile } = useEncrypt();
  const { decrypt } = useDecrypt();
  const [loading, setLoading] = useState(false);

  const wallet = wallets[0];

  // Create public client
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(),
  });

  // Create wallet client
  const getWalletClient = useCallback(async () => {
    if (!wallet) throw new Error('No wallet connected');
    const provider = await wallet.getEthereumProvider();
    return createWalletClient({
      chain: sepolia,
      transport: custom(provider),
      account: wallet.address as `0x${string}`,
    });
  }, [wallet]);

  // ============================================
  // PROFILE MANAGEMENT
  // ============================================

  /**
   * Create a new profile with encrypted data
   */
  const createProfile = useCallback(
    async (profileData: {
      email: string;
      dob: string;
      name: string;
      idNumber: string;
      location: string;
      experience: string;
      country: string;
    }) => {
      if (!isInitialized || !fhevm) throw new Error('FHEVM not initialized');
      if (!wallet) throw new Error('Wallet not connected');

      setLoading(true);
      try {
        const client = await getWalletClient();

        // Convert strings to uint64 values
        const numericData = convertProfileToUint64(profileData);

        // Encrypt all fields at once
        const { handles, inputProof } = await encryptProfile(numericData);

        // Convert Uint8Array to hex strings for viem
        const hash = await client.writeContract({
          address: IDENTITY_REGISTRY_ADDRESS,
          abi: IDENTITY_REGISTRY_ABI,
          functionName: 'createProfile',
          args: [
            toHex(handles[0]), // email
            toHex(handles[1]), // dob
            toHex(handles[2]), // name
            toHex(handles[3]), // idNumber
            toHex(handles[4]), // location
            toHex(handles[5]), // experience
            toHex(handles[6]), // country
            toHex(inputProof), // proof for all fields
          ],
        });

        await publicClient.waitForTransactionReceipt({ hash });
        return hash;
      } finally {
        setLoading(false);
      }
    },
    [isInitialized, fhevm, wallet, getWalletClient, publicClient, encryptProfile]
  );

  /**
   * Update existing profile
   */
  const updateProfile = useCallback(
    async (profileData: {
      email: string;
      dob: string;
      name: string;
      idNumber: string;
      location: string;
      experience: string;
      country: string;
    }) => {
      if (!isInitialized || !fhevm) throw new Error('FHEVM not initialized');
      if (!wallet) throw new Error('Wallet not connected');

      setLoading(true);
      try {
        const client = await getWalletClient();

        // Convert strings to uint64 values
        const numericData = convertProfileToUint64(profileData);

        // Encrypt all fields at once
        const { handles, inputProof } = await encryptProfile(numericData);

        // Convert Uint8Array to hex strings for viem
        const hash = await client.writeContract({
          address: IDENTITY_REGISTRY_ADDRESS,
          abi: IDENTITY_REGISTRY_ABI,
          functionName: 'updateProfile',
          args: [
            toHex(handles[0]), // email
            toHex(handles[1]), // dob
            toHex(handles[2]), // name
            toHex(handles[3]), // idNumber
            toHex(handles[4]), // location
            toHex(handles[5]), // experience
            toHex(handles[6]), // country
            toHex(inputProof), // proof for all fields
          ],
        });

        await publicClient.waitForTransactionReceipt({ hash });
        return hash;
      } finally {
        setLoading(false);
      }
    },
    [isInitialized, fhevm, wallet, getWalletClient, publicClient, encryptProfile]
  );

  // ============================================
  // ACCESS REQUEST MANAGEMENT
  // ============================================

  /**
   * Request access to someone's profile
   */
  const requestAccess = useCallback(
    async (dataOwner: string, message: string) => {
      if (!wallet) throw new Error('Wallet not connected');

      setLoading(true);
      try {
        const client = await getWalletClient();

        const hash = await client.writeContract({
          address: IDENTITY_REGISTRY_ADDRESS,
          abi: IDENTITY_REGISTRY_ABI,
          functionName: 'requestAccess',
          args: [dataOwner as `0x${string}`, message],
        });

        await publicClient.waitForTransactionReceipt({ hash });
        return hash;
      } finally {
        setLoading(false);
      }
    },
    [wallet, getWalletClient, publicClient]
  );

  /**
   * Grant access to specific fields (after decryption)
   */
  const grantAccess = useCallback(
    async (requester: string, fields: DataField[]) => {
      if (!wallet) throw new Error('Wallet not connected');

      setLoading(true);
      try {
        const client = await getWalletClient();

        const hash = await client.writeContract({
          address: IDENTITY_REGISTRY_ADDRESS,
          abi: IDENTITY_REGISTRY_ABI,
          functionName: 'grantAccess',
          args: [requester as `0x${string}`, fields],
        });

        await publicClient.waitForTransactionReceipt({ hash });
        return hash;
      } finally {
        setLoading(false);
      }
    },
    [wallet, getWalletClient, publicClient]
  );

  /**
   * Revoke access from a requester
   */
  const revokeAccess = useCallback(
    async (requester: string) => {
      if (!wallet) throw new Error('Wallet not connected');

      setLoading(true);
      try {
        const client = await getWalletClient();

        const hash = await client.writeContract({
          address: IDENTITY_REGISTRY_ADDRESS,
          abi: IDENTITY_REGISTRY_ABI,
          functionName: 'revokeAccess',
          args: [requester as `0x${string}`],
        });

        await publicClient.waitForTransactionReceipt({ hash });
        return hash;
      } finally {
        setLoading(false);
      }
    },
    [wallet, getWalletClient, publicClient]
  );

  // ============================================
  // CLIENT-SIDE DECRYPTION (Reencryption approach)
  // ============================================

  /**
   * Get encrypted field and decrypt it client-side
   */
  const getAndDecryptField = useCallback(
    async (dataOwner: string, field: DataField): Promise<bigint> => {
      if (!isInitialized) throw new Error('FHEVM not initialized');
      if (!wallet) throw new Error('Wallet not connected');

      const client = await getWalletClient();

      // Get the encrypted field handle using wallet client (requires msg.sender to be authorized)
      const encryptedHandle = await publicClient.readContract({
        address: IDENTITY_REGISTRY_ADDRESS,
        abi: IDENTITY_REGISTRY_ABI,
        functionName: 'getEncryptedField',
        args: [dataOwner as `0x${string}`, field],
        account: client.account,
      });

      // Decrypt client-side using useDecrypt hook (handles EIP712 signature)
      const decryptedValue = await decrypt(encryptedHandle as string, IDENTITY_REGISTRY_ADDRESS);

      return decryptedValue;
    },
    [isInitialized, wallet, publicClient, getWalletClient, decrypt]
  );

  /**
   * Get and decrypt your own field (uses getMyProfile, no ACL check needed)
   */
  const getAndDecryptMyField = useCallback(
    async (field: DataField): Promise<bigint> => {
      if (!isInitialized) throw new Error('FHEVM not initialized');
      if (!wallet) throw new Error('Wallet not connected');

      const client = await getWalletClient();

      // Get all your profile handles (no ACL check required for own profile)
      const profileHandles = await publicClient.readContract({
        address: IDENTITY_REGISTRY_ADDRESS,
        abi: IDENTITY_REGISTRY_ABI,
        functionName: 'getMyProfile',
        account: client.account,
      });

      // Map field to handle index
      const fieldIndex = field; // DataField enum values are 0-6
      const encryptedHandle = profileHandles[fieldIndex];

      // Decrypt client-side
      const decryptedValue = await decrypt(encryptedHandle as string, IDENTITY_REGISTRY_ADDRESS);

      return decryptedValue;
    },
    [isInitialized, wallet, publicClient, getWalletClient, decrypt]
  );

  // ============================================
  // QUERY FUNCTIONS
  // ============================================

  /**
   * Get all profile owners
   */
  const getAllProfiles = useCallback(async () => {
    const owners = await publicClient.readContract({
      address: IDENTITY_REGISTRY_ADDRESS,
      abi: IDENTITY_REGISTRY_ABI,
      functionName: 'getAllProfileOwners',
    });
    return owners;
  }, [publicClient]);

  /**
   * Check if an address has a profile
   */
  const hasProfile = useCallback(
    async (address: string) => {
      const result = await publicClient.readContract({
        address: IDENTITY_REGISTRY_ADDRESS,
        abi: IDENTITY_REGISTRY_ABI,
        functionName: 'hasProfile',
        args: [address as `0x${string}`],
      });
      return result;
    },
    [publicClient]
  );

  /**
   * Get my own profile (all encrypted field handles)
   */
  const getMyProfile = useCallback(async () => {
    if (!wallet) throw new Error('Wallet not connected');

    const client = await getWalletClient();
    const result = await publicClient.readContract({
      address: IDENTITY_REGISTRY_ADDRESS,
      abi: IDENTITY_REGISTRY_ABI,
      functionName: 'getMyProfile',
      account: client.account,
    });

    return {
      emailHandle: result[0],
      dobHandle: result[1],
      nameHandle: result[2],
      idNumberHandle: result[3],
      locationHandle: result[4],
      experienceHandle: result[5],
      countryHandle: result[6],
    };
  }, [wallet, getWalletClient, publicClient]);

  /**
   * Get incoming access requests
   */
  const getMyIncomingRequests = useCallback(async () => {
    if (!wallet) throw new Error('Wallet not connected');

    const client = await getWalletClient();
    const requests = await publicClient.readContract({
      address: IDENTITY_REGISTRY_ADDRESS,
      abi: IDENTITY_REGISTRY_ABI,
      functionName: 'getMyIncomingRequests',
      account: client.account,
    });
    return requests;
  }, [wallet, getWalletClient, publicClient]);

  /**
   * Get outgoing access requests
   */
  const getMyOutgoingRequests = useCallback(async () => {
    if (!wallet) throw new Error('Wallet not connected');

    const client = await getWalletClient();
    const requests = await publicClient.readContract({
      address: IDENTITY_REGISTRY_ADDRESS,
      abi: IDENTITY_REGISTRY_ABI,
      functionName: 'getMyOutgoingRequests',
      account: client.account,
    });
    return requests;
  }, [wallet, getWalletClient, publicClient]);

  /**
   * Get access request status
   */
  const getAccessRequestStatus = useCallback(
    async (dataOwner: string, requester: string) => {
      const result = await publicClient.readContract({
        address: IDENTITY_REGISTRY_ADDRESS,
        abi: IDENTITY_REGISTRY_ABI,
        functionName: 'getAccessRequestStatus',
        args: [dataOwner as `0x${string}`, requester as `0x${string}`],
      });

      return {
        exists: result[0],
        pending: result[1],
        granted: result[2],
        message: result[3],
        timestamp: result[4],
      };
    },
    [publicClient]
  );

  /**
   * Get granted fields for a requester
   */
  const getGrantedFields = useCallback(
    async (dataOwner: string, requester: string): Promise<FieldAccessMap> => {
      const result = await publicClient.readContract({
        address: IDENTITY_REGISTRY_ADDRESS,
        abi: IDENTITY_REGISTRY_ABI,
        functionName: 'getGrantedFields',
        args: [dataOwner as `0x${string}`, requester as `0x${string}`],
      });

      return {
        [DataField.EMAIL]: result[0],
        [DataField.DOB]: result[1],
        [DataField.NAME]: result[2],
        [DataField.ID_NUMBER]: result[3],
        [DataField.LOCATION]: result[4],
        [DataField.EXPERIENCE]: result[5],
        [DataField.COUNTRY]: result[6],
      };
    },
    [publicClient]
  );

  return {
    // Profile management
    createProfile,
    updateProfile,
    hasProfile,
    getMyProfile,

    // Access management
    requestAccess,
    grantAccess,
    revokeAccess,

    // Client-side decryption
    getAndDecryptField,
    getAndDecryptMyField,

    // Queries
    getAllProfiles,
    getMyIncomingRequests,
    getMyOutgoingRequests,
    getAccessRequestStatus,
    getGrantedFields,

    // State
    loading,
  };
}
