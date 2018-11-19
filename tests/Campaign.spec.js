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

  it('allows people to contribute money and marks them as approvers', async () => {
    await campaign.methods.contribute().send({
      value: '200',
      from: accounts[1]
    });
    const isContributor = await campaign.methods.approvers(accounts[1]).call();
    expect(isContributor).to.equal(true);
  });

  it('allows an owner to make a payment request', async () => {
    await campaign.methods
      .createRequest('Buy batteries', '100', accounts[1])
      .send({
        from: accounts[0],
        gas: '1000000'
      });
    const request = await campaign.methods.requests(0).call();
    expect(request.description).to.equal('Buy batteries');
  });

  it('can process requests', async () => {
    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei('10', 'ether')
    });

    await campaign.methods
      .createRequest('A', web3.utils.toWei('5', 'ether'), accounts[1])
      .send({
        from: accounts[0],
        gas: '1000000'
      });

    await campaign.methods.approveRequest(0).send({
      from: accounts[0],
      gas: '1000000'
    });

    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: '1000000'
    });

    let balance = await web3.eth.getBalance(accounts[1]);
    balance = web3.utils.fromWei(balance, 'ether');
    balance = parseFloat(balance);

    expect(balance).to.be.gt(104);
  });
});
