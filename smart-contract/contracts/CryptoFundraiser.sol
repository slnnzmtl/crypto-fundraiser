// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CryptoFundraiser {
    enum Status { Active, Completed, Failed }

    struct Campaign {
        address payable owner;
        string title;
        string description;
        string image;
        uint96 goal;
        uint40 deadline;
        uint96 balance;
        bool completed;
        bool autoComplete;
        Status status;
    }

    // Packed storage variables
    uint32 public campaignCount;

    // Constants - reduced sizes but kept reasonable limits
    uint96 public constant MAX_GOAL = 100 ether;  // Reduced from 1000 to 100 ETH
    uint16 public constant MAX_DURATION_DAYS = 180; // Reduced from 365 to 180 days
    uint8 public constant MAX_TITLE_LENGTH = 50;    // Reduced from 100 to 50
    uint16 public constant MAX_DESCRIPTION_LENGTH = 500; // Reduced from 1000 to 500
    uint8 public constant MAX_IMAGE_URL_LENGTH = 200;   // Reduced from 300 to 200

    // Mappings
    mapping(uint32 => Campaign) public campaigns;
    mapping(address => mapping(uint32 => uint96)) public donations;

    // Events - optimized by removing redundant data
    event CampaignCreated(
        uint32 indexed campaignId,
        address indexed owner,
        string title,
        uint96 goal,
        uint40 deadline
    );

    event DonationReceived(
        uint32 indexed campaignId,
        address indexed donor,
        uint96 amount,
        string message
    );

    event CampaignCompleted(uint32 indexed campaignId, bool successful);
    event FundsWithdrawn(uint32 indexed campaignId, uint96 amount);

    // Function to create a campaign - optimized parameters
    function createCampaign(
        string calldata title,
        string calldata description,
        uint96 goalInWei,
        uint16 durationInDays,
        string calldata image,
        bool autoComplete
    ) external {
        require(goalInWei > 0 && goalInWei <= MAX_GOAL, "Invalid goal");
        require(durationInDays > 0 && durationInDays <= MAX_DURATION_DAYS, "Invalid duration");
        
        bytes memory titleBytes = bytes(title);
        bytes memory descBytes = bytes(description);
        bytes memory imageBytes = bytes(image);
        
        require(titleBytes.length > 0 && titleBytes.length <= MAX_TITLE_LENGTH, "Invalid title");
        require(descBytes.length > 0 && descBytes.length <= MAX_DESCRIPTION_LENGTH, "Invalid description");
        require(imageBytes.length <= MAX_IMAGE_URL_LENGTH, "Invalid image URL");

        uint40 deadline = uint40(block.timestamp + (uint40(durationInDays) * 1 days));
        require(deadline > block.timestamp, "Invalid deadline");

        uint32 newCampaignId = campaignCount;
        campaigns[newCampaignId] = Campaign({
            owner: payable(msg.sender),
            title: title,
            description: description,
            image: image,
            goal: goalInWei,
            deadline: deadline,
            balance: 0,
            completed: false,
            autoComplete: autoComplete,
            status: Status.Active
        });

        emit CampaignCreated(
            newCampaignId,
            msg.sender,
            title,
            goalInWei,
            deadline
        );
        
        unchecked {
            campaignCount++;
        }
    }

    // Function to get campaign status
    function getCampaignStatus(uint32 _campaignId) public view returns (Status) {
        require(_campaignId < campaignCount, "Campaign does not exist");
        Campaign storage campaign = campaigns[_campaignId];
        
        if (campaign.completed) {
            return campaign.status;
        }
        
        if (block.timestamp >= campaign.deadline) {
            return campaign.balance >= campaign.goal ? Status.Completed : Status.Failed;
        }
        
        return Status.Active;
    }

    // Function to get all campaigns
    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](campaignCount);
        
        for(uint32 i = 0; i < campaignCount; i++) {
            Campaign storage campaign = campaigns[i];
            Status currentStatus = getCampaignStatus(i);
            
            allCampaigns[i] = Campaign({
                owner: campaign.owner,
                title: campaign.title,
                description: campaign.description,
                image: campaign.image,
                goal: campaign.goal,
                deadline: campaign.deadline,
                balance: campaign.balance,
                completed: campaign.completed,
                autoComplete: campaign.autoComplete,
                status: currentStatus
            });
        }
        
        return allCampaigns;
    }

    // Function to get a single campaign with status
    function getCampaign(uint32 _campaignId) public view returns (Campaign memory) {
        require(_campaignId < campaignCount, "Campaign does not exist");
        Campaign storage campaign = campaigns[_campaignId];
        Status currentStatus = getCampaignStatus(_campaignId);
        
        return Campaign({
            owner: campaign.owner,
            title: campaign.title,
            description: campaign.description,
            image: campaign.image,
            goal: campaign.goal,
            deadline: campaign.deadline,
            balance: campaign.balance,
            completed: campaign.completed,
            autoComplete: campaign.autoComplete,
            status: currentStatus
        });
    }

    // Function to get user's donations
    function getDonations(uint32 _campaignId) public view returns (uint96) {
        require(_campaignId < campaignCount, "Campaign does not exist");
        return donations[msg.sender][_campaignId];
    }

    // Function to donate to a campaign
    function donate(uint32 _campaignId, string calldata message) external payable {
        require(_campaignId < campaignCount, "Campaign does not exist");
        Campaign storage campaign = campaigns[_campaignId];

        require(block.timestamp < campaign.deadline, "Campaign has ended");
        require(!campaign.completed, "Campaign is already completed");
        require(msg.value > 0, "Donation must be greater than 0");
        require(getCampaignStatus(_campaignId) == Status.Active, "Campaign is not active");

        // Convert msg.value to uint96 and check for overflow
        require(msg.value <= type(uint96).max, "Donation amount too large");
        uint96 amount = uint96(msg.value);

        campaign.balance += amount;
        donations[msg.sender][_campaignId] += amount;

        emit DonationReceived(_campaignId, msg.sender, amount, message);

        // Auto-complete the campaign if goal is reached and autoComplete is enabled
        if (campaign.autoComplete && campaign.balance >= campaign.goal) {
            _completeCampaign(_campaignId);
        }
    }

    // Function to check if a campaign can be completed
    function canCompleteCampaign(uint32 _campaignId) public view returns (bool) {
        require(_campaignId < campaignCount, "Campaign does not exist");
        Campaign storage campaign = campaigns[_campaignId];
        
        if (campaign.completed) {
            return false;
        }

        // Can complete if goal is reached (with autoComplete)
        if (campaign.autoComplete && campaign.balance >= campaign.goal) {
            return true;
        }

        // Can complete if deadline has passed
        if (block.timestamp >= campaign.deadline) {
            return true;
        }

        // Can complete if goal is reached and owner initiates
        if (campaign.balance >= campaign.goal && msg.sender == campaign.owner) {
            return true;
        }

        return false;
    }

    // Function to complete a campaign
    function completeCampaign(uint32 _campaignId) external {
        require(_campaignId < campaignCount, "Campaign does not exist");
        Campaign storage campaign = campaigns[_campaignId];

        require(msg.sender == campaign.owner, "Only owner can complete the campaign");
        require(canCompleteCampaign(_campaignId), "Campaign cannot be completed yet");
        require(!campaign.completed, "Campaign is already completed");

        _completeCampaign(_campaignId);
    }

    // Internal function to complete a campaign
    function _completeCampaign(uint32 _campaignId) internal {
        Campaign storage campaign = campaigns[_campaignId];
        require(!campaign.completed, "Campaign is already completed");

        campaign.completed = true;

        if (campaign.balance >= campaign.goal) {
            campaign.status = Status.Completed;
            campaign.owner.transfer(uint256(campaign.balance));
            emit CampaignCompleted(_campaignId, true);
        } else {
            campaign.status = Status.Failed;
            emit CampaignCompleted(_campaignId, false);
        }
    }

    // Function to check if funds can be withdrawn
    function canWithdrawFunds(uint32 _campaignId) public view returns (bool) {
        require(_campaignId < campaignCount, "Campaign does not exist");
        Campaign storage campaign = campaigns[_campaignId];
        
        // Only completed campaigns can be withdrawn from
        if (!campaign.completed) {
            return false;
        }

        // Only owner can withdraw
        if (msg.sender != campaign.owner) {
            return false;
        }

        // Must have balance to withdraw
        if (campaign.balance == 0) {
            return false;
        }

        // Must have reached goal to withdraw
        if (campaign.balance < campaign.goal) {
            return false;
        }

        return true;
    }

    // Function to withdraw funds from a completed campaign
    function withdrawFunds(uint32 _campaignId) external {
        require(_campaignId < campaignCount, "Campaign does not exist");
        Campaign storage campaign = campaigns[_campaignId];
        
        require(campaign.completed, "Campaign is not completed");
        require(msg.sender == campaign.owner, "Only owner can withdraw funds");
        require(campaign.balance > 0, "No funds to withdraw");
        require(campaign.balance >= campaign.goal, "Campaign did not reach its goal");

        uint amount = campaign.balance;
        campaign.balance = 0;
        
        // Transfer funds to owner using transfer instead of call
        // This limits gas to 2300 and reverts on failure
        payable(campaign.owner).transfer(uint96(amount));

        emit FundsWithdrawn(_campaignId, uint96(amount));
    }

    // Function to refund donations 
    function refund(uint32 _campaignId) external {
        require(_campaignId < campaignCount, "Campaign does not exist");
        Campaign storage campaign = campaigns[_campaignId];

        require(block.timestamp >= campaign.deadline, "Campaign is still active");
        require(campaign.balance < campaign.goal, "Campaign reached its goal");
        require(!campaign.completed, "Campaign is already completed");
        require(getCampaignStatus(_campaignId) != Status.Completed, "Cannot refund completed campaign");

        uint96 donation = donations[msg.sender][_campaignId];
        require(donation > 0, "You have no donations to refund");

        donations[msg.sender][_campaignId] = 0;
        campaign.balance -= donation;
        
        // Safe conversion since donation is uint96
        payable(msg.sender).transfer(uint256(donation));
    }
}
