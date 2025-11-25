'use client';

import { PrivyProvider as BasePrivyProvider } from '@privy-io/react-auth';
import { sepolia } from 'viem/chains';

export default function PrivyProvider({ children }: { children: React.ReactNode }) {
  return (
    <BasePrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
      config={{
        appearance: {
          theme: 'light',
          accentColor: '#10b981',
          logo: '/logo.png',
          landingHeader: "Permid",
          loginMessage: "Manage your identity with full encryption and control"
        },
        loginMethods: ['wallet'],
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'users-without-wallets',
          }
        },
        defaultChain: sepolia,
        supportedChains: [sepolia],
      }}
    >
      {children}
    </BasePrivyProvider>
  );
}