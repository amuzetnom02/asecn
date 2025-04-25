// asecn.test.js
// Tests for ASECN core contract logic

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ASECN", function () {
  let deployer, user, memoryCore, perceptionModule, actionExecutor, treasury, evolver, asecn;

  beforeEach(async function () {
    [deployer, user] = await ethers.getSigners();
    const MemoryCore = await ethers.getContractFactory("MemoryCore");
    memoryCore = await MemoryCore.deploy(deployer.address);
    await memoryCore.deployed();
    const PerceptionModule = await ethers.getContractFactory("PerceptionModule");
    perceptionModule = await PerceptionModule.deploy(deployer.address, memoryCore.address);
    await perceptionModule.deployed();
    const Treasury = await ethers.getContractFactory("Treasury");
    treasury = await Treasury.deploy(deployer.address, deployer.address);
    await treasury.deployed();
    const Evolver = await ethers.getContractFactory("Evolver");
    evolver = await Evolver.deploy(deployer.address);
    await evolver.deployed();
    const ActionExecutor = await ethers.getContractFactory("ActionExecutor");
    actionExecutor = await ActionExecutor.deploy(deployer.address, treasury.address);
    await actionExecutor.deployed();
    const ASECN = await ethers.getContractFactory("ASECN");
    asecn = await ASECN.deploy(
      memoryCore.address,
      perceptionModule.address,
      actionExecutor.address,
      treasury.address,
      evolver.address,
      deployer.address
    );
    await asecn.deployed();
  });

  it("should set module addresses correctly", async function () {
    expect(await asecn.memoryCore()).to.equal(memoryCore.address);
    expect(await asecn.perceptionModule()).to.equal(perceptionModule.address);
    expect(await asecn.actionExecutor()).to.equal(actionExecutor.address);
    expect(await asecn.treasury()).to.equal(treasury.address);
    expect(await asecn.evolver()).to.equal(evolver.address);
    expect(await asecn.factory()).to.equal(deployer.address);
  });

  it("should allow owner to update module address", async function () {
    await asecn.updateModule("memoryCore", user.address);
    expect(await asecn.memoryCore()).to.equal(user.address);
  });

  it("should reject non-owner module update", async function () {
    await expect(
      asecn.connect(user).updateModule("memoryCore", user.address)
    ).to.be.revertedWith("Not authorized");
  });
});
