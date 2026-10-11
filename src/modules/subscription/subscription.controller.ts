import { stripe } from './../../lib/stripe';
import  httpStatus from 'http-status';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utlis/catchasync";
import { subscriptionServices } from "./subscription.service";
import { sendRespones } from "../../utlis/sendResposes";




const createCheckourtSession = catchAsync(async(req:Request, res:Response, next: NextFunction)=>{
   const userId = req.user?.id;
   const rusult = await subscriptionServices.createCheckoutSession(userId as string);

   sendRespones(res, {
    success: true,
    statusCode: httpStatus.OK,
    message : "checkout completed successfully",
    data:rusult
   })
})


const handelWebhook = catchAsync(async(req:Request, res:Response, next: NextFunction)=>{
    const event = req.body;
    const signature = req.headers['stripe-signature']!;

    await subscriptionServices.handelWeghook(event, signature as string);

    sendRespones(res,{
        success: true,
        statusCode: 200,
        message: "Webhook triggered successfully",
        data: null
    })
})


const getSubscriptStatus = catchAsync(async(req:Request, res:Response, next: NextFunction)=>{
    const userId = req.user?.id;
    const result = await subscriptionServices.getSubscriptStatus(userId as string);

    sendRespones(res,{
        success: true,
        statusCode: httpStatus.OK,
        message: "Subscription status retrieved successfully",
        data: result
    })
}

)

export const subscriptionController = {
    createCheckourtSession,
    handelWebhook,
    getSubscriptStatus
}