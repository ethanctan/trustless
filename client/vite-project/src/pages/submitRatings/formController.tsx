
import { getUserInfo, checkCookie } from '../../api/userApi.ts';
import {useState, useEffect} from 'react';
import Form from './form.tsx';
import { DefiData } from '../../utils/interfaces.ts'
import Axios from 'axios';
import FormHandler from './formHandler.ts';
import { addUser } from '../../api/userApi.ts';
import { emptyUserInfo } from '../../interfaces/user.ts';


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

    async function getUserDataSafe(walletAccount : string){
        try{
            let user = await getUserInfo(walletAccount)
            console.log("user", user)
            if (user.isFound == true){
                return user
            }
            await addUser(walletAccount)
            return user
        }catch(err){
            console.log("Error from getUserDataWrapped", err)
            return emptyUserInfo
        }
    }

  return (
    connectWallet ? 
    <Form 
        defiData={defiData}
        getUserData={getUserDataSafe}
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



