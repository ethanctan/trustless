import { postRating, getRating } from "../../api/ratingApi";


describe("Test postRating", () => {
    it("Should return no user found", async () => {

        let response = await postRating(
            {cookieId: "your_cookie_id", walletId: "your_wallet_id"}, 
            {protocol : "something", scores: [1,2,3,4,5], code : "hi"}
            )
        expect(response).toBe("invalid request")
    })
})


describe("Test get rating", () => {
    it("Should return retrieved rating", async () => {
        let response = await getRating(
            {cookieId: "deez", walletId: "nuts"},
            "uniswap"
        )
        expect(response.code).toBe("someCode")
        
    })
})