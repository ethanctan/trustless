//Helper functions for app.ts
import Axios from 'axios';
import {Dispute, Protocol, GetProtocolResponse} from './interfaces.ts'

function checkScoresCorrect(dispute : number[]){
    for (let i=0; i < dispute.length; i++){
        if (dispute[i] > 10 || dispute[i] < 1){
            return false
        }
    }
    return true
  }

async function updateDisputes(protocol : string, scores : number[]){
     // send data to disputes
     try {
      await Axios.post('http://localhost:3001/disputes', {
      protocol: protocol,
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
    }
    return [-1, -1]
  }

export {updateProtocol, updateDisputes, checkScoresCorrect}