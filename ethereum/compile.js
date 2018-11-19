const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');

fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const factoryPath = path.resolve(__dirname, 'contracts', 'CampaignFactory.sol');
const campaignSource = fs.readFileSync(campaignPath, 'utf8');
const factorySource = fs.readFileSync(factoryPath, 'utf8');

const input = {
  sources: {
    'Campaign.sol': campaignSource,
    'CampaignFactory.sol': factorySource
  }
};
const output = solc.compile(input, 1).contracts;

fs.ensureDirSync(buildPath);

for (let contract in output) {
  if (output.hasOwnProperty(contract)) {
    const colonLocation = contract.indexOf(':');
    fs.outputJsonSync(
      path.resolve(buildPath, `${contract.slice(colonLocation + 1)}.json`),
      output[contract]
    );
  }
}
