import mongoose, { Document } from 'mongoose';
import internal from 'stream';

interface IData extends Document {
    protocolName: string; //protocol name
    logo: String; //logo of protocol
}

const DataSchema = new mongoose.Schema({
    protocolName: { type: String, required: true },
    logo: { type: String, required: true }
});

const DataModel = mongoose.model<IData>('data', DataSchema);
export default DataModel;