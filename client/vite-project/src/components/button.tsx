//@ts-ignore
  function Button({ text, clickFunction, correctNetwork }) {
    return (
      <button
        className={`relative inline-flex items-center justify-center p-0.5 my-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg 
        
        ${correctNetwork ? `group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-2 focus:outline-none shadow-lg shadow-purple-800/40 dark:shadow-lg dark:shadow-purple-800/40` : `group bg-red-500 group-hover:bg-red-600 hover:text-white dark:text-white focus:ring-2 focus:outline-none shadow-lg shadow-red-800/40 dark:shadow-lg dark:shadow-red-800/40`}
        `}
        onClick={clickFunction}
      >
        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-slate-900 dark:bg-slate-900 rounded-md group-hover:bg-opacity-0">
          {text}
        </span>
      </button>
    );
  }
  
  export default Button;
  