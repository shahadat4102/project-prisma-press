import Stripe from "stripe";
import { stripe } from "../../lib/stripe";
import { prisma } from "../../lib/prisma";
import { subscriptionStatus } from "../../../generated/prisma/client";






export const getperiodEnd = (Payload: Stripe.Subscription) =>{

   const currentPeriodendMileseconds = Payload.items.data[0]?.
   current_period_end!;

  const currentPeriodEnd = new Date(currentPeriodendMileseconds * 1000);

  return currentPeriodEnd

}


export const handelChakoutSessionCompleted = async(session : Stripe.Checkout.Session) =>{
     
      const userId = session.metadata?.userId;
      const stripeCustomerId = session.customer as string
      const stripeSubscriptionId = session.subscription  as string;

      if(!userId || !stripeCustomerId || !stripeSubscriptionId){
        console.log("webhook : Missing required information in the session ");
        return;
      }

      const stripeSubscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);

      const currentPeriodEnd = getperiodEnd(stripeSubscription);
      
      await prisma.subscription.upsert({
        where: {
          userId
        },
        create:{
          userId,
          stripeCustomerId,
          stripeSubscriptionId,
          status: "ACTIVE",
          currentPeriodEnd
        },
        update:{
          stripeCustomerId,
          stripeSubscriptionId,
          status: "ACTIVE",
          currentPeriodEnd
        }
      })

}

export const handelChangeSubscription = async(Payload: Stripe.Subscription) =>{
 
  const stripeSubscriptionId = Payload.id;
 const status = (Payload.status === "active" ||  Payload.status == "trialing") ?
                 subscriptionStatus.ACTIVE :
                 Payload.status == "canceled" ? subscriptionStatus.CANCELED :
                 subscriptionStatus.EXPIRED
   const currentPeriodEnd = getperiodEnd(Payload);

   const isSubscriptionExists = await prisma.subscription.findUnique({
    where:{
        stripeSubscriptionId
    }
   })
   if(!isSubscriptionExists){
    console.log(`webhook : No subscription found for subscription id: ${stripeSubscriptionId}`)
    
    return;
   }

    await prisma.subscription.update({
      where:{
        stripeSubscriptionId
      },
      data:{
        status,
        currentPeriodEnd
      }
    })

  }
