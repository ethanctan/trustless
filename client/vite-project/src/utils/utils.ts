//Helper functions for app.ts
import Axios from 'axios';
import {Dispute, Protocol, GetProtocolResponse} from './interfaces.ts'


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

async function addDispute(protocol: string, influencer: string, scores : number[]) : Promise<[any, any, any]>{
  try{
    let disputeResponse = await updateDisputes(protocol, influencer, scores)
    let [ascendingResponse, descendingResponse] = await updateProtocol(protocol, scores)
    return [disputeResponse, ascendingResponse, descendingResponse]    
  }
  catch (error) {
    console.log('There was an error with the addIprequest:', error);
    return [-1, -1, -1]
  }  
}; 

async function updateDisputes(protocol : string, influencer: string, scores : number[]){
     // send data to disputes
     try {
      await Axios.post('http://localhost:3001/disputes', {
      protocol: protocol,
      influencer: influencer,
      qVals: scores
    });
    const response = await Axios.get<Dispute[]>('http://localhost:3001/disputes');
    return response
    
  } catch (error) {
    console.error('There was an error with the addDispute request:', error);
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

  

export {updateProtocol, updateDisputes, checkScoresCorrect, checkIp, 
  addDispute, validAddr, generateReferralCode}