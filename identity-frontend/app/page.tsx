'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { useIdentity } from '../hooks/useIdentity';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const { authenticated, login } = usePrivy();
  const { getAllProfiles, hasProfile: checkHasProfile, loading } = useIdentity();

  const [profiles, setProfiles] = useState<string[]>([]);
  const [userHasProfile, setUserHasProfile] = useState(false);
  const [loadingProfiles, setLoadingProfiles] = useState(true);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      setLoadingProfiles(true);
      const owners = await getAllProfiles();
      setProfiles(owners);
    } catch (error) {
      console.error('Error loading profiles:', error);
    } finally {
      setLoadingProfiles(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          🔐 Confidential Identity
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
          Manage your personal data privately with selective sharing powered by FHEVM
        </p>

        {!authenticated ? (
          <button
            onClick={login}
            className="mt-8 bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition font-medium"
          >
            Connect Wallet to Get Started
          </button>
        ) : (
          <div className="mt-8 flex gap-4 justify-center">
            <Link
              href="/profile/create"
              className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition font-medium"
            >
              Create Profile
            </Link>
            <Link
              href="/dashboard"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              My Dashboard
            </Link>
            <Link
              href="/requests"
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition font-medium"
            >
              Access Requests
            </Link>
          </div>
        )}
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-3xl mb-4">🔒</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Private by Default
          </h3>
          <p className="text-gray-600 text-sm">
            All your personal data is encrypted using FHEVM. Only you can decrypt and share it.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-3xl mb-4">🎯</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Selective Sharing
          </h3>
          <p className="text-gray-600 text-sm">
            Choose exactly which fields to share with each requester. Revoke access anytime.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-3xl mb-4">⛓️</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            On-Chain Security
          </h3>
          <p className="text-gray-600 text-sm">
            Your data lives on blockchain, fully encrypted. No central server can access it.
          </p>
        </div>
      </div>

      {/* Profile List */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Registered Profiles ({profiles.length})
        </h2>

        {loadingProfiles ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : profiles.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-600">No profiles yet. Be the first to create one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((address) => (
              <Link
                key={address}
                href={`/profile/${address}`}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">👤</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-sm text-gray-900 truncate">
                      {address}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-purple-600 font-medium">
                  View Profile →
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
