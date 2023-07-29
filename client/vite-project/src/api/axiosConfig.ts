import axios from "axios";

const baseUrl = "http://localhost:3001/"

function createAxiosInstance(route : string){
    const instance = axios.create({ baseURL: baseUrl + route })
    return instance
}


export default createAxiosInstance