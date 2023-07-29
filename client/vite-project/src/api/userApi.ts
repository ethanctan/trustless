import { UserIdentity, UserInfo } from "../interfaces/user";
import createAxiosInstance from "./axiosConfig";

const axiosInstance = createAxiosInstance("user")

// Add user to database
export async function addUser(user_id : string, account : string ) {
    let userInfo: UserIdentity = {
      cookieId: user_id,
      walletId: account
    };
  
    try {
      const response = await axiosInstance.post('', userInfo);
      return response.data.message
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  }


export async function getUserInfo(cookieId: string): Promise<UserInfo> {
    try {
        const response = await axiosInstance.get<UserInfo>(`/getUserInfo/${cookieId}`);
        return response.data;
    } catch (error) {
        console.error('Error getting user ratings:', error);
        throw error;
    }
}


// Check if a cookieId exists
export async function checkCookie(cookieId: string): Promise<boolean> {
    try {
      const response = await axiosInstance.get<boolean>(`/check/${cookieId}`);
      return response.data;
    } catch (error) {
      console.error('Error checking cookieId:', error);
      throw error;
    }
  }