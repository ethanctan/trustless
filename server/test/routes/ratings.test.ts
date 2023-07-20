/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import UserModel from '../../models/user/UserModel';
import UserController from '../../controllers/userController';
import User, { Rating } from '../../models/user/User';
const express = require('express');
const bodyParser = require('body-parser');
const request = require('supertest');
import { testUserObject } from '../testUtils';
let userRouter = require('../../routes/user');


const app = express();
app.use(bodyParser.json()); // This line adds body parser middleware
app.use('/', userRouter);
let basicTestUserObject = testUserObject
const timeoutLimit = 10000
jest.setTimeout(timeoutLimit)


let con: MongoClient;
let mongoServer: MongoMemoryServer;
let userController = new UserController();
let basicTestUser = User.createUserFromObject(basicTestUserObject)

let basicProtocolRating = {protocolName : "ant", rating : 
                {scores : [1,2,3,4,5], referral : "venom"}}


async function initializeDatabase(){
  userController = new UserController();
  basicTestUser = User.createUserFromObject(basicTestUserObject)
  await addUserToDatabase(basicTestUser)
}

async function addUserToDatabase(user : User){
  let userModel = new UserModel(user.getUserObject())
  await userModel.save()
 } 


beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  con = await MongoClient.connect(mongoServer.getUri(), {});
  await mongoose.connect(mongoServer.getUri());
  await initializeDatabase()
  
});

afterEach(async () => {
  if (mongoServer) {
      const collections = await mongoose.connection.db.collections();
      for (let collection of collections) {
        await collection.drop()
      }
    }
    await initializeDatabase()
})

afterAll(async () => {
  if (con) {
    await con.close();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
  await mongoose.disconnect()
});


describe("Add rating tests", () => {
    const baseUrl = "/addRating/"
    it("Should say user not found", async () => {
        let url = baseUrl + "hello/world"
        let response = await request(app).post(url).send(basicProtocolRating)
        expect(response.body.message).toBe("user not found")
    })

    it("Should say protocol added successfully", async () => {
        let url = baseUrl + "uwu/owo"
        let response = await request(app).post(url).send(basicProtocolRating)
        expect(response.body.message).toBe("rating added")
    })
})
