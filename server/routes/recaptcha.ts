

import express, { Request, Response } from 'express';
import axios from 'axios'


const router = express.Router()

router.post("/", async (req : Request, res : Response) => {
    ////Destructuring response token and input field value from request body
  const { token, inputVal } = req.body;
  const key = "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe"
  try {
    // Sending secret key and response token to Google Recaptcha API for authentication.
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${key}&response=${token}`
    );
    console.log("Response")

    // Check response status and send back to the client-side
    if (response.data.success) {
      res.json({verified : true});
    } else {
      res.send({verified : false});
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error verifying reCAPTCHA");
   }

})

export default router
module.exports = router