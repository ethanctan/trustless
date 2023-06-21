import mongoose, { Document } from 'mongoose';

interface IUser extends Document {
    address: string;
}

const UserSchema = new mongoose.Schema({
    address: { type: String, required: true }
});

const UserModel = mongoose.model<IUser>('users', UserSchema);
export default UserModel;
