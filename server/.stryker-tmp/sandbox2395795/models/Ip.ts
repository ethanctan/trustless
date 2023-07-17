// @ts-nocheck
import mongoose, { Document } from 'mongoose';
import internal from 'stream';

interface IIp extends Document {
    ipAddress: string;
    protocolName: string; //protocol user is interacting with
    interacted: [String]; //list of all protocols user has interacted with
    within: boolean; //whether or not the protocol is within the interacted list
}

const IpSchema = new mongoose.Schema({
    ipAddress: {type: String, required: true },
    protocolName: { type: String, required: true },
    interacted: {type: [String], default: []},
    within: {type: Boolean, default: false}
});

const IpModel = mongoose.model<IIp>('ips', IpSchema);
export default IpModel;