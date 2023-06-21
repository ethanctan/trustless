import mongoose, { Document } from 'mongoose';

interface IDispute extends Document {
    addressFrom: string;
    addressTo: string;
    txnHash: string;
    blockID: number;
}

const DisputeSchema = new mongoose.Schema({
    addressFrom: { type: String, required: true },
    addressTo: { type: String, required: true },
    txnHash: { type: String, required: true },
    blockID: { type: Number, required: true }
});

const DisputeModel = mongoose.model<IDispute>('disputes', DisputeSchema);
export default DisputeModel;
