import {useState, useEffect} from 'react';
import '@fontsource-variable/unbounded';
import '@fontsource/poppins';

import { TextField } from '@mui/material';
import { Rating, ProtocolRatings, UserIdentity} from '../../utils/interfaces.ts'
import { addUser } from '../../utils/utils.ts'

import { Question } from '../../components/question.tsx'
import SearchBar from '../../components/searchBar.tsx';
import { textFieldDesc } from './formConsts.ts';
import { SubmissionTable } from '../../components/submissionTable.tsx';
//@ts-ignore
import reCAPTCHA from "react-recaptcha-google"
import ReCAPTCHA from 'react-google-recaptcha';


//@ts-ignore
function Form({defiData, getUserData, updateProtocol, handleUserSubmission, account}){
    
    const [q1Score, setQ1Score] = useState<number>(1);
    const [q2Score, setQ2Score] = useState<number>(1);
    const [q3Score, setQ3Score] = useState<number>(1);
    const [q4Score, setQ4Score] = useState<number>(1);
    const [q5Score, setQ5Score] = useState<number>(1);
    const [influencer, setInfluencer] = useState<string>(""); //other people's code

    const [address, setAddress] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [protocol, setProtocol] = useState<string>("");
    const [text1, setText1] = useState<string>(""); // tooltips
    const [text2, setText2] = useState<string>("");
    const [text3, setText3] = useState<string>("");
    const [text4, setText4] = useState<string>("");
    const [text5, setText5] = useState<string>("");
    const [user_id, set_uid] = useState<string>("");
    const [referralCode, setReferralCode] = useState<string>("");//self-code
    const [protocolRatings, setProtocolRatings] = useState<ProtocolRatings>({});
    const [connectWallet, setConnectWallet] = useState<boolean>(false);
    
    // for generating form content
  const handleSetProtocol = (protocol: string) => {
    setProtocol(protocol);
    setText1("How secure do you believe " + protocol + "'s smart contracts are? Have they been audited and open-sourced? Or have they been exploited before?");
    setText2("How robust, transparent, and community-oriented is " + protocol + "'s treasury? Does it mostly comprise of the protocol's native token, creating concentrated risk? Or does it have a diverse range of assets? Is value regularly distributed to the community?");
    setText3("How confident are you in " + protocol + "'s ability to deliver on their roadmap? Have they delivered in the past? Do their goals seem feasible, or are they overpromising?");
    setText4("How robust is " + protocol + "'s governance system? If decentralized, is there strong voter participation, or is voting controlled by a few whales? If centralized, is there a clear and transparent decision-making process?");
    setText5("How strong is the track record of " + protocol + "'s team? If they're doxxed, do they have strong credentials and experience? If undoxxed, do they have a good reputation and history?");
  }


  async function getUserDataWrapped(){
    try{
      let [cookieAddress, user] = await getUserData()
      set_uid(cookieAddress)
      if (user){
        setReferralCode(user.referralCode)
        setAddress(user.walletId)
        setProtocolRatings(user.protocolRatings)
      }
    }catch(err){
      console.log("Error from getUserDataWrapped", err)
    }
  }

  useEffect(() => {
    if (account){
      setAddress(account);
      addUser(user_id, account);
      setConnectWallet(true);
    }
  }, [account]);

  // sets cookieid for user, and sets referral code, wallet address and protocolratings if user exists
  useEffect(() =>{
    getUserDataWrapped();
  }, [])

  // Reset the errorMessage each time the protocol changes
  useEffect(() => {
      setErrorMessage(null);
    }, [protocol]);


  async function handleUserSubmissionWrapped(){
    try{
      let scores = [q1Score, q2Score, q3Score, q4Score, q5Score];
      let newRating: Rating = {
        protocol: protocol,
        scores: scores,
        code: influencer,
      };
      let user: UserIdentity = {cookieId: user_id, walletId: String(address) }
      let [rating_msg, ratings] = await handleUserSubmission(user, newRating)
      console.log("Ratings: ", ratings)
      setProtocolRatings(ratings);
      setErrorMessage(rating_msg)
    }catch(err : any){
      setErrorMessage(err["message"])
    }
  }
  
  // async function connectWrapped(){ // TODO: EDIT THIS
  //   try{
  //     let walletAccount = await connectMetamask(user_id) // this will be the passed variable instead
  //     setConnectWallet(true)
  //     if (walletAccount){
  //       console.log("WalletAccount", walletAccount)
  //       setAddress(walletAccount)
  //     }
  //   }catch(error){
  //     console.log("erorr")
  //   }
  // }

  async function updateProtocolWrapped(){
    try{
      let scores = [q1Score, q2Score, q3Score, q4Score, q5Score]
      let newRating: Rating = {
        protocol: protocol,
        scores: scores,
        code: influencer,
      }
      let user: UserIdentity = {cookieId: user_id, walletId: String(address) }
      let response = updateProtocol(user, newRating)
      setProtocolRatings(response)
    }catch(error : any){
      // set error message here. Make sure you're only doing it for a specific subset in formController
      setErrorMessage(error["message"])
    }
  }

  function listUserRatings(key : any){
    const {scores} = protocolRatings[key];
    return (
        <tr key={key} className="py-2">
            <td>{key}</td>
            <td>{scores[0]}</td>
            <td>{scores[1]}</td>
            <td>{scores[2]}</td>
            <td>{scores[3]}</td>
            <td>{scores[4]}</td>
        </tr>
    );
  }

    return (
      <div className="flex flex-col justify-center"> 
        <div className="flex flex-col justify-items-stretch poppins">
          {!connectWallet ?  
            <div className="bg-red-500/50 rounded-2xl backdrop-filter backdrop-blur-md p-7 poppins mx-auto text-xl mt-6">
              Connect your wallet first!
            </div>
          : null}
            {connectWallet ? <SearchBar protocol={protocol} defiData={defiData} handleSetProtocol={handleSetProtocol} /> : null}

            { protocol && (

            <div className="bg-gray-900 backdrop-blur-md bg-opacity-50 p-4 rounded-lg mb-4 mx-auto max-w-xl">
            <div className="m-4"> 
                <p className="mb-2"> Our framework for trust consists of 5 factors, rated on a scale of 1-10, with 1 being the least trustworthy and 10 being the most. </p>
                <p className="mb-2"> Rate {protocol}'s trustworthiness in these 5 areas. </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-8 gap-4 py-4">
                <Question questionScore={q1Score} setScore={setQ1Score} 
                text={text1} title="Contracts"/>
                <Question questionScore={q2Score} setScore={setQ2Score} 
                text={text2} title="Treasury"/>
                <Question questionScore={q3Score} setScore={setQ3Score} 
                text={text3} title="Roadmap"/>
                <Question questionScore={q4Score} setScore={setQ4Score} 
                text={text4} title="Governance"/>
                <Question questionScore={q5Score} setScore={setQ5Score} 
                text={text5} title="Team"/>
                
                <div className="md:col-span-4 flex items-start justify-start text-left pl-6">
                    Enter a twitter influencer code. 🐦
                </div>
                <div className="md:col-span-4 pr-5">
                    <TextField 
                    className="poppins"
                    id="outlined-basic" 
                    sx={textFieldDesc}
                    placeholder="@twitterhandle" 
                    label="Twitter Code..." 
                    variant="outlined" 
                    onChange={(event) => setInfluencer(event.target.value)}
                    color="primary"
                    />
                </div>
            </div>
            <div className="flex flex-grow items-center justify-center my-4">
              <ReCAPTCHA sitekey={"6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}/>
            </div>

          {connectWallet ? 
            <button 
              className='mb-3 mt-3 bg-blue-700 hover:bg-blue-600 hover:border-white focus:outline-none py-2 px-4 rounded-lg cursor-pointer' 
              onClick={handleUserSubmissionWrapped}
            >
              Submit
            </button> 
          : null}
          {/* to be updated */}
          {errorMessage == 'Successfully added!'? 
            <div 
              className='mb-3 mt-3 bg-blue-500 hover:bg-blue-400 hover:border-white focus:outline-none cursor-pointer'
              onClick={() => {
                window.open(`https://twitter.com/intent/tweet?text=I%20just%20rated%20${protocol}%20with%20scores%20of%20${[q1Score, q2Score, q3Score, q4Score, q5Score].join(', ')}%20on%20TRUST%20and%20earned%20a%20$TRUST%20airdrop.%20Check%20it%20out%20at%20http://localhost:5173&via=YourTwitterHandle`);
              }}
            >
              Share on Twitter
            </div>
          : null}

            <h5 style={ errorMessage == 'Successfully added!' ? { color: 'white' } : {color: 'red' }}>{errorMessage}</h5>
            </div>
        )}
    </div>

      {connectWallet ? 
      <>
        <h3 className="unbounded text-2xl my-5 font-light">
          Your ratings:
        </h3>
        <div className="mx-auto">
          <SubmissionTable 
          headings={["Protocol Name", "Contracts", "Treasury", "Roadmap", "Governance", "Team"]}
          submissions={Object.keys(protocolRatings)}
          RowGenerator={listUserRatings}
          /> 
        </div>
      </>
      : null}
  </div>
  )
}

export default Form;