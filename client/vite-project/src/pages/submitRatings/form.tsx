import {useState, useEffect} from 'react';
import '@fontsource-variable/unbounded';
import '@fontsource/poppins';

import { TextField } from '@mui/material';
import { UserIdentity } from '../../interfaces/user.ts';
import { Rating, ProtocolRatings } from '../../interfaces/rating.ts';
import { addUser } from '../../api/userApi.ts';

import { Question } from '../../components/question.tsx'
import SearchBar from '../../components/searchBar.tsx';
import { textFieldDesc } from './formConsts.ts';
import { SubmissionTable } from '../../components/submissionTable.tsx';
//@ts-ignore
import reCAPTCHA from "react-recaptcha-google"
import ReCAPTCHA from 'react-google-recaptcha';
import FormHandler from './formHandler.ts';
import React from 'react';
import { getToken } from '../../utils/utils.ts';


//@ts-ignore
function Form({defiData, getUserData, account}){
    
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
    const [valid_token, setValidToken] = useState([]);

    let formHandler = new FormHandler()
    const recaptchaRef = React.useRef<ReCAPTCHA>(null);

    
    // for generating form content
  const handleSetProtocol = (protocol: string) => {
    setProtocol(protocol);
    setText1("How secure do you believe " + protocol + "'s smart contracts are? Have they been audited and open-sourced? Or have they been exploited before?");
    setText2("How robust, transparent, and community-oriented is " + protocol + "'s treasury? Does it mostly comprise of the protocol's native token, creating concentrated risk? Or does it have a diverse range of assets? Is value regularly distributed to the community?");
    setText3("How confident are you in " + protocol + "'s ability to deliver on their roadmap? Have they delivered in the past? Do their goals seem feasible, or are they overpromising?");
    setText4("How robust is " + protocol + "'s governance system? If decentralized, is there strong voter participation, or is voting controlled by a few whales? If centralized, is there a clear and transparent decision-making process?");
    setText5("How strong is the track record of " + protocol + "'s team? If they're doxxed, do they have strong credentials and experience? If undoxxed, do they have a good reputation and history?");
  }


  // TODO: Refactor
  async function getUserDataWrapped(){
    try{
      let [cookieAddress, user] = await getUserData()
      set_uid(cookieAddress)
      if (user){
        setReferralCode(user.referralCode)
        setAddress(user.walletId)
        setProtocolRatings(user.protocolRatings)
        console.log("Your referral", user.referralCode)
      }else{
        addUser(cookieAddress,  String(address))
        let [_, user] = await getUserData()
        setReferralCode(user.referralCode)
        setAddress(user.walletId)
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
  useEffect(() =>{getUserDataWrapped();}, [])

  // Reset the errorMessage each time the protocol changes
  useEffect(() => {setErrorMessage(null);}, [protocol]);


  async function handleUserSubmissionWrapped(){
    let validToken = await getToken(recaptchaRef.current)
    if (!validToken){
      setErrorMessage("Verify you are not a bot")
      return
    }
    
    let scores = [q1Score, q2Score, q3Score, q4Score, q5Score];
    let newRating: Rating = {protocol: protocol, scores: scores, code: influencer};
    let user: UserIdentity = {cookieId: user_id, walletId: String(address) }


    try{
      let submissionResponse = await formHandler.handleUserSubmission(user, newRating)
      console.log("Ratings: ", submissionResponse)
      if (submissionResponse.status == "success"){
        setProtocolRatings(submissionResponse.data.protocolRatings);
      }
      else{
        setErrorMessage(submissionResponse.error)
      }  
      
    }catch(err : any){
      setErrorMessage(err["message"])
    }
  }


  function listUserRatings(key : any){
    const {scores} = protocolRatings[key];
    return (
        <tr key={key} 
          className="bg-slate-900 bg-opacity-70 backdrop-filter backdrop-blur-md"
          style={{ marginBottom: '10px', height: '50px' }}
        >
            <td className="p-6 py-4 whitespace-nowrap text-sm text-white font-mono">{key}</td>
            <td className="p-6 py-4 whitespace-nowrap text-sm text-white font-mono">{scores[0]}</td>
            <td className="p-6 py-4 whitespace-nowrap text-sm text-white font-mono">{scores[1]}</td>
            <td className="p-6 py-4 whitespace-nowrap text-sm text-white font-mono">{scores[2]}</td>
            <td className="p-6 py-4 whitespace-nowrap text-sm text-white font-mono">{scores[3]}</td>
            <td className="p-6 py-4 whitespace-nowrap text-sm text-white font-mono">{scores[4]}</td>
        </tr>
    );
  }

    return (
      <div className="flex flex-col justify-center"> 
        <div className="flex flex-col justify-items-stretch poppins">
          {!connectWallet ?  
            <div className="poppins mx-auto text-lg mt-5 text-red-500">
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
                  Your referral code is 
                </div>
                <div className="md:col-span-4 pr-5">
                {referralCode}
                </div>
                
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
              <ReCAPTCHA 
              ref={recaptchaRef}
              sitekey={"6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}/>
            </div>

          <div className="flex flex-col justify-center items-center">

            {connectWallet ? 
              <button
                className={`relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium rounded-lg 
                group bg-gradient-to-br from-purple-600 to-blue-500 text-white shadow-lg shadow-purple-800/40
                `}
                onClick={handleUserSubmissionWrapped}
              >
                <span className={`relative px-5 py-2.5 transition-all ease-in duration-75 rounded-md hover:bg-slate-900/0 bg-slate-900`}>
                    Submit
                </span>
              </button>
            : null}
             
            {errorMessage == 'Successfully added!'? 
              <button type="button" className="mx-auto text-white bg-[#1da1f2] hover:bg-[#1da1f2]/90 focus:ring-4 focus:outline-none font-medium rounded-lg text-md px-5 py-2.5 text-center inline-flex items-center focus:ring-[#1da1f2]/55"
                onClick={() => {
                  window.open(`https://twitter.com/intent/tweet?text=I%20just%20rated%20${protocol}%20with%20scores%20of%20${[q1Score, q2Score, q3Score, q4Score, q5Score].join(', ')}%20on%20TRUST%20and%20earned%20a%20$TRUST%20airdrop.%20Check%20it%20out%20at%20http://localhost:5173&via=YourTwitterHandle`);
                }}>
                <svg className="w-4 h-4 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 17">
                  <path fill-rule="evenodd" d="M20 1.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.344 8.344 0 0 1-2.605.98A4.13 4.13 0 0 0 13.85 0a4.068 4.068 0 0 0-4.1 4.038 4 4 0 0 0 .105.919A11.705 11.705 0 0 1 1.4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 4.1 9.635a4.19 4.19 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807A8.36 8.36 0 0 1 0 14.184 11.732 11.732 0 0 0 6.291 16 11.502 11.502 0 0 0 17.964 4.5c0-.177 0-.35-.012-.523A8.143 8.143 0 0 0 20 1.892Z" clip-rule="evenodd"/>
                </svg>
                Share on Twitter!
              </button>
            : null}

          </div>
          

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