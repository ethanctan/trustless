import  { MongoMemoryServer }  from 'mongodb-memory-server'
import mongoose from 'mongoose'

// Used this tutorial https://plainenglish.io/blog/unit-testing-node-js-mongoose-using-jest-106a39b8393d

const mongod = new MongoMemoryServer()

module.exports.connect = async () => {
    const uri = await mongod.getUri()
    await mongoose.connect(uri);
}

module.exports.closeDatabase = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
}

module.exports.clearDatabase = async() => {
    const collections = mongoose.connection.collections;
    for (const key in collections){
        const collection = collections[key];
        await collection.deleteMany();
    }
}