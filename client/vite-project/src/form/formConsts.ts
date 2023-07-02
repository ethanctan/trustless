

const textFieldDesc = {
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
        borderColor: 'white',
        },
        '&:hover fieldset': {
        borderColor: 'white',
        },
        '&.Mui-focused fieldset': {
        borderColor: 'white',
        },
    },
    '& .MuiOutlinedInput-input': {
        color: 'white',
        fontFamily: 'Poppins',
    },
    '& .MuiInputLabel-root': {
        color: 'white',
        fontFamily: 'Poppins',
    },
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'white',
    },
    '&::placeholder': {
        color: 'white',
        opacity: 0.5,
        fontFamily: 'Poppins',
    },
    '& input': {
        height: '16px', // Adjust the height as per your requirement
        fontFamily: 'Poppins',
    },
    '& .MuiInputLabel-outlined': {
        transform: 'translate(14px, 14px) scale(1)', // Adjust the label position if needed
    },
    '& .MuiInputLabel-shrink': {
        transform: 'translate(14px, -6px) scale(0.7)', // Adjust the label position if needed
    },
    }

export {textFieldDesc}