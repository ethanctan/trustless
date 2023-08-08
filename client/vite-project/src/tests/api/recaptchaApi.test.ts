import verifyToken from "../../api/recaptchaApi";


describe("Verify token should exist", () => {
    it("Should return false for nonexistent token", async () => {
        let response = await verifyToken("invalid")
        expect(response[0].success).toBe(false)
    })
})