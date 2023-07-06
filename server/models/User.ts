import mongoose, { Document } from 'mongoose';

interface Rating extends Document {
    scores: [number],
    code: string
}

interface UserReferral extends Document {
    protocol: string;
}

interface User extends Document {
    cookieId: string;
    walletId: string;
    referralCode: string;
    referredUsers: Map<string, UserReferral>;
    protocolRatings: Map<string, Rating>;
}

const RatingSchema = new mongoose.Schema({
    scores: {type: [Number], required: true},
    code: {type: String, required: false}
});

const ReferralSchema = new mongoose.Schema({
    protocol: { type: String, required: true }
});

const UserSchema = new mongoose.Schema({
    cookieId: {type: String, required: true},
    walletId: {type: String, required: true},
    referralCode: {type: String, required: false},
    referredUsers: {type: Map, of: ReferralSchema, required: false},
    protocolRatings: {type: Map, of: RatingSchema, required: false}
});

const UserModel = mongoose.model<User>('user', UserSchema);
const RatingModel = mongoose.model<Rating>('rating', RatingSchema);
const ReferralModel = mongoose.model<UserReferral>('referral', ReferralSchema);

export default UserModel;
export { RatingModel, ReferralModel };