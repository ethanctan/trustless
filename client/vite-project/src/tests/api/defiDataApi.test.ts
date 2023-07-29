import getDefiData from "../../api/defiDataApi"



describe("Test get request to defiData", () => {
    it("Should work", async () => {
        let response = await getDefiData()
        expect(response[0]["name"].length).toBeGreaterThan(0)
    })
})