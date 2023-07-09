import '../../App.css';
// ADDITIONAL IMPORTS
import '@fontsource-variable/unbounded';
import '@fontsource/poppins';

import Introduction from './title.tsx'
import Instructions from './instructions.tsx';
import CountdownDisplay from '../../components/timer.tsx';

function App() {


  return (
    <div className="App">

      {/* BACKGROUND IMAGE */}

      <Introduction />

      <CountdownDisplay targetDate={"2024-03-25"}/>

      <Instructions />



    </div>
  );
}


export default App;
