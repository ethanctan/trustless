import express, { Request, Response } from 'express';
import UserModel from '../models/Users';

const router = express.Router()

/**
 * Get a list of users
 */
router.get("/", async(req: Request, res: Response) => {
    try{
        const users = await UserModel.find({})
        res.json(users)
    }catch(err){
        res.json(err);
    }
});

/**
 * Add user to database
 */
router.post("/", async (req: Request, res: Response) => {

    let userExists = await UserModel.exists({address: req.body.address})
    if (userExists){
        res.status(409).json({message: "Address already exists"})
        return
    }

    const user = req.body;
    const newUser = new UserModel(user);
    await newUser.save();
    res.json(user);
});

module.exports = router