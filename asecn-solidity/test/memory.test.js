// memory.test.js
// Tests for MemoryCore contract logic

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MemoryCore", function () {
  let deployer, asecn, memoryCore;

  beforeEach(async function () {
    [deployer, asecn] = await ethers.getSigners();
    const MemoryCore = await ethers.getContractFactory("MemoryCore");
    memoryCore = await MemoryCore.deploy(asecn.address);
    await memoryCore.deployed();
  });

  it("should append memory entries only from ASECN", async function () {
    const data = ethers.utils.toUtf8Bytes("test memory");
    await memoryCore.connect(asecn).appendMemory(data);
    expect(await memoryCore.memoryCount()).to.equal(1);
    const entry = await memoryCore.getMemory(0);
    expect(ethers.utils.toUtf8String(entry[2])).to.equal("test memory");
  });

  it("should reject append from non-ASECN", async function () {
    const data = ethers.utils.toUtf8Bytes("bad memory");
    await expect(
      memoryCore.connect(deployer).appendMemory(data)
    ).to.be.revertedWith("Only ASECN");
  });
});
