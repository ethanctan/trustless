import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let con: MongoClient;
let mongoServer: MongoMemoryServer;

async function setup(){
    
    mongoServer = await MongoMemoryServer.create();
    con = await MongoClient.connect(mongoServer.getUri(), {});
    await mongoose.connect(mongoServer.getUri());
}

async function teardown(){
    if (mongoServer) {
        const collections = await mongoose.connection.db.collections();
        for (let collection of collections) {
          await collection.drop()
        }
      }
}

async function close(){
    if (con) {
        await con.close();
      }
      if (mongoServer) {
        await mongoServer.stop();
      }
      await mongoose.disconnect()
}

export {setup, teardown, close}