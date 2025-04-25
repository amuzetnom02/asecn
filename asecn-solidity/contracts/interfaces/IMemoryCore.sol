// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IMemoryCore {
    function appendMemory(bytes calldata data) external;
    function getMemory(uint256 index) external view returns (uint256, address, bytes memory);
    function memoryCount() external view returns (uint256);
}
