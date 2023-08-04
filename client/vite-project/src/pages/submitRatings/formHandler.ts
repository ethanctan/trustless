import { UserIdentity } from "../../interfaces/user";
import {Rating, ProtocolRatings, emptyRating } from "../../interfaces/rating"
import { getProtocolRatings } from "../../api/ratingApi";
import { checkReferralCodeExists, addReferral } from '../../api/referralApi.ts';
import { UserReferral } from "../../interfaces/user";
import { addRating, updateRating } from "../../utils/utils";


type Success = {status : 'success'}
type Error = {status : 'error', error : string}

type CheckedSubmissionResponse = (SubmissionResponse | Error)
type SubmissionResponse  = Success & {
    ratingMessage : string;
    protocolRatings : ProtocolRatings
} 

type CheckedRatingResponse = (RatingResponse | Error)

type RatingResponse = Success & {protocolRatings : ProtocolRatings}



class FormHandler {


    async addUserRating(user : UserIdentity, newRating : Rating){
        try{
            await addRating(user, newRating);
            return "Successfully added!"
        }catch(error:any) {
            if (error.response && error.response.status === 400)
                return "You have already rated this protocol."
            return "Oops! Something went wrong"
        }
    }

    async getRatings(user : UserIdentity) : Promise<CheckedRatingResponse>{
        const response1 = await getProtocolRatings(user.cookieId, user.walletId);
        if (response1 != null) 
            return {status : 'success', protocolRatings : response1}
        
        return {status : 'success', protocolRatings : emptyRating}
    }

    private createError(message : string) : Error {
        return {status : 'error', error: message}
    }    

    async handleUserSubmission(user : UserIdentity, rating : Rating) : Promise<CheckedSubmissionResponse>{ 
      
        const influencerExists = await checkReferralCodeExists(rating["code"]); //check if influencer exists
        if (!influencerExists){
            return this.createError("Influencer does not exist. Try again or leave blank!")
        }
        if (user.walletId == null || user.walletId == "") {
            return this.createError("Wallet not connected. Try again!")
        }
      //add referral to influencer
      if (rating["code"] && rating["code"] !== "") {
          let userReferral:UserReferral = {
              protocol:rating.protocol
          }
          await addReferral(rating["code"], user.walletId, userReferral);
      }

      let rating_msg = await this.addUserRating(user, rating)
      let response1 = await this.getRatings(user)
      if (response1.status == "success")
        return {status: 'success', 
        ratingMessage : rating_msg, protocolRatings: response1.protocolRatings}
      
      return response1
      
  }; 


  async updateProtocol(rating : Rating, user : UserIdentity) {

    //check if influencer exists
    const exists = await checkReferralCodeExists(rating.code) 
    
    if (!exists){
        return this.createError("Influencer code does not exist. Try again!")
    }
    if (user.walletId == null || user.walletId == "") {
        return this.createError("Wallet not connected. Try again!")
    }
    await updateRating(user, rating)
    
    return this.getRatings(user)
  }


}

export default FormHandler