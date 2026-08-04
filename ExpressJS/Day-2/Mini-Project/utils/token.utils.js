import crypto from "crypto";

const generateToken = ()=>{
    return crypto.randomBytes(16).toString("hex");
}

const validateToken = (token)=>{
    return token.length === 32;
}

export {generateToken, validateToken}