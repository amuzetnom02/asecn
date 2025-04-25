// deploy.js
// Script to deploy the full ASECN DAO system using Hardhat

const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy core modules
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

  console.log("ASECN deployed to:", asecn.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
