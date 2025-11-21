# 🔐 Confidential Identity

Privacy-preserving identity management system with selective data sharing, powered by Zama's FHEVM (Fully Homomorphic Encryption Virtual Machine).

## 🌟 Overview

Confidential Identity allows users to store their personal data on-chain in encrypted form and selectively share specific fields with others through a consent-based access control system. All encryption operations happen client-side, ensuring complete privacy.

## ✨ Key Features

- **🔒 Encrypted Personal Data**: All profile data (email, DOB, name, ID, location, experience, country) stored encrypted on-chain
- **🎯 Selective Sharing**: Users choose exactly which fields to share with each requester
- **📝 Access Requests**: Message-based request system with consent management
- **♻️ Revocable Consent**: Users can revoke access at any time
- **⛓️ Fully On-Chain**: No centralized database, all data lives on blockchain
- **🔐 Client-Side Encryption**: FHEVM v0.9 with self-relaying decryption workflow

## 📋 Data Schema

Each profile contains the following encrypted fields:

| Field | Type | Description |
|-------|------|-------------|
| Email | euint64 | Encrypted email hash/identifier |
| DOB | euint64 | Date of birth (Unix timestamp) |
| Name | euint64 | Encrypted name hash/identifier |
| ID Number | euint64 | Government ID number |
| Location | euint64 | Location/city code |
| Experience | euint64 | Years of experience |
| Country | euint64 | Country code (ISO 3166-1 numeric) |

## 🏗️ Architecture

### Smart Contract (`IdentityRegistry.sol`)

- **Profile Management**: Create and update encrypted profiles
- **Access Control**: Request-based permission system
- **Decryption**: FHEVM v0.9 self-relaying workflow for selective field decryption
- **Consent Management**: Grant/revoke access to specific fields

### Frontend (`identity-frontend/`)

Built with Next.js 15, React 19, TypeScript, and Tailwind CSS:

- **Home**: Browse all registered profiles
- **Create Profile**: Form to input encrypted personal data
- **Profile Detail**: View shared fields and request access
- **Dashboard**: Manage your own profile and data
- **Requests**: Review incoming requests and grant/revoke access

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ and npm
- MetaMask or compatible wallet
- Sepolia ETH for gas fees

### 1. Install Contract Dependencies

```bash
cd ~/confidential-identity
npm install
```

### 2. Configure Environment

```bash
# Set your mnemonic (12-24 words)
npx hardhat vars set MNEMONIC

# Optional: Set Infura API key for better RPC
npx hardhat vars set INFURA_API_KEY
```

### 3. Deploy Contracts

```bash
# Deploy to Sepolia
npm run deploy:sepolia

# Or deploy to localhost (for testing)
npx hardhat node  # Terminal 1
npm run deploy:localhost  # Terminal 2
```

**Save the deployed contract address!**

### 4. Setup Frontend

```bash
cd identity-frontend
npm install

# Create environment file
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS=0x... # From deployment
NEXT_PUBLIC_PRIVY_APP_ID=your-privy-app-id  # Get from console.privy.io
```

### 5. Run Frontend

```bash
npm run dev
```

Visit `http://localhost:3000`

## 📖 User Flows

### 1. Create Profile

```
User inputs data → Encrypt with FHEVM → Submit to contract
(All fields encrypted client-side before submission)
```

### 2. Request Access

```
Requester clicks profile → Writes message → Sends request on-chain
(Request stored with message for owner to review)
```

### 3. Grant Access (with Decryption)

```
Owner reviews request → Selects fields to share →
Marks fields as publicly decryptable →
v0.9 self-relaying workflow:
  1. Mark as decryptable
  2. Get encrypted handle
  3. Decrypt with proof
  4. Submit proof on-chain →
Grant access to requester
```

### 4. View Shared Data

```
Requester views profile → Contract checks access →
Returns decrypted shared fields only
```

### 5. Revoke Access

```
Owner revokes consent → Update on-chain →
Requester can no longer view data
```

## 🔧 Technology Stack

### Smart Contracts

