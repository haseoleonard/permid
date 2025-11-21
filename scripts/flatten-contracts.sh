#!/bin/bash

echo "🔨 Flattening contracts..."
mkdir -p flattened

# Flatten IdentityRegistry contract (includes all dependencies)
echo "  - Flattening IdentityRegistry.sol..."
npx hardhat flatten contracts/IdentityRegistry.sol > flattened/IdentityRegistry_flat.sol

echo ""
echo "✅ Flattening complete!"
echo "📁 Flattened contracts are in the flattened/ directory"
echo ""
echo "📄 Files created:"
echo "  - flattened/IdentityRegistry_flat.sol (includes all libraries and interfaces)"
echo ""
echo "You can now import these files into Remix IDE!"
