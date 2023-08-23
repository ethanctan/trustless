import {useState, useEffect} from 'react';
import '@fontsource-variable/unbounded';
import '@fontsource/poppins';

import { TextField } from '@mui/material';
import { UserIdentity } from '../../interfaces/user.ts';
import { PostRating, ProtocolRatings } from '../../interfaces/rating.ts';

import { Question } from '../../components/question.tsx'
import SearchBar from '../../components/searchBar.tsx';
import { textFieldDesc } from './formConsts.ts';
import { SubmissionTable } from '../../components/submissionTable.tsx';
import { cex } from './CEX.ts';
import { Bridge } from './Bridge.ts';
//@ts-ignore
import reCAPTCHA from "react-recaptcha-google"
import ReCAPTCHA from 'react-google-recaptcha';
import FormHandler from './formHandler.ts';
import React from 'react';
import { getToken } from '../../utils/utils.ts';

//@ts-ignore
function Form({defiData, getUserData, walletAccount}){
    
    const [q1Score, setQ1Score] = useState<number>(1);
    const [q2Score, setQ2Score] = useState<number>(1);
    const [q3Score, setQ3Score] = useState<number>(1);
    const [q4Score, setQ4Score] = useState<number>(1);
    const [q5Score, setQ5Score] = useState<number>(1);
    const [influencer, setInfluencer] = useState<string>(""); //other people's code

    const [address, setAccount] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [protocol, setProtocol] = useState<string>("");
    const [text1, setText1] = useState<string>(""); // tooltips
    const [text2, setText2] = useState<string>("");
    const [text3, setText3] = useState<string>("");
    const [text4, setText4] = useState<string>("");
    const [text5, setText5] = useState<string>("");
    const [referralCode, setReferralCode] = useState<string>("");//self-code
    const [protocolRatings, setProtocolRatings] = useState<ProtocolRatings>({});
    const [valid_token, setValidToken] = useState([]);

    let formHandler = new FormHandler()
    const recaptchaRef = React.useRef<ReCAPTCHA>(null);

    
    // for generating form content
  const handleSetProtocol = (protocol: string) => {
    setProtocol(protocol);
    setText1("How secure do you believe " + protocol + "'s smart contracts are? Have they been audited, or have they been exploited? How robust is the protocol's offchain security? Have they suffered offchain exploits, data breaches, phishing, or other attacks?");
    setText2("How robust, transparent, and community-oriented is " + protocol + "'s treasury? Does it mostly comprise of the protocol's native token, creating concentrated risk? Or does it have a diverse range of assets? Is value regularly distributed to the community?");
    setText3("How confident are you in " + protocol + "'s ability to deliver on their roadmap? Have they delivered in the past? Do their goals seem feasible, or are they overpromising?");
    setText4("How robust is " + protocol + "'s governance system? If decentralized, is there strong voter participation, or is voting controlled by a few whales? If centralized, is there a clear and transparent decision-making process?");
    setText5("How strong is the track record of " + protocol + "'s team? If they're doxxed, do they have strong credentials and experience? If undoxxed, do they have a good reputation and history?");
  }

  async function getUserDataWrapped() {
    console.log("Wallet account", walletAccount)
    let user = await getUserData(walletAccount);
    setReferralCode(user.data.referralCode)
    setAccount(user.data.walletId)
    setProtocolRatings(user.data.protocolRatings)
  }

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
    let newRating: PostRating = {protocol: protocol, scores: scores, code: influencer};
    let user: UserIdentity = {cookieId: "", walletId: String(address) }


    try{

      console.log("submitting")
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
    const {epoch, scores, protocol} = protocolRatings[key];
    return (
        <tr key={key} 
          className="bg-slate-900 bg-opacity-70 backdrop-filter backdrop-blur-md"
          style={{ marginBottom: '10px', height: '50px' }}
        >
            <td className="p-6 py-4 whitespace-nowrap text-sm text-white font-mono">{epoch}</td>
            <td className="p-6 py-4 whitespace-nowrap text-sm text-white font-mono">{key ? protocol : key}</td>
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
            <SearchBar protocol={protocol} defiData={defiData} handleSetProtocol={handleSetProtocol} />
            { protocol && (

            <div className="bg-gray-900 backdrop-blur-md bg-opacity-50 p-4 rounded-lg mb-4 mx-auto max-w-xl">
            <div className="m-4"> 
                <p className="md:mb-2 mb-5 text-lg md:text-base"> Our framework for trust consists of 5 factors, rated on a scale of 1-10, with 1 being the least trustworthy and 10 being the most. </p>
                <p className="mb-2 text-lg md:text-base"> Rate {protocol}'s trustworthiness in these 5 areas. </p>

                <div className="flex justify-center items-center mb-2 mt-5 text-base md:hidden">
                  <span className="mr-2">
                    (Tap and hold the
                  </span>
                  <svg fill="#3874cb" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 416.979 416.979" width="14" height="14">
                  <g>
                      <path d="M356.004,61.156c-81.37-81.47-213.377-81.551-294.848-0.182c-81.47,81.371-81.552,213.379-0.181,294.85
                      c81.369,81.47,213.378,81.551,294.849,0.181C437.293,274.636,437.375,142.626,356.004,61.156z M237.6,340.786
                      c0,3.217-2.607,5.822-5.822,5.822h-46.576c-3.215,0-5.822-2.605-5.822-5.822V167.885c0-3.217,2.607-5.822,5.822-5.822h46.576
                      c3.215,0,5.822,2.604,5.822,5.822V340.786z M208.49,137.901c-18.618,0-33.766-15.146-33.766-33.765
                      c0-18.617,15.147-33.766,33.766-33.766c18.619,0,33.766,15.148,33.766,33.766C242.256,122.755,227.107,137.901,208.49,137.901z"/>
                  </g>
                  </svg>
                  <span className="ml-2">
                    icon to show details)
                  </span>
                </div>

            </div>
            <div className="flex-col gap-4 py-4">
            { 
              !cex.includes(protocol) ? (
                <>
                  <Question questionScore={q1Score} setScore={setQ1Score} text={text1} title="Security" />
                  <Question questionScore={q2Score} setScore={setQ2Score} text={text2} title="Treasury" />
                  <Question questionScore={q3Score} setScore={setQ3Score} text={text3} title="Roadmap" />
                  <Question questionScore={q4Score} setScore={setQ4Score} text={text4} title="Governance" />
                  <Question questionScore={q5Score} setScore={setQ5Score} text={text5} title="Team" />
                </>
              ) : (
                <span> CEX Questions </span> // Ethan TODO: Add CEX questions
              )
            }


                <div className="flex justify-start text-left pl-6 mt-5 mb-3 items-center text-lg md:text-base">
                  Your referral code is: 
                    <mark className="px-3 py-1 ml-4 text-white bg-gradient-to-br from-violet-500 to-blue-500 rounded-md font-mono">
                    {referralCode ? referralCode : 'Loading...'}
                    </mark>
                </div>
                
                <div className="flex items-start justify-start text-left pl-6 text-lg md:text-base">
                    If you're copying someone's ratings, enter their code.
                </div>
                <div className="md:col-span-4 pr-5 mt-5">
                    <TextField 
                    className="poppins"
                    id="outlined-basic" 
                    sx={textFieldDesc}
                    placeholder="@twitterhandle" 
                    label="Referral Code..." 
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
             
            {errorMessage == 'Successfully added!'? 
              <button type="button" className="mx-auto text-white bg-[#1da1f2] hover:bg-[#1da1f2]/90 focus:ring-4 focus:outline-none font-medium rounded-lg text-base px-5 py-2.5 text-center inline-flex items-center focus:ring-[#1da1f2]/55"
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

    <>
      <h3 className="unbounded text-2xl my-5 font-light">
        Your ratings:
      </h3>
      <div className="mx-auto mb-10">
        <SubmissionTable 
        headings={["Epoch", "Protocol Name", "Security", "Treasury", "Roadmap", "Governance", "Team"]}
        submissions={Object.keys(protocolRatings)}
        RowGenerator={listUserRatings}
        /> 
      </div>
    </>
  </div>
  )
}

export default Form;