import mongoose, { Document } from 'mongoose';
import internal from 'stream';

interface IDispute extends Document {
    protocol: string;
    question1: number;
    question2: number;
    question3: number;
    question4: number;
    question5: number;
}

const DisputeSchema = new mongoose.Schema({
    protocol: {type: String, required: true },
    question1: {type: Number, required: true },
    question2: {type: Number, required: true },
    question3: {type: Number, required: true },
    question4: {type: Number, required: true },
    question5: {type: Number, required: true }
});

const DisputeModel = mongoose.model<IDispute>('disputes', DisputeSchema);
export default DisputeModel;
