//Helper functions for app.ts
import Axios from 'axios';
import {Protocol, GetProtocolResponse, ProtocolRatings} from './interfaces.ts'
import { UserIdentity, Rating, UserInfo, UserReferral} from './interfaces.ts'

// Add user to database
export async function addUser(user_id : string, account : string ): Promise<void> {
  let userInfo: UserIdentity = {
    cookieId: user_id,
    walletId: account
  };

  try {
    const reponse = await Axios.post('http://localhost:3001/user', userInfo);
    console.log(reponse.data);
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
}

// Check if a user with a specific referralCode exists
export async function checkUser(referralCode?: string): Promise<boolean> {
  try {
    const url = referralCode 
      ? `http://localhost:3001/user/checkReferralCode?referralCode=${referralCode}`
      : 'http://localhost:3001/user/checkReferralCode';

    const response = await Axios.get<boolean>(url);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error checking user:', error);
    throw error;
  }
}

async function postRating(user : UserIdentity, rating : Rating){

  let scoreAndCode = {scores: rating.scores, code: rating.code}

  const response = await Axios.post(`http://localhost:3001/user/${user.cookieId}/${user.walletId}/addRating`, {
    rating: scoreAndCode,
    protocolName: rating.protocol
  });
  return response
}


// Add a rating to a user's rating mapping
export async function addRating(user: UserIdentity, rating: Rating): Promise<void> {
  // const response = await Axios.post(`http://localhost:3001/user/${cookieId}/${walletId}/addRating`, {
  //   rating: rating,
  //   protocolName: protocolName
  // });

  const response = await postRating(user, rating)
  console.log(response.data);

  // Only update the protocol if adding the rating didn't throw an error
  const response1 = await updateProtocol(rating.protocol, rating.scores);
  console.log(response1);

}

// Update a rating that already exists in a user's rating mapping
export async function updateRating(user: UserIdentity, rating: Rating): Promise<void> {
  try {
    const prev = await Axios.get<number[]>(`http://localhost:3001/user/${user.cookieId}/${user.walletId}/getRating?protocolName=${rating.protocol}`);
    console.log(prev.data);

    // Reverse the values in the array
    const reversedPrev = prev.data.map((num) => -num);
    console.log(reversedPrev);

    const response = await postRating(user, rating)
    console.log(response.data);

    const response1 = await updateProtocol(rating.protocol, reversedPrev);
    console.log(response1);

    const updated = await Axios.get<number[]>(`http://localhost:3001/user/${user.cookieId}/${user.walletId}/getRating?protocolName=${rating.protocol}`);
    console.log(updated.data);

    const response2 = await updateProtocol(rating.protocol, updated.data);
    console.log(response2);

  } catch (error) {
    console.error('Error updating rating:', error);
    throw error;
  }
}

// Add a walletaddress:protocol pair to the user's referredUser mapping
export async function addReferral(referralCode: string, walletAddress: string, referralprotocol: UserReferral): Promise<void> {
  try {
    const response = await Axios.post(`http://localhost:3001/user/${referralCode}/addReferral`, {
      walletAddress: walletAddress,
      referralprotocol: referralprotocol
    });
    console.log(response.data);
  } catch (error) {
    console.error('Error adding referral:', error);
    throw error;
  }
}

// Get ratings for a specific user
export async function getUserInfo(cookieId: string): Promise<UserInfo> {
  try {
    const response = await Axios.get<UserInfo>(`http://localhost:3001/user/${cookieId}/getUserInfo`);
    return response.data;
  } catch (error) {
    console.error('Error getting user ratings:', error);
    throw error;
  }
}

// Check if a cookieId exists
export async function checkCookie(cookieId: string): Promise<boolean> {
  try {
    const response = await Axios.get<boolean>(`http://localhost:3001/user/check/${cookieId}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error checking cookieId:', error);
    throw error;
  }
}

// Retrieving a user's ratings 
export async function getProtocolRatings(cookieId: string, walletId: string) {
  try {
      const response = await Axios.get<ProtocolRatings>(`http://localhost:3001/user/ratings?cookieId=${cookieId}&walletId=${walletId}`);
      return response.data;
  } catch (error) {
      console.error('Failed to fetch protocol ratings:', error);
      return null;
  }
}

// TODO: Better error handling
async function updateProtocol(protocol : string, scores : number[]) : Promise<[any, any]>{
    // send data to protocols
    try {
      let average =  (scores.reduce(
        (partialSum : number, a: number) => 
        partialSum + a, 0))/(scores.length)

      await Axios.post<Protocol>('http://localhost:3001/protocols', {
        disputeCount: 1,
        protocolName: protocol,
        averageScore: average,
        qScores: scores
      });
    
      const ascendingResponse = await Axios.get<GetProtocolResponse[]>('http://localhost:3001/protocols?order=ascending');
      const descendingResponse = await Axios.get<GetProtocolResponse[]>('http://localhost:3001/protocols?order=descending');
      return [ascendingResponse, descendingResponse]

    } catch (error) {
      console.error('There was an error with the addProtocol request:', error);
      return [-1, -1]
    }
    
  }

function checkScoresCorrect(dispute : number[]) : boolean{
  for (let i=0; i < dispute.length; i++){
      if (dispute[i] > 10 || dispute[i] < 1){
          return false
      }
  }
  return true
}

const HEXREGEX = /^0x[0-9A-F].eth/g
function validAddr(str: string){
    str = str.toLocaleLowerCase()
    return str.match(HEXREGEX)
}

function generateReferralCode(){

  return "1"
}

  

export {
  updateProtocol,
  checkScoresCorrect,
  validAddr,
  generateReferralCode
};


