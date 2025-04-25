// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title StorageLib
 * @notice Library for reusable storage patterns and helpers.
 */
library StorageLib {
    struct AddressSet {
        mapping(address => bool) exists;
        address[] values;
    }

    function add(AddressSet storage set, address value) internal {
        if (!set.exists[value]) {
            set.exists[value] = true;
            set.values.push(value);
        }
    }

    function remove(AddressSet storage set, address value) internal {
        if (set.exists[value]) {
            set.exists[value] = false;
            // Remove from array (inefficient, for demo only)
            for (uint256 i = 0; i < set.values.length; i++) {
                if (set.values[i] == value) {
                    set.values[i] = set.values[set.values.length - 1];
                    set.values.pop();
                    break;
                }
            }
        }
    }

    function contains(AddressSet storage set, address value) internal view returns (bool) {
        return set.exists[value];
    }

    function length(AddressSet storage set) internal view returns (uint256) {
        return set.values.length;
    }

    function at(AddressSet storage set, uint256 index) internal view returns (address) {
        return set.values[index];
    }
}
