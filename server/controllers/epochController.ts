import mongoose from "mongoose";
import EpochCountModel from "../models/EpochCount";
import { Document } from "mongodb";

export default class EpochCountController{
    async updateEpochCount(){
        let epochCount = await EpochCountModel.find({})
        let newEpochCount = epochCount[0].epochCount + 1
        await EpochCountModel.updateOne(
            {_id: epochCount[0]._id},
            {epochCount: newEpochCount}
        )
        return "Success in updating epoch count"
    }
}