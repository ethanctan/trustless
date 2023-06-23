import mongoose, { Document } from 'mongoose';

interface IProtocol extends Document {
    disputeCount: number;
    protocolName?: string;
    averageScore: number;
    q1Score: number;
    q2Score: number;
    q3Score: number;
    q4Score: number;
    q5Score: number;
}

const ProtocolSchema = new mongoose.Schema({
    protocolName: { type: String, required: true },
    disputeCount: { type: Number, required: true },
    averageScore: { type: Number, required: true},
    q1Score: { type: Number, required: true},
    q2Score: { type: Number, required: true},
    q3Score: { type: Number, required: true},
    q4Score: { type: Number, required: true},
    q5Score: { type: Number, required: true}
});

const ProtocolModel = mongoose.model<IProtocol>('protocols', ProtocolSchema);
export default ProtocolModel;
