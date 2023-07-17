// @ts-nocheck
import mongoose, { Document } from 'mongoose';
import internal from 'stream';

interface DefiData extends Document {
    protocolName: string; //protocol name
    logo: String; //logo of protocol
}

const DefiDataSchema = new mongoose.Schema({
    protocolName: { type: String, required: true },
    logo: { type: String, required: true }
});

const DefiDataModel = mongoose.model<DefiData>('data', DefiDataSchema);
export default DefiDataModel;