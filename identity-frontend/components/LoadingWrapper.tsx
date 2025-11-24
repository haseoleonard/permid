'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useFhevm } from '../contexts/FhevmContext';

export default function LoadingWrapper({ children }: { children: React.ReactNode }) {
    const { ready: privyReady } = usePrivy();
    const { isLoading: fhevmLoading, error: fhevmError } = useFhevm();

    if (!privyReady) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900 relative overflow-hidden">
                {/* Animated background circles */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl"></div>
                </div>

                <div className="text-center relative z-10">
                    {/* Modern spinner */}
                    <div className="relative mx-auto mb-8 w-24 h-24">
                        <div className="absolute inset-0 rounded-full border-4 border-slate-700"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-t-emerald-400 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                        <div className="absolute inset-2 rounded-full bg-slate-800 backdrop-blur-sm flex items-center justify-center">
                            <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-3 animate-fade-in">
                        Permid
                    </h2>
                    <p className="text-slate-400 text-lg">
                        Initializing secure wallet connection...
                    </p>

                    {/* Loading dots */}
                    <div className="flex justify-center gap-2 mt-6">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (fhevmLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900 relative overflow-hidden">
                {/* Animated grid background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

                {/* Floating orbs */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-float"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-float delay-1000"></div>
                </div>

                <div className="text-center max-w-lg relative z-10 px-4">
                    {/* Advanced spinner with multiple rings */}
                    <div className="relative mx-auto mb-8 w-32 h-32">
                        <div className="absolute inset-0 rounded-full border-4 border-slate-700"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-t-emerald-400 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                        <div className="absolute inset-3 rounded-full border-4 border-slate-700"></div>
                        <div className="absolute inset-3 rounded-full border-4 border-t-transparent border-r-transparent border-b-cyan-400 border-l-transparent animate-spin-slow"></div>
                        <div className="absolute inset-6 rounded-full bg-slate-800 backdrop-blur-sm flex items-center justify-center">
                            <div className="text-4xl">🔐</div>
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-3">
                        Activating Encryption Layer
                    </h2>
                    <p className="text-slate-400 text-lg mb-6">
                        Loading fully homomorphic encryption system
                    </p>

                    {/* Info card with glassmorphism */}
                    <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-6 shadow-2xl">
                        <div className="flex items-start gap-3 text-left">
                            <div className="text-2xl mt-1">⚡</div>
                            <div>
                                <p className="text-white font-medium mb-1">Powered by Zama FHEVM</p>
                                <p className="text-slate-400 text-sm">
                                    Your data will be encrypted on-chain, ensuring complete privacy while maintaining functionality
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-6 w-64 mx-auto h-1 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full animate-progress"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (fhevmError) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

                <div className="text-center max-w-md relative z-10 px-4">
                    {/* Error icon with animation */}
                    <div className="relative mx-auto mb-6 w-24 h-24">
                        <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping"></div>
                        <div className="relative bg-slate-800 border-2 border-red-500 rounded-full w-24 h-24 flex items-center justify-center shadow-2xl">
                            <svg className="w-12 h-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-3">
                        Initialization Failed
                    </h2>
                    <p className="text-slate-400 mb-6">
                        Unable to load the encryption system
                    </p>

                    {/* Error details */}
                    <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-xl p-4 mb-6 text-left">
                        <p className="text-slate-500 text-xs font-medium mb-2">Error Details:</p>
                        <p className="text-red-400 text-sm font-mono break-all">
                            {fhevmError.message}
                        </p>
                    </div>

                    {/* Action button */}
                    <button
                        onClick={() => window.location.reload()}
                        className="group relative px-8 py-4 bg-emerald-500 text-white rounded-xl font-semibold overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl hover:bg-emerald-400"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Reload Application
                        </span>
                    </button>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}