// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title Errors
 * @notice Library containing all custom errors for IdentityRegistry
 */
library Errors {
    // Profile errors
    error ProfileNotFound();
    error ProfileAlreadyExists();

    // Access control errors
    error NoAccessRequest();
    error AccessNotGranted();
    error NotAuthorized();
    error CannotRequestOwnData();
    error RequestAlreadyPending();

    // Decryption errors
    error FieldNotDecrypted();
    error InvalidField();
    error ValueNotInitialized();
}
