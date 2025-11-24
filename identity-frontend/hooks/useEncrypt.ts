import { useState, useCallback } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useFhevm } from '../contexts/FhevmContext';
import { IDENTITY_REGISTRY_ADDRESS } from '../lib/contracts/config';

interface EncryptedProfileData {
  handles: Uint8Array[];
  inputProof: Uint8Array;
}

export const useEncrypt = () => {
  const { instance, isInitialized } = useFhevm();
  const { user } = usePrivy();
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Encrypt a single uint64 value
   */
  const encrypt64 = useCallback(
    async (value: bigint): Promise<{ encryptedData: Uint8Array; proof: Uint8Array }> => {
      if (!isInitialized || !instance) {
        throw new Error('FHEVM not initialized');
      }

      const userAddress = user?.wallet?.address;
      if (!userAddress) {
        throw new Error('Wallet not connected');
      }

      setIsEncrypting(true);
      setError(null);

      try {
        const MAX_UINT64 = BigInt('18446744073709551615');
        if (value < 0n || value > MAX_UINT64) {
          throw new Error(`Value out of range for uint64: ${value}`);
        }

        const input = instance.createEncryptedInput(IDENTITY_REGISTRY_ADDRESS, userAddress);
        input.add64(value);
        const encryptedInput = await input.encrypt();

        if (!encryptedInput.handles?.[0] || !encryptedInput.inputProof) {
          throw new Error('Invalid encryption result');
        }

        return {
          encryptedData: encryptedInput.handles[0],
          proof: encryptedInput.inputProof,
        };
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Encryption failed';
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setIsEncrypting(false);
      }
    },
    [instance, isInitialized, user]
  );

  /**
   * Encrypt profile data (all 7 fields at once)
   * This is more efficient than encrypting each field separately
   */
  const encryptProfile = useCallback(
    async (profileData: {
      email: bigint;
      dob: bigint;
      name: bigint;
      idNumber: bigint;
      location: bigint;
      experience: bigint;
      country: bigint;
    }): Promise<EncryptedProfileData> => {
      if (!isInitialized || !instance) {
        throw new Error('FHEVM not initialized');
      }

      const userAddress = user?.wallet?.address;
      if (!userAddress) {
        throw new Error('Wallet not connected');
      }

      setIsEncrypting(true);
      setError(null);

      try {
        // Create encrypted input for the contract
        const input = instance.createEncryptedInput(IDENTITY_REGISTRY_ADDRESS, userAddress);

        // Add all 7 fields in order
        input.add64(profileData.email);
        input.add64(profileData.dob);
        input.add64(profileData.name);
        input.add64(profileData.idNumber);
        input.add64(profileData.location);
        input.add64(profileData.experience);
        input.add64(profileData.country);

        // Encrypt all at once
        const encryptedInput = await input.encrypt();

        if (!encryptedInput.handles || encryptedInput.handles.length !== 7) {
          throw new Error('Invalid encryption result: expected 7 handles');
        }

        if (!encryptedInput.inputProof) {
          throw new Error('Invalid encryption result: missing input proof');
        }

        return {
          handles: encryptedInput.handles,
          inputProof: encryptedInput.inputProof,
        };
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Encryption failed';
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setIsEncrypting(false);
      }
    },
    [instance, isInitialized, user]
  );

  return { encrypt64, encryptProfile, isEncrypting, error };
};
