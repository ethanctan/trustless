import createAxiosInstance from "./axiosConfig";

const axiosInstance = createAxiosInstance("recaptcha")
const key = "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe"

async function verifyToken(token : string){
    try{
        let response = await axiosInstance.post('/',{key, token});
        console.log("Response", response.data)
        return response.data;
    }catch(error){
        console.log("error ",error);
    }
}
export default verifyToken