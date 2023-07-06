import mongoose, { Document } from 'mongoose';

interface UserReferral{
    [key: string]: string;
}

interface Rating{
    scores: [number],
    code: string
}

type Protocol = string

interface protocolRating{
    [key: Protocol]: Rating
}


interface User extends Document {
    cookieId: string;
    walletId: string;
    referralCode: string;
    referredUsers: UserReferral[];
    protocolRatings: protocolRating[];
}

const UserReferral = new mongoose.Schema({
    type: Map,
    of: String
})

// Map protocol to (ratings, referral code)
const UserRating = new mongoose.Schema({
    type: Map,
    of: new mongoose.Schema({
        scores: {type: [Number], required: true},
        referralCode: {type: String, required: false}
    })
})

const UserSchema = new mongoose.Schema({
    cookie_id: {type: mongoose.Types.ObjectId, required: true},
    wallet_id: {type: String, required: true},
    referral_code: {type: String, required: false},
    referred_users: {type: [UserReferral], required: false},
    user_ratings: {type: [UserRating], required: false}
});

const UserModel = mongoose.model<User>('user', UserSchema);
export default UserModel;
