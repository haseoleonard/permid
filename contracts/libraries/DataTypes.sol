// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@fhevm/solidity/lib/FHE.sol";

/**
 * @title DataTypes
 * @notice Library containing all data structures and enums for IdentityRegistry
 */
library DataTypes {
    /**
     * @dev Personal data schema (all fields encrypted)
     * Schema includes: email, dob, name, idNumber, location, experience, country
     */
    struct Profile {
        euint64 email;        // Encrypted email hash or identifier
        euint64 dob;          // Encrypted date of birth (Unix timestamp)
        euint64 name;         // Encrypted name hash or identifier
        euint64 idNumber;     // Encrypted government ID number
        euint64 location;     // Encrypted location/city code
        euint64 experience;   // Encrypted years of experience
        euint64 country;      // Encrypted country code (ISO 3166-1 numeric)
        bool exists;
        uint256 createdAt;
    }

    /**
     * @dev Access request from another user
     */
    struct AccessRequest {
        address requester;
        string message;          // Message explaining why access is needed
        uint256 timestamp;
        bool pending;
        bool granted;
    }

    /**
     * @dev Field identifiers for selective sharing
     */
    enum DataField {
        EMAIL,
        DOB,
        NAME,
        ID_NUMBER,
        LOCATION,
        EXPERIENCE,
        COUNTRY
    }
}
