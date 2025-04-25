// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../Interfaces/IMemoryCore.sol";

/**
 * @title MemoryCore
 * @notice Persistent append-only memory store for ASECN decision-making.
 */
contract MemoryCore is IMemoryCore {
    struct MemoryEntry {
        uint256 timestamp;
        address source;
        bytes data;
    }

    MemoryEntry[] private memoryLog;
    address public asecn;

    event MemoryAppended(uint256 indexed index, address indexed source, bytes data);

    modifier onlyASECN() {
        require(msg.sender == asecn, "Only ASECN");
        _;
    }

    constructor(address _asecn) {
        asecn = _asecn;
    }

    function appendMemory(bytes calldata data) external override onlyASECN {
        memoryLog.push(MemoryEntry({
            timestamp: block.timestamp,
            source: msg.sender,
            data: data
        }));
        emit MemoryAppended(memoryLog.length - 1, msg.sender, data);
    }

    function getMemory(uint256 index) external view override returns (uint256, address, bytes memory) {
        MemoryEntry storage entry = memoryLog[index];
        return (entry.timestamp, entry.source, entry.data);
    }

    function memoryCount() external view override returns (uint256) {
        return memoryLog.length;
    }
}
