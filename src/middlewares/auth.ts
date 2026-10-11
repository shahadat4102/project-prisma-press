import { NextFunction, Request, Response } from "express";
import { Role } from "../../generated/prisma/enums";
import { catchAsync } from "../utlis/catchasync";
import { jwtUitile } from "../utlis/jwt";
import config from "../config";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma";


declare global {
  namespace Express{
    interface Request{
        user?:{
          email: string;
          name: string;
          id: string;
          role : Role
        }
    }
  }
}



export const auth = (...requiredRoles: Role[]) =>{
  return catchAsync(async(req:Request, res: Response, next: NextFunction)=>{

   const token = req.cookies.accessToken ? req.cookies.accessToken :
   req.headers.authorization?.
   startsWith("Bearer") ? req.headers.authorization?. split(" ")[1] :
   req.headers.authorization;

   if(!token){
    throw new Error("You are Not logged in. plage log in to access this resource")
   }

   const verifieToken = jwtUitile.verifiToken(token, config.jwt_access_secret) 
    if(!verifieToken.success){
    throw new Error (verifieToken.error)
 }
  const {email, name, id, role} = verifieToken.data as JwtPayload

  if (requiredRoles.length && !requiredRoles.includes(role)) {
    throw new Error("Forbidden your dont have access this resoure");
    
  }
  const user = await prisma.user.findUnique({
    where:{
      id,
      email,
      name,
      role
    }
  });
  if (!user) {
    throw new Error("User Not Found.Please log in agin")
  }
  if (user.activeStatus === "BLOCKED") {
    throw new Error ("Your Account has been blocked plase contact support.")
  }
  req.user = {
    id,
    email,
    name,
    role
  }

  next();

  })
}
