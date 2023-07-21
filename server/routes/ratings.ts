import express, { Request, Response } from 'express';
import RatingController from '../controllers/ratingController';
import { Rating } from '../models/user/User';

const router = express.Router()
const ratingController = new RatingController()


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
    let response = await ratingController.upsertRating(userIdentity, ratingObject, protocolName)
    res.json({message : response})
});


router.get("/:cookieId/:walletId/:protocolName", async (req: Request, res: Response) => {
    const { protocolName, cookieId, walletId } = req.params;
    let response = await ratingController.handleGetRating(cookieId, walletId, protocolName)
    res.status(response.status).json(response.message)
});

/**
 * GET request to fetch all the protocol ratings for a given user
 * @returns 404 if user not found
 */
router.get('/:cookieId/:walletId', async (req, res) => {
    const { cookieId, walletId } = req.params;
    let response = await ratingController.handleGetAllRatings(cookieId, walletId)
    res.status(response.status).json(response.message)
});



export default router;

module.exports = router