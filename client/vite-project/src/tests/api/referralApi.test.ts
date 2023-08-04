import { addReferral, checkReferralCodeExists } from "../../api/referralApi";


describe("Test checkReferralCodeExists", () => {
    it("Should return false", async () => {
        let response = await checkReferralCodeExists("does not exist")
        expect(response).toBe(false)
    })
})

describe("Test add referral", () => {
    it("Should return referee not found", async () => {
        let response = await addReferral("uwu", "", {protocol: ""})
        expect(response).toBe("referee not found")
    })
})