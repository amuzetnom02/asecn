// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../Interfaces/IPerceptionModule.sol";
import "../Interfaces/IMemoryCore.sol";

/**
 * @title PerceptionModule
 * @notice Integrates with oracles to receive external data and signals.
 */
contract PerceptionModule is IPerceptionModule {
    address public asecn;
    address public memoryCore;
    address public owner;

    event PerceptionReceived(address indexed oracle, bytes data);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor(address _asecn, address _memoryCore) {
        asecn = _asecn;
        memoryCore = _memoryCore;
        owner = msg.sender;
    }

    // Called by trusted oracles to send data
    function receiveOracleData(bytes calldata data) external override {
        // Log to memory core
        IMemoryCore(memoryCore).appendMemory(data);
        emit PerceptionReceived(msg.sender, data);
        // Optionally, notify ASECN
        // IASECN(asecn).receivePerception(data);
    }

    // Update memory core address if needed
    function updateMemoryCore(address newMemoryCore) external onlyOwner {
        memoryCore = newMemoryCore;
    }
}
