import UserModel from "../models/user/UserModel";
import User from "../models/user/User";

export default class ReferralController{

    async checkReferralCodeExists(referralCode : string){
        try{
            const referralCodeExists = await UserModel.findOne({ 
                referralCode: referralCode });
            return Boolean(referralCodeExists)
        }catch(err){
            return false
        }
    }


    async handleAddReferral(referralCode : string, refereeWalletId : string){
        const referee = await UserModel.findOne({walletId: refereeWalletId})

        let response = await this.addReferral(
                User.createUserFromDocument(referee), referralCode)
        return response
    }

    /**
     * Adds referee to the referrer's map of referred user
     * Should not allow users to add themselves as a referrer
     * @param referee 
     * @param referrerCode 
     */
    async addReferral(referee : User, referrerCode : string){
        const referrer = await UserModel.findOne({
            referralCode : referrerCode})

        let status = this.checkReferralConditions(referee,
                                         User.createUserFromDocument(referrer))
        if (status != "valid" || referrer == null){
            return status
        }
        referrer.referredUsers += 1
        await referrer.save()

        return "successfully added/updated referral code"
    }

    private checkReferralConditions(referee : User, referrer : User){
        
        if (referee.isNull()) return "referee not found"
        if (referrer.isNull()) return "referrer not found"
        

        if (referrer.walletId == referee.walletId || 
                referrer.cookieId == referee.cookieId){
            return "user submitted own referral code"
        }

        return "valid"
    }
}