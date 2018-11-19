import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

export default new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0x540253F60B821490100e7daDac17c67b93866d68'
);
