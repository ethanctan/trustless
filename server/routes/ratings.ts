import express, { Request, Response } from 'express';
import UserController from '../controllers/userController';
import { Rating } from '../models/user/User';
import UserModel from '../models/user/UserModel';

const router = express.Router()
const userController = new UserController()



// Works
/**
 * POST request to add a rating to a user's rating mapping
 * Client-side interface: protocolName, rating -> splice to form kv pair
 * Why do we have two post requests for doing basically the exact same thing?
 */
router.post("/:cookieId/:walletId", async (req: Request, res: Response) => {
    const { cookieId, walletId} = req.params;
    const { protocolName, rating } = req.body;
    let ratingObject = Rating.fromObject(rating)
    let userIdentity = {"cookieId" : cookieId, "walletId" : walletId}
    let response = await userController.upsertRating(userIdentity, ratingObject, protocolName)
    res.json({message : response})
});


router.get("/:cookieId/:walletId/:protocolName", async (req: Request, res: Response) => {
    
    const { protocolName, cookieId, walletId } = req.params;
    let response = await userController.handleGetRating(cookieId, walletId, protocolName)
    // console.log("Response: ", response)
    res.status(response.status).json(response.message)
});

/**
 * GET request to fetch all the protocol ratings for a given user
 * @returns 404 if user not found
 */
router.get('/:cookieId/:walletId', async (req, res) => {
    const { cookieId, walletId } = req.params;
    let response = await userController.handleGetAllRatings(cookieId, walletId)
    res.status(response.status).json(response.message)
});



export default router;

module.exports = router