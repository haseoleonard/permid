#!/bin/bash

# Get network from argument (default: localhost)
NETWORK=${1:-localhost}

echo "🚀 Deploying to $NETWORK..."
echo ""

# Deploy contracts using the deployment script
npx hardhat run scripts/deploy-identity.ts --network $NETWORK
