// import axios from "axios";
import { DefiData } from "../utils/interfaces";
import createAxiosInstance from "./axiosConfig";

const axiosInstance  = createAxiosInstance("defiData")
/** makes a get request to /defiData */
async function getDefiData(){
    let response = await axiosInstance.get<DefiData[]>('')
    return response.data
}

export default getDefiData