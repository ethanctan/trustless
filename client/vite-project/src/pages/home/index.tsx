import '../../App.css';
// ADDITIONAL IMPORTS
import '@fontsource-variable/unbounded';
import '@fontsource/poppins';

import Introduction from './title.tsx'
import Instructions from './instructions.tsx';

function App() {


  return (
    <div className="App">

      {/* BACKGROUND IMAGE */}

      <div className="flex flex-col items-center">

        <Introduction />

        <Instructions />

      </div>

    </div>
  );
}


export default App;
