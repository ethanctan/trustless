import mongoose from "mongoose";

beforeAll(async () => {
    // put your client connection code here, example with mongoose:
    console.log("mongo uri", process.env['MONGO_URI'])
    //@ts-ignore
    await mongoose.connect(process.env['MONGO_URI']);
  });
  
  afterAll(async () => {
    // put your client disconnection code here, example with mongodb:
    await mongoose.disconnect();
  });