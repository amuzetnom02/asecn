// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IPerceptionModule {
    function receiveOracleData(bytes calldata data) external;
}
