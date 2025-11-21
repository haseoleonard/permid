// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";
import "./libraries/DataTypes.sol";
import "./libraries/Errors.sol";
import "./interfaces/IIdentityRegistry.sol";
import "./storage/IdentityStorage.sol";

/**
 * @title IdentityRegistry
 * @notice Confidential identity management with selective data sharing
 * @dev Uses FHEVM v0.9 for encrypted personal data storage and consent management
 */
contract IdentityRegistry is IIdentityRegistry, ZamaEthereumConfig, IdentityStorage {

    // ============================================
    // PUBLIC VIEWS (from storage)
    // ============================================

    /// @inheritdoc IIdentityRegistry
    function hasProfile(address owner) external view returns (bool) {
        return _hasProfile[owner];
    }

    // ============================================
    // MODIFIERS
    // ============================================

    /// @notice Ensures the profile exists for the given owner
    modifier profileExists(address owner) {
        if (!profiles[owner].exists) revert Errors.ProfileNotFound();
        _;
    }

    /// @notice Ensures the caller has a profile
    modifier onlyProfileOwner() {
        if (!profiles[msg.sender].exists) revert Errors.ProfileNotFound();
        _;
    }

    // ============================================
    // PROFILE MANAGEMENT
    // ============================================

    /// @inheritdoc IIdentityRegistry
    function createProfile(
        externalEuint64 encryptedEmail,
        externalEuint64 encryptedDob,
        externalEuint64 encryptedName,
        externalEuint64 encryptedIdNumber,
        externalEuint64 encryptedLocation,
        externalEuint64 encryptedExperience,
        externalEuint64 encryptedCountry,
        bytes calldata inputProof
    ) external {
        if (profiles[msg.sender].exists) revert Errors.ProfileAlreadyExists();

        // Convert external encrypted inputs to euint64
        euint64 email = FHE.fromExternal(encryptedEmail, inputProof);
        euint64 dob = FHE.fromExternal(encryptedDob, inputProof);
        euint64 name = FHE.fromExternal(encryptedName, inputProof);
        euint64 idNumber = FHE.fromExternal(encryptedIdNumber, inputProof);
        euint64 location = FHE.fromExternal(encryptedLocation, inputProof);
        euint64 experience = FHE.fromExternal(encryptedExperience, inputProof);
        euint64 country = FHE.fromExternal(encryptedCountry, inputProof);

        // Allow contract and owner to access
        _setupPermissions(email, dob, name, idNumber, location, experience, country);

        // Store profile
        profiles[msg.sender] = DataTypes.Profile({
            email: email,
            dob: dob,
            name: name,
            idNumber: idNumber,
            location: location,
            experience: experience,
            country: country,
            exists: true,
            createdAt: block.timestamp
        });

        profileOwners.push(msg.sender);
        _hasProfile[msg.sender] = true;

        emit ProfileCreated(msg.sender, block.timestamp);
    }

    /// @inheritdoc IIdentityRegistry
    function updateProfile(
        externalEuint64 encryptedEmail,
        externalEuint64 encryptedDob,
        externalEuint64 encryptedName,
        externalEuint64 encryptedIdNumber,
        externalEuint64 encryptedLocation,
        externalEuint64 encryptedExperience,
        externalEuint64 encryptedCountry,
        bytes calldata inputProof
    ) external onlyProfileOwner {
        DataTypes.Profile storage profile = profiles[msg.sender];

        // Convert external encrypted inputs to euint64
        euint64 email = FHE.fromExternal(encryptedEmail, inputProof);
        euint64 dob = FHE.fromExternal(encryptedDob, inputProof);
        euint64 name = FHE.fromExternal(encryptedName, inputProof);
        euint64 idNumber = FHE.fromExternal(encryptedIdNumber, inputProof);
        euint64 location = FHE.fromExternal(encryptedLocation, inputProof);
        euint64 experience = FHE.fromExternal(encryptedExperience, inputProof);
        euint64 country = FHE.fromExternal(encryptedCountry, inputProof);

        _setupPermissions(email, dob, name, idNumber, location, experience, country);

        // Update profile
        profile.email = email;
        profile.dob = dob;
        profile.name = name;
        profile.idNumber = idNumber;
        profile.location = location;
        profile.experience = experience;
        profile.country = country;

        emit ProfileUpdated(msg.sender, block.timestamp);
    }

    /// @inheritdoc IIdentityRegistry
    function getMyProfile() external view onlyProfileOwner returns (
        bytes32 emailHandle,
        bytes32 dobHandle,
        bytes32 nameHandle,
        bytes32 idNumberHandle,
        bytes32 locationHandle,
        bytes32 experienceHandle,
        bytes32 countryHandle
    ) {
        DataTypes.Profile storage profile = profiles[msg.sender];

        return (
            FHE.toBytes32(profile.email),
            FHE.toBytes32(profile.dob),
            FHE.toBytes32(profile.name),
            FHE.toBytes32(profile.idNumber),
            FHE.toBytes32(profile.location),
            FHE.toBytes32(profile.experience),
            FHE.toBytes32(profile.country)
        );
    }

    // ============================================
    // ACCESS REQUEST MANAGEMENT
    // ============================================

    /// @inheritdoc IIdentityRegistry
    function requestAccess(address dataOwner, string calldata message)
        external
        profileExists(dataOwner)
    {
        if (msg.sender == dataOwner) revert Errors.CannotRequestOwnData();
        if (accessRequests[dataOwner][msg.sender].pending) revert Errors.RequestAlreadyPending();

        accessRequests[dataOwner][msg.sender] = DataTypes.AccessRequest({
            requester: msg.sender,
            message: message,
            timestamp: block.timestamp,
            pending: true,
            granted: false
        });

        incomingRequests[dataOwner].push(msg.sender);
        outgoingRequests[msg.sender].push(dataOwner);

        emit AccessRequested(msg.sender, dataOwner, message);
    }

    /// @inheritdoc IIdentityRegistry
    function grantAccess(address requester, DataTypes.DataField[] calldata fields)
        external
        onlyProfileOwner
    {
        if (!accessRequests[msg.sender][requester].pending) revert Errors.NoAccessRequest();

        // Mark as granted
        accessRequests[msg.sender][requester].granted = true;
        accessRequests[msg.sender][requester].pending = false;

        // Grant access to specific fields
        for (uint i = 0; i < fields.length; i++) {
            fieldAccess[msg.sender][requester][fields[i]] = true;
        }

        emit AccessGranted(msg.sender, requester, fields);
    }

    /// @inheritdoc IIdentityRegistry
    function revokeAccess(address requester) external onlyProfileOwner {
        accessRequests[msg.sender][requester].granted = false;

        // Revoke all field access
        for (uint i = 0; i < 7; i++) {
            fieldAccess[msg.sender][requester][DataTypes.DataField(i)] = false;
        }

        emit AccessRevoked(msg.sender, requester);
    }

    // ============================================
    // DECRYPTION MANAGEMENT (v0.9 self-relaying)
    // ============================================

    /// @inheritdoc IIdentityRegistry
    function requestFieldDecryption(DataTypes.DataField field) external onlyProfileOwner {
        DataTypes.Profile storage profile = profiles[msg.sender];
        euint64 fieldValue = _getFieldValue(profile, field);

        // Mark as publicly decryptable
        FHE.makePubliclyDecryptable(fieldValue);

        // Store pending value
        decryptionCache[msg.sender][field].pendingValue = fieldValue;

        emit FieldMarkedForDecryption(msg.sender, field);
    }

    /// @inheritdoc IIdentityRegistry
    function submitFieldDecryption(
        DataTypes.DataField field,
        uint64 decryptedValue,
        bytes calldata proof
    ) external onlyProfileOwner {
        DataTypes.Profile storage profile = profiles[msg.sender];
        euint64 fieldValue = _getFieldValue(profile, field);

        // Verify the decryption proof
        bytes32[] memory handles = new bytes32[](1);
        handles[0] = FHE.toBytes32(fieldValue);
        bytes memory cleartexts = abi.encode(decryptedValue);
        FHE.checkSignatures(handles, cleartexts, proof);

        // Store decrypted value
        decryptionCache[msg.sender][field].isDecrypted = true;
        decryptionCache[msg.sender][field].decryptedValue = decryptedValue;
        decryptionCache[msg.sender][field].timestamp = block.timestamp;

        emit FieldDecrypted(msg.sender, field, decryptedValue);
    }

    /// @inheritdoc IIdentityRegistry
    function getPendingFieldHandle(DataTypes.DataField field)
        external
        view
        onlyProfileOwner
        returns (bytes32)
    {
        euint64 pendingValue = decryptionCache[msg.sender][field].pendingValue;
        if (!FHE.isInitialized(pendingValue)) revert Errors.ValueNotInitialized();
        return FHE.toBytes32(pendingValue);
    }

    // ============================================
    // VIEW SHARED DATA
    // ============================================

    /// @inheritdoc IIdentityRegistry
    function viewSharedField(address dataOwner, DataTypes.DataField field)
        external
        view
        profileExists(dataOwner)
        returns (uint64)
    {
        if (!fieldAccess[dataOwner][msg.sender][field]) revert Errors.AccessNotGranted();
        if (!decryptionCache[dataOwner][field].isDecrypted) revert Errors.FieldNotDecrypted();

        return decryptionCache[dataOwner][field].decryptedValue;
    }

    /// @inheritdoc IIdentityRegistry
    function getGrantedFields(address dataOwner, address requester)
        external
        view
        returns (bool[7] memory granted)
    {
        for (uint i = 0; i < 7; i++) {
            granted[i] = fieldAccess[dataOwner][requester][DataTypes.DataField(i)];
        }
        return granted;
    }

    // ============================================
    // QUERY FUNCTIONS
    // ============================================

    /// @inheritdoc IIdentityRegistry
    function getAllProfileOwners() external view returns (address[] memory) {
        return profileOwners;
    }

    /// @inheritdoc IIdentityRegistry
    function getMyIncomingRequests() external view returns (address[] memory) {
        return incomingRequests[msg.sender];
    }

    /// @inheritdoc IIdentityRegistry
    function getMyOutgoingRequests() external view returns (address[] memory) {
        return outgoingRequests[msg.sender];
    }

    /// @inheritdoc IIdentityRegistry
    function getAccessRequestStatus(address dataOwner, address requester)
        external
        view
        returns (bool exists, bool pending, bool granted, string memory message, uint256 timestamp)
    {
        DataTypes.AccessRequest storage request = accessRequests[dataOwner][requester];
        return (
            request.timestamp > 0,
            request.pending,
            request.granted,
            request.message,
            request.timestamp
        );
    }

    // ============================================
    // INTERNAL HELPERS
    // ============================================

    /**
     * @dev Setup FHE permissions for all profile fields
     */
    function _setupPermissions(
        euint64 email,
        euint64 dob,
        euint64 name,
        euint64 idNumber,
        euint64 location,
        euint64 experience,
        euint64 country
    ) private {
        // Allow contract to access
        FHE.allowThis(email);
        FHE.allowThis(dob);
        FHE.allowThis(name);
        FHE.allowThis(idNumber);
        FHE.allowThis(location);
        FHE.allowThis(experience);
        FHE.allowThis(country);

        // Allow owner to access
        FHE.allow(email, msg.sender);
        FHE.allow(dob, msg.sender);
        FHE.allow(name, msg.sender);
        FHE.allow(idNumber, msg.sender);
        FHE.allow(location, msg.sender);
        FHE.allow(experience, msg.sender);
        FHE.allow(country, msg.sender);
    }

    /**
     * @dev Get encrypted field value from profile
     */
    function _getFieldValue(DataTypes.Profile storage profile, DataTypes.DataField field)
        internal
        view
        returns (euint64)
    {
        if (field == DataTypes.DataField.EMAIL) return profile.email;
        if (field == DataTypes.DataField.DOB) return profile.dob;
        if (field == DataTypes.DataField.NAME) return profile.name;
        if (field == DataTypes.DataField.ID_NUMBER) return profile.idNumber;
        if (field == DataTypes.DataField.LOCATION) return profile.location;
        if (field == DataTypes.DataField.EXPERIENCE) return profile.experience;
        if (field == DataTypes.DataField.COUNTRY) return profile.country;
        revert Errors.InvalidField();
    }
}
