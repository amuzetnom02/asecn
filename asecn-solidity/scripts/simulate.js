// simulate.js
// Simulation engine for ASECN DAO contract system
// Run with: npx hardhat run scripts/simulate.js --network hardhat

const hre = require("hardhat");

async function main() {
  const [deployer, user1, user2] = await hre.ethers.getSigners();
  console.log("Simulation started. Deployer:", deployer.address);

  // Deploy contracts (reuse deploy.js logic)
  const MemoryCore = await hre.ethers.getContractFactory("MemoryCore");
  const memoryCore = await MemoryCore.deploy(deployer.address);
  await memoryCore.deployed();

  const PerceptionModule = await hre.ethers.getContractFactory("PerceptionModule");
  const perceptionModule = await PerceptionModule.deploy(deployer.address, memoryCore.address);
  await perceptionModule.deployed();

  const Treasury = await hre.ethers.getContractFactory("Treasury");
  const treasury = await Treasury.deploy(deployer.address, deployer.address);
  await treasury.deployed();

  const Evolver = await hre.ethers.getContractFactory("Evolver");
  const evolver = await Evolver.deploy(deployer.address);
  await evolver.deployed();

  const ActionExecutor = await hre.ethers.getContractFactory("ActionExecutor");
  const actionExecutor = await ActionExecutor.deploy(deployer.address, treasury.address);
  await actionExecutor.deployed();

  const ASECN = await hre.ethers.getContractFactory("ASECN");
  const asecn = await ASECN.deploy(
    memoryCore.address,
    perceptionModule.address,
    actionExecutor.address,
    treasury.address,
    evolver.address,
    deployer.address
  );
  await asecn.deployed();

  // Simulate perception input
  const perceptionData = hre.ethers.utils.toUtf8Bytes("{"event":"oracle_update","value":42}");
  await perceptionModule.receiveOracleData(perceptionData);
  console.log("PerceptionModule received oracle data.");

  // Check memory log
  const memCount = await memoryCore.memoryCount();
  const memEntry = await memoryCore.getMemory(memCount - 1);
  console.log("MemoryCore last entry:", {
    timestamp: memEntry[0].toString(),
    source: memEntry[1],
    data: hre.ethers.utils.toUtf8String(memEntry[2])
  });

  // Simulate action execution
  // For demo: encode action to send ETH from Treasury to user1
  const actionData = hre.ethers.utils.defaultAbiCoder.encode([
    "address",
    "uint256"
  ], [user1.address, hre.ethers.utils.parseEther("0.1")]);

  // Fund Treasury
  await deployer.sendTransaction({
    to: treasury.address,
    value: hre.ethers.utils.parseEther("1.0")
  });
  console.log("Treasury funded with 1 ETH.");

  // Execute action
  await actionExecutor.performAction(actionData);
  console.log("ActionExecutor performed action: Treasury sent 0.1 ETH to user1.");

  // Check user1 balance
  const balance = await hre.ethers.provider.getBalance(user1.address);
  console.log("User1 ETH balance:", hre.ethers.utils.formatEther(balance));

  // Simulate evolver proposal
  const proposalDesc = "Upgrade memory core logic";
  const proposalData = hre.ethers.utils.toUtf8Bytes("upgrade_v1");
  const proposalTx = await evolver.proposeUpgrade(proposalDesc, proposalData);
  const proposalReceipt = await proposalTx.wait();
  const proposalId = proposalReceipt.events[0].args.proposalId;
  console.log(`Evolver proposal created: ID ${proposalId}, desc: ${proposalDesc}`);

  // Execute proposal
  await evolver.executeUpgrade(proposalId);
  console.log(`Evolver proposal ${proposalId} executed.`);

  // (Optional) ASCII visualization
  console.log("\n=== ASECN SYSTEM STATE ===");
  console.log(`ASECN: ${asecn.address}`);
  console.log(`MemoryCore: ${memoryCore.address}`);
  console.log(`PerceptionModule: ${perceptionModule.address}`);
  console.log(`ActionExecutor: ${actionExecutor.address}`);
  console.log(`Treasury: ${treasury.address}`);
  console.log(`Evolver: ${evolver.address}`);
  console.log("========================\n");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
