import { UserIdentity } from "../interfaces/user";
import createAxiosInstance from "./axiosConfig";
import {PostRating, ProtocolRatings } from "../interfaces/rating"

const axiosInstance = createAxiosInstance("ratings")

async function postRating(user : UserIdentity, rating : PostRating){

    let scoreAndCode = {scores: rating.scores, code: rating.code}
    try{
        const response = await axiosInstance.post(`/${user.walletId}`, {
            rating: scoreAndCode,
            protocolName: rating.protocol
          });
        console.log("response:", response.data.message)
        return response.data.message
    }catch(err){
        console.log("error:",err)
    }
}

interface RatingWithoutProtocol {
    isFound : boolean
    rating : {scores : number[], code : string}
}

async function getRating(user : UserIdentity, protocol : string): Promise<RatingWithoutProtocol>{
    console.log("getting rating")
    const userRating = await 
        axiosInstance.get<RatingWithoutProtocol>(`/${user.walletId}/${protocol}`);
    return userRating.data
}


// Retrieving all of a user's ratings 
export async function getProtocolRatings(walletId: string) {
    try {
        const response = await axiosInstance.get<ProtocolRatings>(`/${walletId}`);
        
        // Restructure the protocol ratings
        const restructuredRatings: ProtocolRatings = {};
        for (const protocolName in response.data) {
            const combinedKey = protocolName;
            const rating = response.data[protocolName];
            
            const [epoch, protocol] = combinedKey.split("#");
            
            restructuredRatings[protocolName] = {
                protocol: protocol,
                epoch: Number(epoch),
                scores: rating.scores,
                code: rating.code,
            };
        }
        
        return restructuredRatings;
    } catch (error) {
        console.error('Failed to fetch protocol ratings:', error);
        return null;
    }
  }



export { postRating, getRating }