// evolver.test.js
// Tests for Evolver contract logic

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Evolver", function () {
  let deployer, user, evolver;

  beforeEach(async function () {
    [deployer, user] = await ethers.getSigners();
    const Evolver = await ethers.getContractFactory("Evolver");
    evolver = await Evolver.deploy(deployer.address);
    await evolver.deployed();
  });

  it("should allow anyone to propose an upgrade", async function () {
    const desc = "Upgrade logic";
    const data = ethers.utils.toUtf8Bytes("upgrade_v1");
    const tx = await evolver.connect(user).proposeUpgrade(desc, data);
    const receipt = await tx.wait();
    const proposalId = receipt.events[0].args.proposalId;
    expect(await evolver.proposalCount()).to.equal(1);
    const proposal = await evolver.getProposal(proposalId);
    expect(proposal[0]).to.equal(user.address);
    expect(proposal[1]).to.equal(desc);
    expect(ethers.utils.toUtf8String(proposal[2])).to.equal("upgrade_v1");
    expect(proposal[3]).to.equal(false);
  });

  it("should allow only owner to execute upgrade", async function () {
    const tx = await evolver.proposeUpgrade("desc", ethers.utils.toUtf8Bytes("data"));
    const receipt = await tx.wait();
    const proposalId = receipt.events[0].args.proposalId;
    await expect(
      evolver.connect(user).executeUpgrade(proposalId)
    ).to.be.revertedWith("Not authorized");
    await evolver.executeUpgrade(proposalId);
    const proposal = await evolver.getProposal(proposalId);
    expect(proposal[3]).to.equal(true);
  });
});
