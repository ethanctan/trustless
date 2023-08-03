import UserModel, { RatingModel, ReferralModel } from "../models/user/UserModel"
import User, {NullUser, Rating, NullRating} from "../models/user/User";




type Success<T> = {status : 'success', data : T}
type ErrorMessage = {status : 'error', error : string}


type CheckedRatingResponse = (Success<RatingResponse> | ErrorMessage)
type RatingResponse = {isFound: boolean, rating: Rating}

/** Controller that handles all data processing logic for /rating routes */
export default class RatingController{


    /**
     * Adds rating to the database for a user. If user already has rating, 
     * update it instead. Returns a success/failure message
     * If user doesn't exist, then return error
     * @param userIdentity Object with fields {cookieId, walletId } both of @type string
     * @param rating Rating object
     * @param protocol Protocol
     */
    async upsertRating(userIdentity : object, rating : Rating, protocol : string){
        const user = await UserModel.findOne({ 
            cookieId: userIdentity["cookieId"], 
            walletId: userIdentity["walletId"] 
        });
        if (!user) 
            return 'user not found'
        
        const newRating = new RatingModel(
            {scores : rating.scores, code: rating.code})

        let ratingExists = Boolean(user.protocolRatings.get(protocol))
        if (ratingExists){
            return "rating already submitted"
        }
        user.protocolRatings.set(protocol, newRating);
        await user.save()
        return "rating added"
    }

    async handleGetRating(cookieId : string, walletId : string, protocolName : string) {
        let rating = await this.getUserRating(cookieId, walletId, protocolName)
        if (rating.status == 'error') return {status : 404, message: {message : rating.error}}
        

        return {status : 200, message: rating.data}
   }


   private createErrorMessage(message : string) : ErrorMessage{
        return {status : 'error', error : message}
   }

   private createSuccessMessage(rating : Rating) : Success<RatingResponse>{
        let data = {isFound: (!rating.isNull()), rating: rating}
        return {status : 'success', data : data}
   }
   

   /**
     * Gets user rating from database. Returns 
     * nullRating user or rating isn't found
     */
   async getUserRating(cookieId : string, 
    walletId : string, protocolName : string) : Promise<CheckedRatingResponse>{
        const user = await UserModel.findOne(
            { cookieId: cookieId, walletId: walletId });
        if (!user){
            return this.createErrorMessage("User not found")
        }
        const rating = user.protocolRatings.get(protocolName);
        if (rating == null) return this.createSuccessMessage(new NullRating())

        return this.createSuccessMessage(Rating.fromIRating(rating))
    }

    async handleGetAllRatings(cookieId : string, walletId : string){
       let user = await UserModel.findOne(
        { cookieId: cookieId, walletId: walletId });
        if (!user ) return {status: 404, message: 
                        {message : 'User not found'}}
        return {status : 200, message : user.protocolRatings}
    }


}