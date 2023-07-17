// @ts-nocheck
import mongoose, { Document } from 'mongoose';
import internal from 'stream';

interface IDispute extends Document {
    protocol: string;
    influencer: string;
    qVals: [Number]; //list of len 5 where each index corresponds to a question
}

const DisputeSchema = new mongoose.Schema({
    protocol: {type: String, required: true },
    influencer: {type: String, required: false },
    qVals: {type: [Number], required: true}
});

const DisputeModel = mongoose.model<IDispute>('disputes', DisputeSchema);
export default DisputeModel;
