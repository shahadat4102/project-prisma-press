
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";



const creactTokan =(payload: JwtPayload, secret:string, expiresIn: SignOptions) =>{
   const Token = jwt.sign(payload, secret, {
    expiresIn
}as SignOptions
)
   return Token
}


const verifiToken =(token: string, secret: string)=>{
try {
  const verifytoken = jwt.verify(token, secret)
  return {
    success: true,
    data: verifytoken
  }
} catch (error: any) {
    console.log("Token veryfycation fild:",error)
    return{
        success: false,
        error: error.message
    }
}
}
   



export const jwtUitile = {
    creactTokan,
    verifiToken
    
};