- **Solidity**: ^0.8.24
- **FHEVM**: @fhevm/solidity ^0.9.1
- **Hardhat**: ^2.22.15
- **TypeChain**: ^8.3.0

### Frontend

- **Next.js**: ^15.0.0
- **React**: 19.1.0
- **TypeScript**: ^5
- **Tailwind CSS**: ^3.4.17
- **Viem**: ^2.21.53
- **Privy**: ^3.0.1 (Wallet auth)
- **Zama RelayerSDK**: ^0.3.0-5

## 📁 Project Structure

```
confidential-identity/
├── contracts/
│   └── IdentityRegistry.sol       # Main contract
├── scripts/
│   ├── deploy-identity.ts         # Deployment script
│   └── flatten-contracts.sh       # Flatten for Remix
├── identity-frontend/
│   ├── app/                       # Next.js pages
│   │   ├── page.tsx               # Home (profile list)
│   │   ├── profile/
│   │   │   ├── create/page.tsx    # Create profile
│   │   │   └── [address]/page.tsx # View profile
│   │   ├── dashboard/page.tsx     # User dashboard
│   │   └── requests/page.tsx      # Manage requests
│   ├── components/                # React components
│   │   ├── profile/               # Profile components
│   │   ├── consent/               # Consent management
│   │   ├── ui/                    # UI components
│   │   └── layout/                # Header, Footer
│   ├── contexts/                  # React contexts
│   │   ├── FhevmContext.tsx       # FHEVM instance
│   │   ├── SnackbarContext.tsx    # Notifications
│   │   └── PriviProvider.tsx      # Auth provider
│   ├── hooks/                     # Custom hooks
│   │   ├── useIdentity.ts         # Main identity hook
│   │   ├── useDecrypt.ts          # User decryption
│   │   └── usePublicDecrypt.ts    # Public decryption
│   ├── lib/
│   │   ├── fhevm/
│   │   │   └── init.ts            # FHEVM initialization
│   │   └── contracts/
│   │       ├── config.ts          # Contract config
│   │       └── identityAbi.ts     # Contract ABI
│   └── types/
│       └── index.ts               # TypeScript types
├── hardhat.config.ts
├── package.json
└── README.md
```

## 🔐 FHEVM v0.9 Self-Relaying Workflow

When granting access, fields must be decrypted using the 4-step workflow:

1. **Mark as Decryptable**: Contract function marks field as publicly decryptable
2. **Get Handle**: Retrieve the encrypted field handle
3. **Decrypt with Proof**: Use RelayerSDK to decrypt and generate proof
4. **Submit Proof**: Submit decrypted value and proof to contract for verification

This workflow ensures decryption is user-driven and verifiable on-chain.

## 🛠️ Development Tools

### Flatten Contracts (for Remix IDE)

```bash
npm run flatten
# Outputs to: flattened/IdentityRegistry_flat.sol
```

### Run Tests

```bash
npm test
```

### Gas Report

```bash
REPORT_GAS=true npm test
```

## 🌐 Supported Networks

- **Sepolia Testnet** (Chain ID: 11155111) - Recommended
- **Zama Devnet** (Chain ID: 8009)
- **Localhost** (Chain ID: 31337) - For development

## 📚 Resources

- [Zama FHEVM Documentation](https://docs.zama.org/fhevm)
- [RelayerSDK Guide](https://docs.zama.org/fhevm/getting-started/decryption)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Privy Documentation](https://docs.privy.io)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Related Projects

This project uses the same FHEVM infrastructure as:
- [Confidential Fundraising](https://github.com/cris-the-dev/confidential-fundraising)

## ⚠️ Security Notes

- This is experimental software. Do not use with real personal data in production.
- Always audit smart contracts before mainnet deployment.
- Keep your private keys and mnemonic secure.
- Test thoroughly on testnet before any production use.

## 💡 Use Cases

- **Privacy-Preserving KYC**: Share identity data selectively with service providers
- **Confidential HR**: Job applications with selective disclosure
- **Healthcare Records**: Share medical data with specific doctors
- **Educational Credentials**: Verify qualifications without full disclosure
- **Gig Economy**: Background checks with privacy preservation

---

Built with ❤️ using Zama's FHEVM
