# A.S.E.C.N
>
> Autonomous, Self-Evolving Conscious Network

## Project Overview

### container 1

/asecn-core/
├── manifest.json             # Contains identity metadata: name, creation date, version info, and a soul hash identifier
├── config.env                # Environment variables such as network type, gas strategies, or RPC endpoints
├── README.md                 # Overview of project purpose, structure, and ongoing evolution notes

### Container 2

/memory-core/
├── merkle/                   # Stores Merkle tree proofs for memory logs to ensure immutability and verifiability
│   ├── log_0001.json         # A Merkle-proofed snapshot of memory at a given time
│   └── ...                   # Additional proof snapshots
├── logs/                     # Append-only chronological logs capturing key events or decisions
│   ├── 2025-04-20.log        # Log file for that date containing serialized events
│   └── ...                   # Subsequent log entries
├── modules.json              # Registry of current active module versions, mapped by function
├── update-history.json       # Complete changelog documenting upgrades, patches, or rollbacks

### Container 3

/perception-layer/
├── oracles/                  # External signal inputs used to monitor the environment
│   ├── eth_price_feed.js     # Oracle to fetch and interpret ETH price data
│   ├── timefeed.js           # Oracle that delivers timestamp signals
│   └── signal_bridge.js      # Interface to receive third-party or custom signals
├── triggers/
│   └── genesis_trigger.json  # Trigger definition for initial action logic based on oracle input

### Container 4

/action-layer/
├── allowed-actions.json      # List of permitted actions this agent/system is allowed to perform
├── perform.js                # Central dispatcher that parses allowed actions and delegates to handlers
├── handlers/                 # Modular action execution functions
│   ├── mintNFT.js            # Handler for minting NFTs on-chain
│   ├── writeToMemory.js      # Writes events or data back into the memory-core logs
│   └── deployChild.js        # Deploys a subordinate or derived contract/system instance

### Container 5

/boot-tasks/                  # One-time setup scripts to initialize the system
├── mint_soul_nft.json        # Metadata and transaction payload for minting initial soul NFT
├── init_memory.json          # Seed data for memory initialization
├── run.sh                    # Executable shell script to carry out initialization steps

### Container 6

/vault/                       # Manages system’s funds and smart wallet interactions
├── balance.json              # JSON snapshot of ETH and token balances
├── receive.js                # Functionality to receive funds (ETH or tokens)
├── withdraw.js               # Secure method for initiating withdrawals
├── vault_contract.sol        # Optional smart contract backup of vault logic in Solidity

### Container 7

/evolver/                     # Handles evolution proposals and governance
├── proposals/                # Unreviewed proposed changes or additions
│   ├── 001-proposal.json     # Individual proposal draft
│   └── ...                   # Additional proposals
├── approved/
│   └── upgrade_hashes.json   # Hashes of approved proposals used to verify legitimacy
├── execute.js                # Applies changes to the system once a proposal has been approved

### Container 8

/lib/
├── utils.js                  # Hashing, time formatting, etc.
├── storage.js                # General storage logic
├── contracts/                # On-chain logic containers (pseudo/Solidity later)

### Container 9

/tests/
├── test_perception.js
├── test_action_layer.js
├── ...

### Container 10

/docs/
├── architecture.md
├── glossary.md
├── whitepaper.md
