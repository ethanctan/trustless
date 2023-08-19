import { UserIdentity } from "../../interfaces/user";
import {Rating, ProtocolRatings, emptyRating } from "../../interfaces/rating"
import { getProtocolRatings, getRating } from "../../api/ratingApi";
import { checkReferralCodeExists, addReferral } from '../../api/referralApi.ts';
import { UserReferral } from "../../interfaces/user";
import { addRating, updateRating } from "../../utils/utils";


type Success<T> = {status : 'success', data: T}
type Error = {status : 'error', error : string}
type CheckedResponse<T> = (Success<T> | Error)

type SubmissionResponse  =  {
    ratingMessage : string;
    protocolRatings : ProtocolRatings
} 

type RatingResponse = {protocolRatings : ProtocolRatings}



class FormHandler {

    async addUserRating(user : UserIdentity, newRating : Rating){
        console.log("adding rating")
        console.log("user", user)
        console.log("newRating", newRating)
        try{
            await addRating(user, newRating);
            return "Successfully added!"
        }catch(error:any) {
            if (error.response && error.response.status === 400)
                return "You have already rated this protocol."
            return "Oops! Something went wrong"
        }
    }

    async getAllOfUsersRatings(user : UserIdentity) : Promise<CheckedResponse<RatingResponse>>{
        const response1 = await getProtocolRatings(user.walletId);
        if (response1 != null) 
            return {status : 'success', data: { protocolRatings : response1}}
        
        return {status : 'success', data: {protocolRatings : emptyRating}}
    }

    private createError(message : string) : Error {
        return {status : 'error', error: message}
    }    

    async handleUserSubmission(user : UserIdentity, rating : Rating): Promise<CheckedResponse<SubmissionResponse>>{ 
        console.log("handleUserSubmission")
        let preconditionSatisfied = await this.checkSubmissionPreConditions(user, rating)
        if (preconditionSatisfied.status == "error"){
            return preconditionSatisfied
        }
        
      //add referral to influencer if it exists
      if (rating["code"] && rating["code"] != "") {
          let userReferral:UserReferral = { protocol:rating.protocol }
          await addReferral(rating["code"], user.walletId, userReferral);
      }
      console.log("adding user rating")
      let rating_msg = await this.addUserRating(user, rating)
      console.log("rating_msg", rating_msg)
      let response1 = await this.getAllOfUsersRatings(user)
      if (response1.status == "success"){
        let responseData = response1.data
        return {status: 'success', data : {ratingMessage : rating_msg, 
            protocolRatings: responseData.protocolRatings}}
      }
        
    
      return response1
      
  }; 

    private async checkSubmissionPreConditions(user : UserIdentity, rating : Rating) : 
        Promise<CheckedResponse<string>>{
        console.log("checkSubmissionPreConditions")
        const influencerExists = await checkReferralCodeExists(rating["code"]); //check if influencer exists
        if (!influencerExists){
            return this.createError("Influencer does not exist. Try again or leave blank!")
        }
        if (user.walletId == null || user.walletId == "") {
            return this.createError("Wallet not connected. Try again!")
        }
        //Check user has not already submitted rating
        console.log("rating.protocol", rating.protocol)
        let resp = await getRating(user, rating.protocol)
        if (resp.isFound){return this.createError("You have already rated this protocol!")}

        return {status : 'success', data: ""}
    }


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
    
    return this.getAllOfUsersRatings(user)
  }

  


}

export default FormHandler