
import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { IloginUserV } from "./authinterfesh";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken"
import config from "../../config";
import { jwtUitile } from "../../utlis/jwt";



const loginuser = async (Payload: IloginUserV) => {
    const { email, password } = Payload;

    // const user = await prisma.user.findUnique({
    //     where: { email }
    // });
    // if (!user) {
    //     throw new Error("No user found with this email");
    // }

    const user = await prisma.user.findFirstOrThrow({
        where:{email}
    })
     if (user.activeStatus === "BLOCKED") {
    throw new Error ("Your Account has been blocked plase contact support")
  }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        throw new Error("Password is incorrect");
    }

    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    };

//    const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret,{
//     expiresIn: config.jwt_access_expires_in 
//    }as SignOptions
//   )
      
      const accessToken = jwtUitile.creactTokan(
        jwtPayload,
        config.jwt_access_secret,
        config.jwt_access_expires_in as SignOptions
      )

//     const refreshToken = jwt.sign(jwtPayload, config.jwt_refresh_secret,{
//         expiresIn: config.jwt_refresh_expires_in
//     } as SignOptions
// )
       const refreshToken = jwtUitile.creactTokan(
        jwtPayload,
        config.jwt_refresh_secret,
        config.jwt_refresh_expires_in as SignOptions
       )

    return {  accessToken, refreshToken };
};


const refreshToken = async(refershToken: string)=>{
 const verifiRefreshToken = jwtUitile.verifiToken(refershToken, config.jwt_refresh_secret)

 if(!verifiRefreshToken.success){
    throw new Error(verifiRefreshToken.error)
 }
 const {id}= verifiRefreshToken.data as JwtPayload
 const user  = await prisma.user.findUniqueOrThrow({
    where:{id}
 })
  
 if(user.activeStatus === "BLOCKED"){
    throw new Error("User is blocked")
 }
 
 const jwtpayloda = {
    id,
    name: user.name,
    email: user.email,
    role: user.role
 }
 const accessToken = jwtUitile.creactTokan(
    jwtpayloda,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions
 )
 return{accessToken}

}


export const authService = {
    loginuser,
    refreshToken
};
