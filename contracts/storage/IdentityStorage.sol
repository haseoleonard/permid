// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../libraries/DataTypes.sol";

/**
 * @title IdentityStorage
 * @notice Storage contract containing all state variables for IdentityRegistry
 * @dev Separates storage from logic for better organization and potential upgradeability
 */
abstract contract IdentityStorage {
    // ============================================
    // PROFILE STORAGE
    // ============================================

    /// @notice Profile storage: owner => Profile
    /// @dev Stores all encrypted personal data for each user
    mapping(address => DataTypes.Profile) internal profiles;

    /// @notice List of all profile owners
    /// @dev Used to iterate through all profiles
    address[] public profileOwners;

    /// @notice Quick lookup for profile existence
    /// @dev Gas-efficient check before accessing profile (public getter in main contract)
    mapping(address => bool) internal _hasProfile;

    // ============================================
    // ACCESS REQUEST STORAGE
    // ============================================

    /// @notice Access requests: dataOwner => requester => AccessRequest
    /// @dev Stores pending and granted access requests with messages
    mapping(address => mapping(address => DataTypes.AccessRequest)) public accessRequests;

    /// @notice Access grants: dataOwner => requester => field => granted
    /// @dev Tracks which specific fields each requester has access to
    mapping(address => mapping(address => mapping(DataTypes.DataField => bool))) public fieldAccess;

    // ============================================
    // DECRYPTION CACHE STORAGE
    // ============================================

    /// @notice Decryption cache for shared fields: owner => field => DecryptionInfo
    /// @dev Stores decrypted values after v0.9 self-relaying workflow completion
    mapping(address => mapping(DataTypes.DataField => DataTypes.DecryptionInfo)) public decryptionCache;

    // ============================================
    // REQUEST TRACKING STORAGE
    // ============================================

    /// @notice Incoming requests tracking: dataOwner => requesters[]
    /// @dev Tracks who has requested access to this user's data
    mapping(address => address[]) public incomingRequests;

    /// @notice Outgoing requests tracking: requester => dataOwners[]
    /// @dev Tracks which profiles this user has requested access to
    mapping(address => address[]) public outgoingRequests;

    // ============================================
    // STORAGE GAPS FOR UPGRADEABILITY (OPTIONAL)
    // ============================================

    /**
     * @dev Gap for future storage variables in case of upgrades
     * This ensures new variables can be added without shifting storage layout
     * Can be removed if upgradeability is not needed
     */
    uint256[50] private __gap;
}
