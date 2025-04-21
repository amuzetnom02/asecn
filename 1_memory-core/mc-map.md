🧠 1_memory-core/ — The memory of ASECN
🔍 Purpose
This is where ASECN stores and retrieves internal memory: past actions, decisions, states, observations, and logs.

/1_memory-core/
├── memory-state.json         # Stores current memory snapshot
├── memory-log.json           # Full chronological memory entries
├── write.js                  # Function to add new memory entries
├── recall.js                 # Function to retrieve past memories
├── purge.js                  # Logic to clean up or archive old memory
└── index.js                  # Master interface (import this to access memory functions)
