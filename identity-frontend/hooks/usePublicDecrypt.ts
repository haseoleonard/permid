import { useState } from "react";
import { useFhevm } from "../contexts/FhevmContext";

/**
 * Hook for using the v0.9 self-relaying public decryption workflow
 * @returns Functions to decrypt encrypted handles using the relayer SDK
 */
export function usePublicDecrypt() {
  const { instance, isInitialized } = useFhevm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Decrypt an encrypted handle using the v0.9 publicDecrypt API
   * @param handle The encrypted handle (bytes32 as hex string)
   * @param contractAddress The contract address that owns the encrypted value
   * @returns Object containing cleartext value and cryptographic proof
   */
  const publicDecrypt = async (
    handle: string,
    contractAddress: string
  ): Promise<{ cleartext: bigint; proof: Uint8Array }> => {
    setLoading(true);
    setError(null);

    try {
      if (!instance || !isInitialized) {
        throw new Error(
          "FHEVM not initialized. Please wait for initialization to complete."
        );
      }

      if (!instance.publicDecrypt) {
        throw new Error("publicDecrypt method not available on FHEVM instance.");
      }

      console.log("🔓 Starting public decryption...");
      console.log("  - Handle:", handle);
      console.log("  - Contract:", contractAddress);

      // Call publicDecrypt on the FHEVM instance
      // Based on docs: instance.publicDecrypt([handles])
      const result = await instance.publicDecrypt([handle]);

      console.log("publicDecrypt raw result:", result);

      if (!result || typeof result !== 'object') {
        throw new Error("publicDecrypt returned invalid result");
      }

      // v0.9 SDK returns: { clearValues, abiEncodedClearValues, decryptionProof }
      const { clearValues, decryptionProof } = result;

      if (!clearValues) {
        throw new Error("clearValues not found in decryption result");
      }

      // clearValues is an object with handle as key
      const decryptedValue = clearValues[handle as keyof typeof clearValues];

      if (decryptedValue === undefined || decryptedValue === null) {
        console.error("❌ clearValues object:", clearValues);
        console.error("❌ Looking for handle:", handle);
        throw new Error("Decryption failed: no value returned for handle");
      }

      // Convert to bigint
      const cleartextBigInt =
        typeof decryptedValue === "bigint"
          ? decryptedValue
          : typeof decryptedValue === "number"
          ? BigInt(decryptedValue)
          : typeof decryptedValue === "boolean"
          ? BigInt(decryptedValue ? 1 : 0)
          : BigInt(decryptedValue);

      // Extract the proof
      let proofUint8: Uint8Array;
      if (decryptionProof) {
        // Convert hex string to Uint8Array
        const proofHex = decryptionProof.startsWith('0x')
          ? decryptionProof.slice(2)
          : decryptionProof;
        proofUint8 = new Uint8Array(
          proofHex.match(/.{1,2}/g)?.map((byte: string) => parseInt(byte, 16)) || []
        );
        console.log("📝 Proof extracted, length:", proofUint8.length, "bytes");
      } else {
        console.error("❌ No decryptionProof in result!");
        throw new Error("Decryption proof not found in result");
      }

      return {
        cleartext: cleartextBigInt,
        proof: proofUint8,
      };
    } catch (err) {
      console.error("❌ Public decryption failed:", err);
      const error =
        err instanceof Error ? err : new Error("Unknown decryption error");
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    publicDecrypt,
    loading,
    error,
  };
}
