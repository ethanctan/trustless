import express, { Request, Response } from 'express';
import ReferralController from '../controllers/referralController';
const router = express.Router()
const referralController = new ReferralController()



/**
 * POST request to increase number of referred users. Users cannot refer themselves
 * @param {string} referralCode - referral code used to identify referrer
 * @param {string} walletId - wallet id of the referee
 * @returns {string} success or error message. See referralController for exact messages
 */
router.post("/:referralCode", async (req: Request, res: Response) => {
    const { referralCode } = req.params;
    const { walletId } = req.body
    let response = await referralController.handleAddReferral(referralCode, walletId)
    res.json({message: response})
});

/**
 * GET request to check if a user with a specific referralCode exists
 * @param referralCode referral code in question
 * @returns true or false depending if referral code exists or not
 */
router.get("/:referralCode", async (req: Request, res: Response) => {
    const { referralCode } = req.params;
    let response = await referralController.checkReferralCodeExists(referralCode)
    res.json({referralCodeExists: response})
});

export default router;

module.exports = router