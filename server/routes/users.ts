import express, { Request, Response } from 'express';
import UserModel from '../models/Users';

const router = express.Router()

/**
 * Get a list of users
 */
router.get("/", (req: Request, res: Response) => {
    UserModel.find({})
    .then(result => {
        res.json(result);
    })
    .catch(err => {
        res.json(err);
    });
});

/**
 * Add user to mongodb
 */
router.post("/", async (req: Request, res: Response) => {
    const user = req.body;
    const newUser = new UserModel(user);
    await newUser.save();
    res.json(user);
});

module.exports = router