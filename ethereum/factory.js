import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

export default new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0xf2752bB25Ad47315618a744fd21d16DD2620524c'
);
