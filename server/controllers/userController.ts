


function generateCode(codeLength = 8) : string {
    const str = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    let code = ""
    for (let i=0; i < codeLength; i++){
        code += str.charAt(Math.floor(Math.random() * (str.length+1)));
    }
    return code
}