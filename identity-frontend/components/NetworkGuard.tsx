'use client';

import { useEffect, useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { sepolia } from 'viem/chains';

export default function NetworkGuard() {
  const { authenticated } = usePrivy();
  const { wallets } = useWallets();
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  useEffect(() => {
    const checkNetwork = async () => {
      if (!authenticated || wallets.length === 0) {
        setIsWrongNetwork(false);
        return;
      }

      try {
        const wallet = wallets[0];
        const provider = await wallet.getEthereumProvider();

        // Get current chain ID
        const chainIdHex = await provider.request({ method: 'eth_chainId' });
        const currentChainId = parseInt(chainIdHex as string, 16);

        // Check if on wrong network
        setIsWrongNetwork(currentChainId !== sepolia.id);
      } catch (error) {
        console.error('Error checking network:', error);
      }
    };

    checkNetwork();

    // Listen for chain changes
    if (wallets.length > 0) {
      wallets[0].getEthereumProvider().then((provider) => {
        provider.on('chainChanged', () => {
          checkNetwork();
        });
      });
    }
  }, [authenticated, wallets]);

  const switchToSepolia = async () => {
    if (wallets.length === 0) return;

    setIsSwitching(true);
    try {
      const wallet = wallets[0];
      const provider = await wallet.getEthereumProvider();

      // Try to switch to Sepolia
      try {
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${sepolia.id.toString(16)}` }],
        });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${sepolia.id.toString(16)}`,
                chainName: 'Sepolia Testnet',
                nativeCurrency: {
                  name: 'Sepolia ETH',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: ['https://ethereum-sepolia-rpc.publicnode.com'],
                blockExplorerUrls: ['https://sepolia.etherscan.io'],
              },
            ],
          });
        } else {
          throw switchError;
        }
      }

      setIsWrongNetwork(false);
    } catch (error) {
      console.error('Error switching network:', error);
      alert('Failed to switch network. Please switch to Sepolia manually in your wallet.');
    } finally {
      setIsSwitching(false);
    }
  };

  if (!isWrongNetwork) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <div className="text-center">
          {/* Warning Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-amber-100 mb-4">
            <svg
              className="h-10 w-10 text-amber-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-slate-900 mb-2">
            Wrong Network
          </h3>

          {/* Description */}
          <p className="text-slate-600 mb-6">
            This app only works on Sepolia Testnet. Please switch your wallet network to continue.
          </p>

          {/* Network Info */}
          <div className="bg-emerald-50 rounded-lg p-4 mb-6 text-left">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
              <span className="text-sm font-semibold text-slate-900">
                Required Network
              </span>
            </div>
            <div className="ml-4 space-y-1 text-sm text-slate-600">
              <div>
                <span className="font-medium">Network:</span> Sepolia Testnet
              </div>
              <div>
                <span className="font-medium">Chain ID:</span> {sepolia.id}
              </div>
            </div>
          </div>

          {/* Switch Button */}
          <button
            onClick={switchToSepolia}
            disabled={isSwitching}
            className="w-full bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSwitching ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Switching Network...
              </span>
            ) : (
              'Switch to Sepolia'
            )}
          </button>

          {/* Help Text */}
          <p className="text-xs text-slate-500 mt-4">
            Need Sepolia ETH?{' '}
            <a
              href="https://sepoliafaucet.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 hover:underline"
            >
              Get testnet ETH here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
