import express, { Request, Response } from 'express';
import ReferralController from '../controllers/referralController';
const router = express.Router()
const referralController = new ReferralController()



/**
 * POST request to add a walletaddress:protocol pair to the user's referredUser mapping
 * Returns 404 error if a referral code does not exist
 * Returns 404 error if a user uses its own referral code
 */
router.post("/:referralCode", async (req: Request, res: Response) => {
    const { referralCode } = req.params;
    const { walletId } = req.body
    let response = await referralController.handleAddReferral(referralCode, walletId)
    res.json({message: response})
});

/**
 * GET request to check if a user with a specific referralCode exists
 * Returns true if there is a user with a valid code, false otherwise
 * @requires req.query to have {referralCode} in the json body
 */
router.get("/:referralCode", async (req: Request, res: Response) => {
    const { referralCode } = req.params;
    let response = await referralController.checkReferralCodeExists(referralCode)
    res.json({referralCodeExists: response})
});

export default router;

module.exports = router