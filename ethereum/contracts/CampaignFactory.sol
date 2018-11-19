pragma solidity ^0.4.17;

import "./Campaign.sol";

contract CampaignFactory {
	address[] public deployedCampaigns;

    function createCampaign(string name, uint minimum) public {
        address newCampaign = new Campaign(name, minimum, msg.sender);
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[]) {
        return deployedCampaigns;
    }
}
