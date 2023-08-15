import { UserIdentity, UserInfo, emptyUserInfo } from "../interfaces/user";
import createAxiosInstance from "./axiosConfig";

const axiosInstance = createAxiosInstance("user")

// Add user to database
export async function addUser(account : string ) {
    let userInfo: UserIdentity = {
      cookieId: "",
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

interface UserInfoResponse { 
  isFound : boolean, data : UserInfo
}

export async function getUserInfo(walletId: string): Promise<UserInfoResponse> {
    try {
        const response = await axiosInstance.get<UserInfo>(`/getUserInfo/${walletId}`);
        return {isFound : true, data : response.data};
    } catch (error) {
      console.log("Hello")
      return {isFound : false, data : emptyUserInfo}
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