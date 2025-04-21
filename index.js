// ASECN Main Entry Point
console.log("Starting ASECN - Autonomous Self-Evolving Crypto Node");

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Import core modules
try {
  const memoryCore = require('./1_memory-core');
  const perceptionLayer = require('./2_perception-layer');
  
  console.log("✅ Core modules loaded successfully");
} catch (err) {
  console.error("❌ Error loading modules:", err.message);
}

// Basic API endpoint
app.get('/', (req, res) => {
  res.send('ASECN is running');
});

// Start server
app.listen(port, () => {
  console.log(`ASECN listening on port ${port}`);
  console.log(`Visit http://localhost:${port} to see status`);
});