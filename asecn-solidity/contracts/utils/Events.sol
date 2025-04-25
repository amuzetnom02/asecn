// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Events
 * @notice Shared event definitions for ASECN modules.
 */
library Events {
    event GenericEvent(address indexed source, string eventType, bytes data);
}
