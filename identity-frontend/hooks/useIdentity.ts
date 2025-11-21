// Main hook for identity operations (similar to useCampaigns)
import { useState, useCallback } from 'react';
import { useWallets } from '@privy-io/react-auth';
import { createPublicClient, createWalletClient, custom, http } from 'viem';
import { sepolia } from 'viem/chains';
import { useFhevm } from '../contexts/FhevmContext';
import { usePublicDecrypt } from './usePublicDecrypt';
import { IDENTITY_REGISTRY_ADDRESS } from '../lib/contracts/config';
import { IDENTITY_REGISTRY_ABI } from '../lib/contracts/identityAbi';
import { DataField, DecryptStatus, DecryptionInfo, FieldAccessMap } from '../types';

export function useIdentity() {
  const { wallets } = useWallets();
  const { instance: fhevm, isInitialized } = useFhevm();
  const { publicDecrypt } = usePublicDecrypt();
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

        // Encrypt all fields
        const encryptedEmail = await fhevm.encrypt64(BigInt(profileData.email));
        const encryptedDob = await fhevm.encrypt64(BigInt(profileData.dob));
        const encryptedName = await fhevm.encrypt64(BigInt(profileData.name));
        const encryptedIdNumber = await fhevm.encrypt64(BigInt(profileData.idNumber));
        const encryptedLocation = await fhevm.encrypt64(BigInt(profileData.location));
        const encryptedExperience = await fhevm.encrypt64(BigInt(profileData.experience));
        const encryptedCountry = await fhevm.encrypt64(BigInt(profileData.country));

        const hash = await client.writeContract({
          address: IDENTITY_REGISTRY_ADDRESS,
          abi: IDENTITY_REGISTRY_ABI,
          functionName: 'createProfile',
          args: [
            encryptedEmail,
            encryptedDob,
            encryptedName,
            encryptedIdNumber,
            encryptedLocation,
            encryptedExperience,
            encryptedCountry,
          ],
        });

        await publicClient.waitForTransactionReceipt({ hash });
        return hash;
      } finally {
        setLoading(false);
      }
    },
    [isInitialized, fhevm, wallet, getWalletClient, publicClient]
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

        // Encrypt all fields
        const encryptedEmail = await fhevm.encrypt64(BigInt(profileData.email));
        const encryptedDob = await fhevm.encrypt64(BigInt(profileData.dob));
        const encryptedName = await fhevm.encrypt64(BigInt(profileData.name));
        const encryptedIdNumber = await fhevm.encrypt64(BigInt(profileData.idNumber));
        const encryptedLocation = await fhevm.encrypt64(BigInt(profileData.location));
        const encryptedExperience = await fhevm.encrypt64(BigInt(profileData.experience));
        const encryptedCountry = await fhevm.encrypt64(BigInt(profileData.country));

        const hash = await client.writeContract({
          address: IDENTITY_REGISTRY_ADDRESS,
          abi: IDENTITY_REGISTRY_ABI,
          functionName: 'updateProfile',
          args: [
            encryptedEmail,
            encryptedDob,
            encryptedName,
            encryptedIdNumber,
            encryptedLocation,
            encryptedExperience,
            encryptedCountry,
          ],
        });

        await publicClient.waitForTransactionReceipt({ hash });
        return hash;
      } finally {
        setLoading(false);
      }
    },
    [isInitialized, fhevm, wallet, getWalletClient, publicClient]
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
  // DECRYPTION (v0.9 self-relaying workflow)
  // ============================================

  /**
   * Complete field decryption workflow (all 4 steps)
   */
  const completeFieldDecryption = useCallback(
    async (field: DataField) => {
      if (!isInitialized || !fhevm) throw new Error('FHEVM not initialized');
      if (!wallet) throw new Error('Wallet not connected');

      const client = await getWalletClient();

      // Step 1: Mark as publicly decryptable
      const markHash = await client.writeContract({
        address: IDENTITY_REGISTRY_ADDRESS,
        abi: IDENTITY_REGISTRY_ABI,
        functionName: 'requestFieldDecryption',
        args: [field],
      });
      await publicClient.waitForTransactionReceipt({ hash: markHash });

      // Step 2: Get encrypted handle
      const handle = await publicClient.readContract({
        address: IDENTITY_REGISTRY_ADDRESS,
        abi: IDENTITY_REGISTRY_ABI,
        functionName: 'getPendingFieldHandle',
        args: [field],
      });

      // Step 3: Decrypt using SDK
      const { cleartext, abiEncodedCleartext, decryptionProof } = await publicDecrypt(
        handle,
        IDENTITY_REGISTRY_ADDRESS
      );

      // Step 4: Submit proof
      const submitHash = await client.writeContract({
        address: IDENTITY_REGISTRY_ADDRESS,
        abi: IDENTITY_REGISTRY_ABI,
        functionName: 'submitFieldDecryption',
        args: [field, cleartext, abiEncodedCleartext, decryptionProof],
      });
      await publicClient.waitForTransactionReceipt({ hash: submitHash });

      return { cleartext, hash: submitHash };
    },
    [isInitialized, fhevm, wallet, getWalletClient, publicClient, publicDecrypt]
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
   * Get incoming access requests
   */
  const getIncomingRequests = useCallback(async () => {
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
  const getOutgoingRequests = useCallback(async () => {
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

  /**
   * View shared field value
   */
  const viewSharedField = useCallback(
    async (dataOwner: string, field: DataField) => {
      if (!wallet) throw new Error('Wallet not connected');

      const value = await publicClient.readContract({
        address: IDENTITY_REGISTRY_ADDRESS,
        abi: IDENTITY_REGISTRY_ABI,
        functionName: 'viewSharedField',
        args: [dataOwner as `0x${string}`, field],
      });

      return value;
    },
    [wallet, publicClient]
  );

  return {
    // Profile management
    createProfile,
    updateProfile,
    hasProfile,

    // Access management
    requestAccess,
    grantAccess,
    revokeAccess,

    // Decryption
    completeFieldDecryption,

    // Queries
    getAllProfiles,
    getIncomingRequests,
    getOutgoingRequests,
    getAccessRequestStatus,
    getGrantedFields,
    viewSharedField,

    // State
    loading,
  };
}
