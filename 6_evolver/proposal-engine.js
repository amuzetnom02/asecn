// Handles proposal submissions and the review process in the evolution engine
const fs = require('fs');
const proposalLog = require('./proposal-log.json');

module.exports = {
  submitProposal: function(proposal) {
    console.log(`Submitting proposal: ${proposal.title}`);
    proposalLog.push({
      proposal: proposal,
      status: 'pending',
      timestamp: new Date().toISOString()
    });
    fs.writeFileSync('./proposal-log.json', JSON.stringify(proposalLog, null, 2));
  },
  reviewProposal: function(index, approved) {
    if (proposalLog[index]) {
      proposalLog[index].status = approved ? 'approved' : 'rejected';
      fs.writeFileSync('./proposal-log.json', JSON.stringify(proposalLog, null, 2));
    } else {
      console.error('Proposal not found!');
    }
  }
};
