# ASECN Solidity DAO

This repository implements the full A.S.E.C.N. DAO system in Solidity, including:
- Modular core contracts (ASECN, MemoryCore, PerceptionModule, ActionExecutor, Treasury, Evolver, ASECNFactory)
- Interfaces and utilities
- Deployment and simulation scripts
- Comprehensive tests

## Setup
1. Install dependencies:
   ```
   npm install
   ```
2. Configure environment variables (see .env.example).
3. Compile contracts:
   ```
   npx hardhat compile
   ```
4. Run tests:
   ```
   npx hardhat test
   ```
5. Deploy contracts:
   ```
   npx hardhat run scripts/deploy.js --network <network>
   ```
6. Run simulation:
   ```
   npx hardhat run scripts/simulate.js --network hardhat
   ```

## Architecture
See the `plan` file for a full breakdown of the system's architecture and logic.
