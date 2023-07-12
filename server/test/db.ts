// utils/test-utils/dbHandler.utils.js

//https://dev.to/remrkabledev/testing-with-mongodb-memory-server-4ja2#create-a-model
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
let con: MongoClient;
let mongoServer: MongoMemoryServer;

export async function connect() {
    mongoServer = await MongoMemoryServer.create();
    con = await MongoClient.connect(mongoServer.getUri(), {});
    await mongoose.connect(mongoServer.getUri())
}

export async function disconnect() {
    if (con) {
        await con.close();
      }
    if (mongoServer) {
    await mongoServer.stop();
    }
    await mongoose.disconnect()
}


// const mongoServer = new MongoMemoryServer();

// exports.dbConnect = async () => {
//   const uri = await mongoServer.getUri();

//   const mongooseOpts = {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false,
//   };

//   await mongoose.connect(uri, mongooseOpts);
// };

// exports.dbDisconnect = async () => {
//   await mongoose.connection.dropDatabase();
//   await mongoose.connection.close();
//   await mongoServer.stop();
// };

// import  { MongoMemoryServer }  from 'mongodb-memory-server'
// import mongoose from 'mongoose'

// // Used this tutorial https://plainenglish.io/blog/unit-testing-node-js-mongoose-using-jest-106a39b8393d

// const mongod = new MongoMemoryServer()

// module.exports.connect = async () => {
//     const uri = await mongod.getUri()
//     await mongoose.connect(uri);
// }

// module.exports.closeDatabase = async () => {
//     await mongoose.connection.dropDatabase();
//     await mongoose.connection.close();
//     await mongod.stop();
// }

// module.exports.clearDatabase = async() => {
//     const collections = mongoose.connection.collections;
//     for (const key in collections){
//         const collection = collections[key];
//         await collection.deleteMany();
//     }
// }