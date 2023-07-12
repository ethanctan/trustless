import ProtocolModel from "../models/Protocols";
import { Document } from "mongodb";
import mongoose from "mongoose";


enum Order{
    Ascending = 1,
    Descending = -1
} 
export default class ProtocolController{
    database: any;

    
    constructor(database : mongoose.Model<any>) {
        this.database = database
    }

    async getProtocolsFromDatabase(order : number) {
        let test = await this.database.find({}).sort({averageScore : order})
        return test
    }

    /** Retrieves protocol data and returns it as a list of 
     * json in the form protocolName, disputeCount, averageScore*/
    async getProtocolJson(req : any){
        let order = this.getOrder(req.query)
        let databaseProtocols = await this.getProtocolsFromDatabase(order)
        let databaseProtocolsJson = this.formatProtocolData(databaseProtocols)
        return databaseProtocolsJson
    }

    private formatProtocolData(data : any){
        let value = data.map((result : any) => ({
            protocolName: result["protocolName"],
            disputeCount: result["disputeCount"],
            averageScore: result["averageScore"]
        }))
        return value
    }

    private getOrder(query : any){
        let order = Order.Descending
        if (query && query.order == 'ascending'){
            order = Order.Ascending
        }
        return order
    }


    updateAvg (docScores : number[], protocolScores : number[], 
        numDisputes : number) : [number[], number] {
        var newQScores = [0, 0, 0, 0, 0]
        // element-wise sum on old q scores and incoming scores
        newQScores =  protocolScores.map(function (num : number, idx : number) {
            return num + docScores[idx];
        })
        // use updated q scores to recompute average
        let newAvg = (newQScores.reduce(
            (partialSum : number, a: number) => 
            partialSum + a, 0))/((numDisputes+1)*5)
    
        return [newQScores, newAvg]
    }

    updateDoc (doc : any, protocol : object) {
        let [newQScores, newAvg] = this.updateAvg(
            doc["qScores"], protocol["qScores"], doc["disputeCount"]
        )
    
        doc["disputeCount"] += 1
        doc["protocolName"] = protocol["protocolName"]
        doc["averageScore"] = newAvg
        doc["qScores"] = newQScores
        return doc
    }
}