
//@ts-ignore
function Button({text, clickFunction}){
    return(
        <button 
            className='mb-3 mt-3 bg-blue-700 hover:bg-blue-600 hover:border-white focus:outline-none' 
            onClick={clickFunction}
        >
            {text}
        </button> 
    )
}

export default Button