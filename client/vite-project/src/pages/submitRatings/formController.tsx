import { v1 as generateUuidv1 } from 'uuid';
import Cookies from 'js-cookie';
import { addUser, addRating, checkUser, updateRating, getUserInfo, checkCookie, getProtocolRatings, addReferral} from '../../utils/utils.ts';


function getUserCookie(){
    let cookieAddr = Cookies.get("user_id")
    if (cookieAddr === undefined){
        cookieAddr = generateUuidv1()
        Cookies.set('user_id', cookieAddr)
    }
    return cookieAddr
}

//What error should I throw here
// Why are we only getting info from address?
async function getUser(cookieAddr : string){
    const exists = await checkCookie(cookieAddr)
    if (exists){
        const response = await getUserInfo(cookieAddr)
        return response
    }
    // throw ("User not found")
    return null
}

