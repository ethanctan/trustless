/**
 * All routes under /ratings
 * @module Ratings
 */
import express, { Request, Response } from 'express';
import RatingController from '../controllers/ratingController';
import { Rating } from '../models/user/User';

const router = express.Router()
const ratingController = new RatingController()


/**
 * TODO: type checking for input queries
 * POST request to add a rating to a user's rating mapping
 * @function
 * @param {string} cookieId - cookieId of user
 * @param {string} walletId - walletId of user
 * @param {string} protocolName - protocol being added
 * @param {string} rating - user's rating of the protocol
 * @returns a message either indicating success or failure, including:
 * user not found - nonexistent user
 * rating already submitted - rating submitted
 * rating added - successful addition 
 */
router.post("/:cookieId/:walletId", async (req: Request, res: Response) => {
    
    const { cookieId, walletId} = req.params;
    const { protocolName, rating } = req.body;
    let ratingObject = Rating.fromObject(rating)
    let userIdentity = {"cookieId" : cookieId, "walletId" : walletId}
    try{
        let response = await ratingController.upsertRating(userIdentity, ratingObject, protocolName)
        res.json({message : response})
    }catch{
        res.json({message : "invalid request"})
    }
    
});

/**
 * Get request getting a user's specific rating
 * @function
 * @param {string} cookieId - cookieId of user
 * @param {string} walletId - walletId of user
 * @param {string} protocolName - protocol being requested
 * @returns Either a failure message of type string or a rating of form {scores, referral}
 */
router.get("/:cookieId/:walletId/:protocolName", async (req: Request, res: Response) => {
    const { protocolName, cookieId, walletId } = req.params;
    let response = await ratingController.handleGetRating(cookieId, walletId, protocolName)
    res.status(response.status).json(response.message)
});

/**
 * GET request to fetch all the protocol ratings for a given user
 * @function
 * @param {string} cookieId - cookieId of user
 * @param {string} walletId - walletId of user
 * @returns A map mapping strings to Ratings or an error message
 */
router.get('/:cookieId/:walletId', async (req, res) => {
    const { cookieId, walletId } = req.params;
    let response = await ratingController.handleGetAllRatings(cookieId, walletId)
    res.status(response.status).json(response.message)
});



export default router;

module.exports = router