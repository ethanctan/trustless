import ThirdWebAuth from "../../components/thirdwebAuth"


let thirdWebAuth = new ThirdWebAuth("")

describe("Test initialization", () => {
    it("Should create two objects", () => {
        expect(thirdWebAuth.address).toBe("")
    })
})