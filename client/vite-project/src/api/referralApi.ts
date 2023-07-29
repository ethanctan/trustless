import { UserReferral } from "../interfaces/user";
import createAxiosInstance from "./axiosConfig";

const axiosInstance = createAxiosInstance('referrals')

async function addReferral(referralCode: string, walletAddress: string, referralprotocol: UserReferral): Promise<void> {
    try {
      const response = await axiosInstance.post(`/${referralCode}`, {
        walletAddress: walletAddress,
        referralprotocol: referralprotocol
      });
      return response.data.message
    } catch (error) {
      console.error('Error adding referral:', error);
      throw error;
    }
  }

  // Check if a user with a specific referralCode exists
async function checkReferralCodeExists(referralCode : string): Promise<boolean> {
    try {
        const response = await axiosInstance.get<boolean>(`/${referralCode}`);
        return response.data;
    } catch (error) {
        console.error('Error checking user:', error);
        throw error;
    }
}

export {addReferral, checkReferralCodeExists}