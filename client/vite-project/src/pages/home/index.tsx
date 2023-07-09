import '../../App.css';
import Axios from 'axios';

// ADDITIONAL IMPORTS
import '@fontsource-variable/unbounded';
import '@fontsource/poppins';
import { useState, useEffect } from 'react';

import Introduction from './title.tsx'
import Instructions from './instructions.tsx';
import FormController from '../submitRatings/formController.tsx';

function App() {

  //hooks for user address
  const [address, setAddress] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<string>("");

  
  // What is this hook for?
  useEffect(() => {
    setSubmitted("");
  }, [address]);


  
  return (
    <div className="App">

      {/* BACKGROUND IMAGE */}

      <Introduction />

      <Instructions />

      <FormController/>


    </div>
  );
}


export default App;
