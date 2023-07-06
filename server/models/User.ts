import mongoose, { Document } from 'mongoose';


interface Rating{
    scores: [number],
    code: string
}
type Protocol = string

interface protocolRating{
    [key: Protocol]: Rating
}

interface UserReferral extends Document {
    // [key: string]: string;
    hello: string;
}

interface User extends Document {
    cookieId: string;
    walletId: string;
    referralCode: string;
    referredUsers: UserReferral[];
    protocolRatings: protocolRating[];
}



const ReferralSchema = new mongoose.Schema({
    type: Map,
    of: String
})

// Map protocol to [ratings, referral code]
const RatingSchema = new mongoose.Schema({
    type: Map,
    of: new mongoose.Schema({
        scores: {type: [Number], required: true},
        code: {type: String, required: false}
    })
})

const UserSchema = new mongoose.Schema({
    // cookie_id: {type: mongoose.Types.ObjectId, required: true},
    cookieId: {type: String, required: true},
    walletId: {type: String, required: true},
    referralCode: {type: String, required: false},
    referredUsers: {type: [ReferralSchema], required: false},
    protocolRatings: {type: [RatingSchema], required: false}
});

const UserModel = mongoose.model<User>('user', UserSchema);
const RatingModel = mongoose.model<protocolRating[]>('rating', RatingSchema)
const ReferralModel = mongoose.model<UserReferral>('referral', ReferralSchema)
export default UserModel;
export {RatingModel, ReferralModel}