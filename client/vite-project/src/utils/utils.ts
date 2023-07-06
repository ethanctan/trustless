//Helper functions for app.ts
import Axios from 'axios';
import {Protocol, GetProtocolResponse} from './interfaces.ts'
import {NewUser, Rating, ProtocolRating} from './interfaces.ts'



async function checkIp(ipAddress : string, protocol : string) : Promise<boolean>{
  // Why are you sending a post request here?
  await Axios.post('http://localhost:3001/ip', {
    ipAddress: ipAddress,
    protocolName: protocol,
  })

  const response1 = await Axios.get<boolean>(`http://localhost:3001/ip?ip=${ipAddress}`);
  const isWithin = response1.data;

  return isWithin
}

// Add user to database
export async function addUser(user: NewUser): Promise<void> {
  try {
    await Axios.post('/api/users', user);
    console.log('User added successfully');
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
}

// Check if a user with a specific referralCode exists
export async function checkUser(referralCode: string): Promise<void> {
  try {
    const response = await Axios.get<boolean>(`/api/users/${referralCode}`);
    console.log(response);
  } catch (error) {
    console.error('Error checking user:', error);
    throw error;
  }
}

// Add a rating to a user's rating mapping
export async function addRating(cookieId: string, walletId: string, protocolName: string, rating: Rating): Promise<void> {
  try {
    await Axios.post(`/api/users/${cookieId}/${walletId}/addRating`, {
      rating: rating,
      protocolName: protocolName
    });
    console.log('Rating added successfully');
  } catch (error) {
    console.error('Error adding rating:', error);
    throw error;
  }
}

// Update a rating that already exists in a user's rating mapping
export async function updateRating(cookieId: string, walletId: string, protocolName: string, rating: Rating): Promise<void> {
  try {
    await Axios.post(`/api/users/${cookieId}/${walletId}/updateRating`, {
      rating: rating,
      protocolName: protocolName
    });
    console.log('Rating updated successfully');
  } catch (error) {
    console.error('Error updating rating:', error);
    throw error;
  }
}

// Add a walletaddress:protocol pair to the user's referredUser mapping
export async function addReferral(cookieId: string, walletId: string, walletAddress: string, referral: string): Promise<void> {
  try {
    await Axios.post(`/api/users/${cookieId}/${walletId}/addReferral`, {
      walletAddress: walletAddress,
      referral: referral
    });
    console.log('Referral added successfully');
  } catch (error) {
    console.error('Error adding referral:', error);
    throw error;
  }
}

// Get ratings for a specific user
export async function getUserRatings(cookieId: string, walletId: string): Promise<ProtocolRating> {
  try {
    const response = await Axios.get<ProtocolRating>(`/api/users/${cookieId}/${walletId}/getRatings`);
    return response.data;
  } catch (error) {
    console.error('Error getting user ratings:', error);
    throw error;
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

  

export {updateProtocol, checkScoresCorrect, checkIp, 
   validAddr, generateReferralCode}



// async function addDispute(protocol: string, influencer: string, scores : number[]) : Promise<[any, any, any]>{
//   try{
//     let disputeResponse = await updateDisputes(protocol, influencer, scores)
//     let [ascendingResponse, descendingResponse] = await updateProtocol(protocol, scores)
//     return [disputeResponse, ascendingResponse, descendingResponse]    
//   }
//   catch (error) {
//     console.log('There was an error with the addIprequest:', error);
//     return [-1, -1, -1]
//   }  
// }; 

// async function updateDisputes(protocol : string, influencer: string, scores : number[]){
//      // send data to disputes
//      try {
//       await Axios.post('http://localhost:3001/disputes', {
//       protocol: protocol,
//       influencer: influencer,
//       qVals: scores
//     });
//     const response = await Axios.get<Dispute[]>('http://localhost:3001/disputes');
//     return response
    
//   } catch (error) {
//     console.error('There was an error with the addDispute request:', error);
//   }
// }