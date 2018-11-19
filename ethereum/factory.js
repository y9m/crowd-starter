import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

export default new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0x645e205Ab9d418bc4BB0000b4884660a533774b3'
);
