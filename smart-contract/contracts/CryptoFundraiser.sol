// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CryptoFundraiser {

    struct Campaign {
        address payable owner; // Address of the campaign owner
        string title;         // Campaign title
        string description;   // Campaign description
        string image;         // Campaign image URL
        uint goal;            // Target amount in wei
        uint deadline;        // Campaign deadline (timestamp)
        uint balance;         // Current amount raised
        bool completed;       // Flag indicating if the campaign is completed
    }

    // Mapping to store all campaigns
    mapping(uint => Campaign) public campaigns;
    uint public campaignCount = 0; // Counter for campaigns

    // Mapping to store donations
    mapping(address => mapping(uint => uint)) public donations;

    // Events
    event CampaignCreated(
        uint indexed campaignId,
        address indexed owner,
        string title,
        string description,
        string image,
        uint goal,
        uint deadline
    );
    event DonationReceived(uint indexed campaignId, address indexed donor, uint amount);
    event CampaignCompleted(uint indexed campaignId, bool successful);

    // Function to get a single campaign
    function getCampaign(uint _campaignId) public view returns (Campaign memory) {
        require(_campaignId < campaignCount, "Campaign does not exist");
        return campaigns[_campaignId];
    }

    // Function to get all campaigns
    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](campaignCount);
        
        for(uint i = 0; i < campaignCount; i++) {
            allCampaigns[i] = campaigns[i];
        }
        
        return allCampaigns;
    }

    // Function to get user's donations
    function getDonations(address _donor) public view returns (uint[] memory) {
        uint[] memory donationArray = new uint[](campaignCount);
        for(uint i = 0; i < campaignCount; i++) {
            donationArray[i] = donations[_donor][i];
        }
        return donationArray;
    }

    // Function to create a campaign
    function createCampaign(
        string memory title,
        string memory description,
        uint goalInWei,
        uint durationInDays,
        string memory image
    ) external {
        require(goalInWei > 0, "Goal must be greater than 0");
        require(durationInDays > 0, "Duration must be greater than 0");
        require(bytes(title).length > 0, "Title cannot be empty");
        require(bytes(description).length > 0, "Description cannot be empty");

        uint deadline = block.timestamp + (durationInDays * 1 days);

        campaigns[campaignCount] = Campaign({
            owner: payable(msg.sender),
            title: title,
            description: description,
            image: image,
            goal: goalInWei,
            deadline: deadline,
            balance: 0,
            completed: false
        });

        emit CampaignCreated(
            campaignCount,
            msg.sender,
            title,
            description,
            image,
            goalInWei,
            deadline
        );
        campaignCount++;
    }

    // Function to donate to a campaign
    function donate(uint _campaignId) external payable {
        require(_campaignId < campaignCount, "Campaign does not exist");
        Campaign storage campaign = campaigns[_campaignId];

        require(block.timestamp < campaign.deadline, "Campaign has ended");
        require(!campaign.completed, "Campaign is already completed");
        require(msg.value > 0, "Donation must be greater than 0");

        campaign.balance += msg.value;
        donations[msg.sender][_campaignId] += msg.value;

        emit DonationReceived(_campaignId, msg.sender, msg.value);
    }

    // Function to complete a campaign
    function completeCampaign(uint _campaignId) external {
        require(_campaignId < campaignCount, "Campaign does not exist");
        Campaign storage campaign = campaigns[_campaignId];

        require(msg.sender == campaign.owner, "Only owner can complete the campaign");
        require(block.timestamp >= campaign.deadline, "Campaign is still active");
        require(!campaign.completed, "Campaign is already completed");

        campaign.completed = true;

        if (campaign.balance >= campaign.goal) {
            campaign.owner.transfer(campaign.balance);
            emit CampaignCompleted(_campaignId, true);
        } else {
            emit CampaignCompleted(_campaignId, false);
        }
    }

    // Function to refund donations
    function refund(uint _campaignId) external {
        require(_campaignId < campaignCount, "Campaign does not exist");
        Campaign storage campaign = campaigns[_campaignId];

        require(block.timestamp >= campaign.deadline, "Campaign is still active");
        require(campaign.balance < campaign.goal, "Campaign reached its goal");

        uint donation = donations[msg.sender][_campaignId];
        require(donation > 0, "You have no donations to refund");

        donations[msg.sender][_campaignId] = 0;
        campaign.balance -= donation;
        payable(msg.sender).transfer(donation);
    }
}
