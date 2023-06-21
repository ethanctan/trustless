import mongoose, { Document } from 'mongoose';

interface IProtocol extends Document {
    protocolAddress: string;
    disputeCount: number;
    protocolName?: string;
}

const ProtocolSchema = new mongoose.Schema({
    protocolAddress: { type: String, required: true },
    disputeCount: { type: Number, required: true },
    protocolName: { type: String, required: false }
});

const ProtocolModel = mongoose.model<IProtocol>('protocols', ProtocolSchema);
export default ProtocolModel;
