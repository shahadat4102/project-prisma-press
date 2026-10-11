import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utlis/catchasync";
import { authService } from './auth.service';
import { sendRespones } from '../../utlis/sendResposes';



const loginUser = catchAsync(async(req: Request, res: Response, next:NextFunction )=>{
     
    const Payload = req.body;
    const {accessToken,refreshToken} = await authService.loginuser(Payload);
   
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 1000*60*60*24 // 24 hours
      })
      
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 1000*60*60*24*7 // 7 days 
      })


    sendRespones (res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Login successfully",
        data: {
            accessToken,
            refreshToken
        }
    })
})

const refreshToken = catchAsync(async(req: Request, res:Response, next: NextFunction)=>{
 const refershToken = req.cookies.refreshToken;
 const {accessToken} = await authService.refreshToken(refershToken)
  res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 1000*60*60*24 // 24 hours
      })

 sendRespones(res,{
  success: true,
  statusCode: httpStatus.OK,
  message: "Token refresh successfully",
  data: {
    accessToken
  }
 })

})


export const authContoler ={
    loginUser,
    refreshToken
}