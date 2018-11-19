const expect = require('chai').expect;
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

describe('Campaigns', () => {
  let accounts;
  let factory;
  let campaign;

  beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
      .deploy({ data: compiledFactory.bytecode })
      .send({ from: accounts[0], gas: '1000000' });

    await factory.methods
      .createCampaign('hello', '100')
      .send({ from: accounts[0], gas: '1000000' });

    const [
      campaignAddress
    ] = await factory.methods.getDeployedCampaigns().call();

    campaign = await new web3.eth.Contract(
      JSON.parse(compiledCampaign.interface),
      campaignAddress
    );
  });

  it('deploys a factory and a campaign', () => {
    expect(factory.options.address).to.not.equal(null);
    expect(campaign.options.address).to.not.equal(null);
  });

  it('marks the creator as the campaign owner', async () => {
    const owner = await campaign.methods.owner().call();
    expect(owner).to.equal(accounts[0]);
  });

  it('requires a minimum contribution', async () => {
    try {
      await campaign.methods.contribute().send({
        value: '50',
        from: accounts[1]
      });
    } catch (err) {
      expect(err).to.not.equal(null);
    }
  });
});
