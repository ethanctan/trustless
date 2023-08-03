// import axios from "axios";
import { EpochCount } from "../utils/interfaces";
import createAxiosInstance from "./axiosConfig";

const axiosInstance  = createAxiosInstance("epochCount")
/** makes a get request to /epochCount */
async function getEpochCount(){
    let response = await axiosInstance.get<EpochCount[]>('')
    return response.data
}

export default getEpochCount