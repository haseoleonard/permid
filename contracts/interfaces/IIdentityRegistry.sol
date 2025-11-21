// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../libraries/DataTypes.sol";

/**
 * @title IIdentityRegistry
 * @notice Interface for IdentityRegistry contract with all events
 */
interface IIdentityRegistry {
    // ============================================
    // EVENTS
    // ============================================

    /**
     * @notice Emitted when a new profile is created
     * @param owner Address of the profile owner
     * @param timestamp Block timestamp of creation
     */
    event ProfileCreated(address indexed owner, uint256 timestamp);

    /**
     * @notice Emitted when a profile is updated
     * @param owner Address of the profile owner
     * @param timestamp Block timestamp of update
     */
    event ProfileUpdated(address indexed owner, uint256 timestamp);

    /**
     * @notice Emitted when someone requests access to a profile
     * @param requester Address requesting access
     * @param dataOwner Address of the profile owner
     * @param message Message explaining the access request
     */
    event AccessRequested(
        address indexed requester,
        address indexed dataOwner,
        string message
    );

    /**
     * @notice Emitted when access is granted to specific fields
     * @param dataOwner Address of the profile owner
     * @param requester Address that was granted access
     * @param fields Array of fields that were granted
     */
    event AccessGranted(
        address indexed dataOwner,
        address indexed requester,
        DataTypes.DataField[] fields
    );

    /**
     * @notice Emitted when access is revoked
     * @param dataOwner Address of the profile owner
     * @param requester Address whose access was revoked
     */
    event AccessRevoked(
        address indexed dataOwner,
        address indexed requester
    );

    // ============================================
    // EXTERNAL FUNCTIONS
    // ============================================

    // Profile Management
    function createProfile(
        externalEuint64 encryptedEmail,
        externalEuint64 encryptedDob,
        externalEuint64 encryptedName,
        externalEuint64 encryptedIdNumber,
        externalEuint64 encryptedLocation,
        externalEuint64 encryptedExperience,
        externalEuint64 encryptedCountry,
        bytes calldata inputProof
    ) external;

    function updateProfile(
        externalEuint64 encryptedEmail,
        externalEuint64 encryptedDob,
        externalEuint64 encryptedName,
        externalEuint64 encryptedIdNumber,
        externalEuint64 encryptedLocation,
        externalEuint64 encryptedExperience,
        externalEuint64 encryptedCountry,
        bytes calldata inputProof
    ) external;

    function getMyProfile()
        external
        view
        returns (
            bytes32 emailHandle,
            bytes32 dobHandle,
            bytes32 nameHandle,
            bytes32 idNumberHandle,
            bytes32 locationHandle,
            bytes32 experienceHandle,
            bytes32 countryHandle
        );

    // Access Management
    function requestAccess(address dataOwner, string calldata message) external;

    function grantAccess(address requester, DataTypes.DataField[] calldata fields) external;

    function revokeAccess(address requester) external;

    // Encrypted Data Access
    function getEncryptedField(address dataOwner, DataTypes.DataField field)
        external
        view
        returns (bytes32);

    // View Functions
    function getGrantedFields(address dataOwner, address requester)
        external
        view
        returns (bool[7] memory granted);

    function getAllProfileOwners() external view returns (address[] memory);

    function getMyIncomingRequests() external view returns (address[] memory);

    function getMyOutgoingRequests() external view returns (address[] memory);

    function getAccessRequestStatus(address dataOwner, address requester)
        external
        view
        returns (
            bool exists,
            bool pending,
            bool granted,
            string memory message,
            uint256 timestamp
        );

    function hasProfile(address owner) external view returns (bool);
}
