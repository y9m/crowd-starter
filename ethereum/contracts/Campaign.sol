pragma solidity ^0.4.17;

contract Campaign {
	struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvalVoters;
    }

    Request[] public requests;
    address public owner;
    mapping(address => bool) public approvers;
    uint public minimumContribution;
    uint public approversCount;
	string public campaignName;

	modifier restricted() {
        require(msg.sender == owner);
        _;
    }

    constructor(string name, uint minimum, address creator) public {
        campaignName = name;
        minimumContribution = minimum;
        owner = creator;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);

        approvers[msg.sender] = true;
        approversCount++;
    }

	function createRequest(string description, uint value, address recipient) public restricted {
        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
        });

        requests.push(newRequest);
    }

	function approveRequest(uint index) public {
        Request storage currentRequest = requests[index];

        require(approvers[msg.sender]);
        require(!currentRequest.approvalVoters[msg.sender]);

        currentRequest.approvalVoters[msg.sender] = true;
        currentRequest.approvalCount++;
    }

	function finalizeRequest(uint index) public restricted {
        Request storage currentRequest = requests[index];

        require(!currentRequest.complete);
        require(currentRequest.approvalCount > (approversCount / 2));

        currentRequest.recipient.transfer(currentRequest.value);
        currentRequest.complete = true;
    }

	function getSummary() public view returns (
        uint, uint, uint, uint, address
    ) {
        return (
            minimumContribution,
            this.balance,
            requests.length,
            approversCount,
            owner
        );
    }

	function getRequestsCount() public view returns (uint) {
        return requests.length;
    }

    function hasVoted(uint index, address approver) public view returns (bool) {
        Request storage currentRequest = requests[index];
        return currentRequest.approvalVoters[approver];
    }
}
