
import { getUserInfo, checkCookie } from '../../api/userApi.ts';
import {useState, useEffect} from 'react';
import Form from './form.tsx';
import { DefiData } from '../../utils/interfaces.ts'
import Axios from 'axios';
import FormHandler from './formHandler.ts';
import { addUser } from '../../api/userApi.ts';


interface UserWalletAccount {
    account : string | undefined
}


function FormController({account} : UserWalletAccount){

    const [defiData, setDefiData] = useState<DefiData[]>([]);
    const [connectWallet, setConnectWallet] = useState<boolean>(false);
    const formHandler = new FormHandler()

    useEffect(() => {
        if(account){
            setConnectWallet(true);
            addUser(account)
        }
    }, [account])

    useEffect(() => {
        Axios.get<DefiData[]>('http://localhost:3001/defiData').then((response) => {
      setDefiData(response.data);
    });
    }, [])

    async function getUserData(){
        let user = null
        if (account){
            user = await getUserInfo(account)
            if (user.isFound == false){
                return null
            }
        }
        return user
    }

  return (
    connectWallet ? 
    <Form 
        defiData={defiData}
        getUserData={getUserData}
        walletAccount={account}
    /> : <ConnectWallet/>
  )
}

function ConnectWallet(){
    return (<div className="poppins mx-auto text-lg mt-5 text-red-500">
    Connect your wallet first!
  </div>)
}


export default FormController



