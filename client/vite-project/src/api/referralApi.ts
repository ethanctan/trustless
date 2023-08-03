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

/**
 * @param referralCode 
 * @returns whether referral code exists. Returns true for empty string since
 * it is vacuously true if no referral code exists
 */
async function checkReferralCodeExists(referralCode : string): Promise<boolean> {
    if (referralCode == ""){
      return true
    }
    try {
        const response = await axiosInstance.get<boolean>(`/${referralCode}`);
        return response.data;
    } catch (error) {
        console.error('Error checking user:', error);
        throw error;
    }
}

export {addReferral, checkReferralCodeExists}