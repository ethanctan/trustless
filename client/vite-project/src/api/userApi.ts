import { UserIdentity, UserInfo, emptyUserInfo } from "../interfaces/user";
import { ProtocolRatings } from "../interfaces/rating";
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
      console.log("adduser response", response.data.message)
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
      
      // Restructure the response data
      const restructuredRatings: ProtocolRatings = {};
      for (const protocolName in response.data.protocolRatings) {
          const combinedKey = protocolName;
          console.log("combinedKey", combinedKey)
          const rating = response.data.protocolRatings[protocolName];
          
          const [epoch, protocol] = combinedKey.split("#");
          
          restructuredRatings[protocolName] = {
              protocol: protocol,
              epoch: Number(epoch),
              scores: rating.scores,
              code: rating.code,
          };
          console.log("restructuredRatings", restructuredRatings)
      }
      
      const restructuredResponse: UserInfo = {
          walletId: response.data.walletId,
          referralCode: response.data.referralCode,
          protocolRatings: restructuredRatings,
      };
      
      return { isFound: true, data: restructuredResponse };
  } catch (error) {
      console.log("Error:", error);
      return { isFound: false, data: emptyUserInfo };
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