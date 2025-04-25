// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IASECN {
    function updateModule(string calldata module, address newAddress) external;
    function receivePerception(bytes calldata data) external;
    function executeAction(bytes calldata actionData) external;
}
