import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utlis/catchasync";
import { prisma } from "../lib/prisma";
import { subscriptionStatus } from "../../generated/prisma/enums";


export const subscribGuard = () =>{
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user?.id;
        const subscription = await prisma.subscription.findUnique({
            where: {
                userId
            }
        })
        if (!subscription) {
           throw new Error("plase subscriber to get access to premium contets");
            
        }
        if(subscription?.status !== subscriptionStatus.ACTIVE){
            throw new Error ("Plase subscrib agin")
        }
        next()

    })
}