import { Payload } from './../../../generated/prisma/internal/prismaNamespace';

import {  NextFunction, Request,  Response } from "express"
import httpStatus from "http-status";
import { UserSirvice } from './user.service';
import { catchAsync } from '../../utlis/catchasync';
import { sendRespones } from '../../utlis/sendResposes';
import { jwtUitile } from "../../utlis/jwt";
import config from "../../config";






// const registerUser =  async (req : Request, res : Response) =>{
  
//     try {
//         const Payload = req.body
//        const user = await UserSirvice.registerUserBD(Payload)


//   res.status(httpStatus.CREATED).json({
//     success : true,
//     statusCode : httpStatus.CREATED,
//     message:  "Users registered successfuly",
//     data: {
//       user
//     }
//   })
        
//     } catch (error) {
//      console.log(error)
//      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//           success : false,
//          statusCode : httpStatus.INTERNAL_SERVER_ERROR,
//          message:  "Failed to register User",
//          error: (error as Error).message
         
//      })
       
//     }
   

// }



const registerUser = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
     
      const Payload = req.body
      const user = await UserSirvice.registerUserBD(Payload)

    //    res.status(httpStatus.CREATED).json({
    //    success : true,
    //    statusCode : httpStatus.CREATED,
    //    message:  "Users registered successfuly",
    //    data: {
    //      user
    //    }
    //  })
    sendRespones(res,{
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User registered successfuly",
      data:{user}
    })


})



const getmyprofile = catchAsync(async(req: Request, res : Response, next: NextFunction)=>{
   
// const {accessToken} = req.cookies
//  console.log(req.user, "user reqest")
      
//  const verifieToken = jwtUitile.verifiToken(accessToken, config.jwt_access_secret) 

//    if(typeof verifieToken === "string"){
//   throw new Error (verifieToken)
//  }

 const profile = await UserSirvice.getmyprofileBD(req.user?.id as string)     
 sendRespones(res,{
      success: true,
      statusCode: httpStatus.OK,
      message: "user Profile successfuly",
      data: {
            profile
      }
 })

 })



 const updetmyProfile = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
    const userId = req.user?.id as string;

    const payload = req.body;

    const updetprofile = await UserSirvice.updatemyprofileBD(userId, payload);
    
    sendRespones(res,{
      success: true,
      statusCode: httpStatus.OK,
      message: "User Profile updated sussessfully",
      data:{
            updetprofile
      }
    })
    
 })



export const userContoler ={
      registerUser,
       getmyprofile,
       updetmyProfile
}