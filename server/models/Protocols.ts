import mongoose, { Document } from 'mongoose';

interface IProtocol extends Document {
    disputeCount: number;
    protocolName?: string;
    averageScore: number;
    qScores: [Number]; //list of len 5 where each index corresponds to a question
}

const ProtocolSchema = new mongoose.Schema({
    protocolName: { type: String, required: true },
    disputeCount: { type: Number, required: true },
    averageScore: { type: Number, required: true},
    qScores: {type: [Number], required: true}
});

const ProtocolModel = mongoose.model<IProtocol>('protocols', ProtocolSchema);
export default ProtocolModel;
