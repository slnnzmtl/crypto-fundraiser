const { ethers } = require("hardhat");
const { contractAddress } = require("../config");

class CryptoFundraiserController {
    constructor(contractAddress) {
        this.contractAddress = contractAddress;
        this.contract = null;
        this.signer = null;
    }

    async init() {
        try {
            const CryptoFundraiser = await ethers.getContractFactory("CryptoFundraiser");
            this.contract = await CryptoFundraiser.attach(this.contractAddress);
            [this.signer] = await ethers.getSigners();
            return true;
        } catch (error) {
            console.error("Initialization error:", error);
            return false;
        }
    }

    // Получение всех кампаний
    async getCampaigns() {
        try {
            const campaigns = await this.contract.getCampaigns();
            return campaigns.map(campaign => ({
                owner: campaign.owner,
                goal: ethers.formatEther(campaign.goal),
                deadline: new Date(Number(campaign.deadline) * 1000),
                balance: ethers.formatEther(campaign.balance),
                completed: campaign.completed
            }));
        } catch (error) {
            console.error("Error getting campaigns:", error);
            throw error;
        }
    }

    // Создание новой кампании
    async createCampaign(goalInEth, durationInDays) {
        try {
            const tx = await this.contract.createCampaign(
                ethers.parseEther(goalInEth.toString()),
                durationInDays
            );
            await tx.wait();
            return true;
        } catch (error) {
            console.error("Error creating campaign:", error);
            throw error;
        }
    }

    // Внесение пожертвования
    async donate(campaignId, amountInEth) {
        try {
            const tx = await this.contract.donate(campaignId, {
                value: ethers.parseEther(amountInEth.toString())
            });
            await tx.wait();
            return true;
        } catch (error) {
            console.error("Error donating:", error);
            throw error;
        }
    }

    // Получение пожертвований пользователя
    async getDonations(address) {
        try {
            const donations = await this.contract.getDonations(address);
            return donations.map(donation => ethers.formatEther(donation));
        } catch (error) {
            console.error("Error getting donations:", error);
            throw error;
        }
    }

    // Завершение кампании
    async completeCampaign(campaignId) {
        try {
            const tx = await this.contract.completeCampaign(campaignId);
            await tx.wait();
            return true;
        } catch (error) {
            console.error("Error completing campaign:", error);
            throw error;
        }
    }

    // Возврат средств
    async refund(campaignId) {
        try {
            const tx = await this.contract.refund(campaignId);
            await tx.wait();
            return true;
        } catch (error) {
            console.error("Error refunding:", error);
            throw error;
        }
    }

    // Получение деталей конкретной кампании
    async getCampaignDetails(campaignId) {
        try {
            const campaign = await this.contract.campaigns(campaignId);
            return {
                owner: campaign.owner,
                goal: ethers.formatEther(campaign.goal),
                deadline: new Date(Number(campaign.deadline) * 1000),
                balance: ethers.formatEther(campaign.balance),
                completed: campaign.completed
            };
        } catch (error) {
            console.error("Error getting campaign details:", error);
            throw error;
        }
    }
}

// Пример использования
async function main() {
    if (!contractAddress) {
        throw new Error("Contract address not found in config.js");
    }
    
    const controller = new CryptoFundraiserController(contractAddress);
    
    try {
        // Инициализация
        await controller.init();

        // Примеры вызовов
        // Создание кампании
        await controller.createCampaign(1.0, 30);
        
        // Получение всех кампаний
        const campaigns = await controller.getCampaigns();
        console.log("Campaigns:", campaigns);
        
        // Внесение пожертвования
        await controller.donate(0, 0.1);
        
        // Получение деталей кампании
        const details = await controller.getCampaignDetails(0);
        console.log("Campaign details:", details);
        
    } catch (error) {
        console.error("Error in main:", error);
    }
}

// Экспорт контроллера и адреса контракта для использования во фронтенде
module.exports = {
    CryptoFundraiserController,
    contractAddress
};

// Запуск примера использования при прямом вызове скрипта
if (require.main === module) {
    main()
        .then(() => process.exit(0))
        .catch(error => {
            console.error(error);
            process.exit(1);
        });
}
