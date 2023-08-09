import mongoose, { Document } from 'mongoose';

interface IRating extends Document {
    scores: [number],
    code: string
}

interface UserReferral extends Document {
    protocol: string;
}

interface IUser extends Document {
    cookieId: string;
    walletId: string;
    referralCode: string; 
    referredUsers: number;
    protocolRatings: Map<string, IRating>;//map between protocol and rating
}

const RatingSchema = new mongoose.Schema({
    scores: {type: [Number], required: true},
    code: {type: String, required: false}
});

const ReferralSchema = new mongoose.Schema({
    protocol: { type: String, required: true }
});

const UserSchema = new mongoose.Schema({
    cookieId: {type: String, required: false},
    walletId: {type: String, required: true},
    referralCode: {type: String, required: false},
    referredUsers: {type: Number, required: true},
    protocolRatings: {type: Map, of: RatingSchema, required: false}
});





const UserModel = mongoose.model<IUser>('user', UserSchema);
const RatingModel = mongoose.model<IRating>('rating', RatingSchema);
const ReferralModel = mongoose.model<UserReferral>('referral', ReferralSchema);

export default UserModel;
export { RatingModel, ReferralModel, IRating, IUser };