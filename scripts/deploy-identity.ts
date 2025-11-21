import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying Confidential Identity contracts...");

  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH");

  // Deploy IdentityRegistry
  console.log("\n📄 Deploying IdentityRegistry...");
  const IdentityRegistry = await ethers.getContractFactory("IdentityRegistry");
  const identityRegistry = await IdentityRegistry.deploy();
  await identityRegistry.waitForDeployment();

  const identityRegistryAddress = await identityRegistry.getAddress();
  console.log("✅ IdentityRegistry deployed to:", identityRegistryAddress);

  console.log("\n🎉 Deployment complete!");
  console.log("\n📋 Contract Addresses:");
  console.log("  IdentityRegistry:", identityRegistryAddress);

  console.log("\n💡 Next steps:");
  console.log("  1. Update identity-frontend/lib/contracts/config.ts with the contract address");
  console.log("  2. Update identity-frontend/.env.local with:");
  console.log(`     NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS=${identityRegistryAddress}`);
  console.log("  3. Run: cd identity-frontend && npm run dev");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
