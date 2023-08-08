import { getToken } from "../../utils/utils";
// import ReCAPTCHA from "react-google-recaptcha";

describe("Test get token", () => {
    it("Should return null when getting null data", async () => {
        expect(await getToken(null)).toBe(false)
    })


})