'use client';

import { useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useIdentity } from '../hooks/useIdentity';
import Link from 'next/link';

export default function Home() {
  const { authenticated, login } = usePrivy();
  const { getAllProfiles } = useIdentity();

  const [profiles, setProfiles] = useState<string[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);

  useEffect(() => {
    const loadProfiles = async () => {
      try {
        setLoadingProfiles(true);
        const owners = await getAllProfiles();
        setProfiles([...owners]);
      } catch (error) {
        console.error('Error loading profiles:', error);
      } finally {
        setLoadingProfiles(false);
      }
    };

    loadProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative overflow-hidden bg-white">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-slate-50 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-100/30 rounded-full blur-3xl animate-float delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Hero Section */}
        <div className="text-center mb-20 animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 border border-slate-200 rounded-full mb-6 animate-slide-up">
            <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-semibold text-slate-700">Powered by FHEVM Encryption</span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 animate-slide-up">
            <span className="text-slate-900">
              Permid
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed animate-slide-up">
            Your personal data, encrypted on-chain.
            <span className="block text-emerald-600 font-semibold mt-2">Share selectively. Own completely.</span>
          </p>

          {/* CTA Buttons */}
          {!authenticated ? (
            <button
              onClick={login}
              className="group relative inline-flex items-center gap-3 px-10 py-5 bg-emerald-600 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 hover:bg-emerald-500 transition-all duration-300 animate-scale-in"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Connect Wallet</span>
            </button>
          ) : (
            <div className="flex gap-4 justify-center flex-wrap animate-scale-in">
              <Link
                href="/profile/create"
                className="group relative inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 hover:bg-slate-800 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Create Profile</span>
              </Link>
              <Link
                href="/dashboard"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 border-slate-200"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Dashboard
              </Link>
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {/* Feature 1 */}
          <div className="group relative bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-slate-200 animate-slide-up">
            <div className="absolute -top-6 left-8 w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3 mt-4">
              Private by Default
            </h3>
            <p className="text-slate-600 leading-relaxed">
              All your personal data is encrypted using FHEVM. Only you can decrypt and share it.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="group relative bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-slate-200 animate-slide-up delay-100">
            <div className="absolute -top-6 left-8 w-12 h-12 bg-cyan-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3 mt-4">
              Selective Sharing
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Choose exactly which fields to share with each requester. Revoke access anytime.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="group relative bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-slate-200 animate-slide-up delay-200">
            <div className="absolute -top-6 left-8 w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3 mt-4">
              On-Chain Security
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Your data lives on blockchain, fully encrypted. No central server can access it.
            </p>
          </div>
        </div>

        {/* Profile Section */}
        <div className="animate-fade-in">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                Community Profiles
              </h2>
              <p className="text-slate-600">
                {profiles.length} {profiles.length === 1 ? 'member' : 'members'} in the network
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-emerald-700">Live</span>
            </div>
          </div>

          {/* Profiles Grid */}
          {loadingProfiles ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative w-20 h-20 mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
                <div className="absolute inset-0 rounded-full border-4 border-t-emerald-600 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
              </div>
              <p className="text-slate-600 font-medium">Loading profiles...</p>
            </div>
          ) : profiles.length === 0 ? (
            <div className="relative bg-slate-50 rounded-2xl p-12 text-center border-2 border-dashed border-slate-300">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No profiles yet</h3>
              <p className="text-slate-600 mb-6">Be the first to create a Permid profile!</p>
              {authenticated && (
                <Link
                  href="/profile/create"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-500 hover:scale-105 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create First Profile
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profiles.map((address, index) => (
                <Link
                  key={address}
                  href={`/profile/${address}`}
                  className="group relative bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-200 animate-scale-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                      <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                        <svg className="w-7 h-7 text-slate-600 group-hover:text-emerald-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 mb-1">Profile Member</p>
                      <p className="font-mono text-xs text-slate-500 truncate">
                        {address.slice(0, 6)}...{address.slice(-4)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-emerald-600 font-semibold group-hover:gap-2 flex items-center gap-1 transition-all">
                      View Profile
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                    <div className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
                      Active
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
