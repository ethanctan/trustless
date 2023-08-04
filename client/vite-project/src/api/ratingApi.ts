import { UserIdentity } from "../interfaces/user";
import createAxiosInstance from "./axiosConfig";
import {Rating, ProtocolRatings } from "../interfaces/rating"

const axiosInstance = createAxiosInstance("ratings")

async function postRating(user : UserIdentity, rating : Rating){

    let scoreAndCode = {scores: rating.scores, code: rating.code}
    try{
        const response = await axiosInstance.post(`/${user.cookieId}/${user.walletId}`, {
            rating: scoreAndCode,
            protocolName: rating.protocol
          });
        return response.data.message
    }catch(err){
        console.log("error:",err)
    }
}

interface RatingWithoutProtocol {
    scores : number[]
    code : string
}

async function getRating(user : UserIdentity, protocol : string): Promise<RatingWithoutProtocol>{
    const userRating = await 
        axiosInstance.get<RatingWithoutProtocol>(`/${user.cookieId}/${user.walletId}/${protocol}`);
    return userRating.data
}


// Retrieving all of a user's ratings 
export async function getProtocolRatings(cookieId: string, walletId: string) {
    try {
        const response = await axiosInstance.get<ProtocolRatings>(`/${cookieId}/${walletId}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch protocol ratings:', error);
        return null;
    }
  }



export { postRating, getRating }