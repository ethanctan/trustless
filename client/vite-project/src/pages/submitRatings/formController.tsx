import { v1 as generateUuidv1 } from 'uuid';
import Cookies from 'js-cookie';
import { getUserInfo, checkCookie } from '../../api/userApi.ts';
import {useState, useEffect} from 'react';
import Form from './form.tsx';
import { DefiData } from '../../utils/interfaces.ts'
import Axios from 'axios';
import FormHandler from './formHandler.ts';


interface UserWalletAccount {
    account : string | undefined
}


function FormController({account} : UserWalletAccount){

    const [defiData, setDefiData] = useState<DefiData[]>([]);
    const formHandler = new FormHandler()

    useEffect(() => {
        Axios.get<DefiData[]>('http://localhost:3001/defiData').then((response) => {
      setDefiData(response.data);
    });
    }, [])

    function getUserCookie(){
        let cookieAddress = Cookies.get("user_id")
        if (cookieAddress === undefined){
            cookieAddress = generateUuidv1()
        }
        return cookieAddress
    }
    //What error should I throw here
    // Why are we only getting info from address?
    async function getUser(cookieAddr : string){
        const exists = await checkCookie(cookieAddr)
        if (exists){
            const response = await getUserInfo(cookieAddr)
            return response
        }
        return null
    }

    async function getUserData(){
        let cookieAddress = getUserCookie()
        Cookies.set('user_id', cookieAddress)
        let user = await getUser(cookieAddress)
        return [cookieAddress, user]
    }

  return (
    <Form 
        defiData={defiData}
        getUserData={getUserData}
        account={account}
    />
  )
}

export default FormController



