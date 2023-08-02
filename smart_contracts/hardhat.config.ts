import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const INFURA_API_KEY = "634d5ea6a2e84ad18e28bd2119b17f93";
const SEPOLIA_PRIVATE_KEY = "1f505417c00af3fb18d5d48afd892d8d318262e232d0fcba395a84ee7f71ee80";

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    hardhat: {
      loggingEnabled: true
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [SEPOLIA_PRIVATE_KEY]
    }
  },
};

export default config;
