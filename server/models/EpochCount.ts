import mongoose, {Document} from "mongoose";

interface EpochCount extends Document {
    epochCount: number;
}

const EpochCountSchema = new mongoose.Schema({
    epochCount: {type: Number, required: true}
});

const EpochCountModel = mongoose.model<EpochCount>("epoch", EpochCountSchema);
export default EpochCountModel;
