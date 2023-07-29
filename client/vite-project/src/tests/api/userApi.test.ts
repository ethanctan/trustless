import {  checkCookie, getUserInfo, addUser } from "../../api/userApi";


describe("Check user cookie", () => {
    it("Should get user cookie", async () => {
        let response = await checkCookie("does_not_exist")
        expect(response).toBe(false)
    })
})

describe("Check getUserInfo", () => {
    it("Should get user info", async () => {
        let response = await getUserInfo("your_cookie_id")
        expect(response.walletId).toBe("your_wallet_id")
    })
})

describe("add user test", () => {
    it("Should not add existing user", async () => {
        let response = await addUser("your_cookie_id", "your_wallet_id")
        expect(response).toBe("correct user-wallet pair")
    })
})