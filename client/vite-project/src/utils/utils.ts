//Helper functions for app.ts
import Axios from 'axios';
import {Protocol, GetProtocolResponse} from './interfaces.ts'
import { UserIdentity } from '../interfaces/user.ts';
import { postRating } from '../api/ratingApi.ts';
import { Rating } from '../interfaces/rating.ts';




// Add a rating to a user's rating mapping
export async function addRating(user: UserIdentity, rating: Rating): Promise<void> {
  let response = await postRating(user, rating)
  await updateProtocol(rating.protocol, rating.scores);
  return response
}

// Update a rating that already exists in a user's rating mapping
export async function updateRating(user: UserIdentity, rating: Rating): Promise<void> {
  try {
    const prev = await Axios.get<number[]>(`http://localhost:3001/user/${user.cookieId}/${user.walletId}/getRating?protocolName=${rating.protocol}`);

    // Reverse the values in the array
    const reversedPrev = prev.data.map((num) => -num);

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


