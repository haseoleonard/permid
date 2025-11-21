/**
 * Confidential Identity - Hardhat Configuration
 * Privacy-preserving identity management with selective data sharing
 */

import { HardhatUserConfig, vars } from "hardhat/config.js";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import "hardhat-deploy";

// Get environment variables (use hardhat vars for security)
const PRIVATE_KEY = vars.has("PRIVATE_KEY") ? vars.get("PRIVATE_KEY") : process.env.PRIVATE_KEY;

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
      evmVersion: "cancun", // FHEVM requires cancun
    },
  },

  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 11155111,
    },
  },

  namedAccounts: {
    deployer: {
      default: 0, // First account from mnemonic
    },
  },

  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
    deploy: "./deploy",
  },

  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || "",
  },

  typechain: {
    outDir: "types",
    target: "ethers-v6",
  },

  // Gas reporter configuration
  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
  },
};

export default config;
