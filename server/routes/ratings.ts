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
 * @param {string} cookieId - cookieId of user <------- EDIT: removed
 * @param {string} walletId - walletId of user
 * @param {string} protocolName - protocol being added
 * @param {string} rating - user's rating of the protocol
 * @returns a message either indicating success or failure, including:
 * user not found - nonexistent user
 * rating already submitted - rating submitted
 * rating added - successful addition 
 */
router.post("/:walletId", async (req: Request, res: Response) => {
    
    const { walletId} = req.params;
    const { protocolName, rating } = req.body;
    let ratingObject = Rating.fromObject(rating)
    let userIdentity = {"walletId" : walletId}
    try{
        let response = await ratingController.upsertRating(userIdentity, ratingObject, protocolName)
        res.json({message : response})
    }catch(error){
        res.json({message : "invalid request"})
    }
    
});

/**
 * Get request getting a user's specific rating
 * @function
 * @param {string} cookieId - cookieId of user <------- EDIT: removed
 * @param {string} walletId - walletId of user
 * @param {string} protocolName - protocol being requested
 * @returns Either a failure message of type string or a rating of form {scores, referral}
 */
router.get("/:walletId/:protocolName", async (req: Request, res: Response) => {
    const { protocolName, walletId } = req.params;
    let response = await ratingController.handleGetRating(walletId, protocolName)
    res.status(response.status).json(response.message)
});

/**
 * GET request to fetch all the protocol ratings for a given user
 * @function
 * @param {string} cookieId - cookieId of user <------- EDIT: removed
 * @param {string} walletId - walletId of user
 * @returns A map mapping strings to Ratings or an error message
 */
router.get('/:walletId', async (req, res) => {
    const { walletId } = req.params;
    let response = await ratingController.handleGetAllRatings(walletId)
    res.status(response.status).json(response.message)
});



export default router;

module.exports = router