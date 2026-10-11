import config from "../../config";
import { prisma } from "../../lib/prisma"
import { stripe } from "../../lib/stripe";
import Stripe from 'stripe';
import { subscriptionStatus } from '../../../generated/prisma/enums';
import { handelChakoutSessionCompleted, handelChangeSubscription } from './subscrpton.utlis';


const createCheckoutSession = async(userId : string) =>{

const triansactionResult = await prisma.$transaction(async(tx: typeof prisma)=>{
  const user = await tx.user.findUniqueOrThrow({
    where:{
        id: userId
    },
    include:{
        subscription: true
    }
  })
// old subscriber
  let stripeCustomerId = user.subscription?.stripeCustomerId;
  //new subscriber
   if(!stripeCustomerId){
     const customer = await stripe.customers.create({
    email : user.email,
    name : user.name,
    metadata : {userId : user.id}
  })
  stripeCustomerId = customer.id
   }
 const session = await stripe.checkout.sessions.create({
    line_items : [
        {
            price : config.stripe_product_price_id,
            quantity : 1
        }
    ],
    mode : "subscription",
    customer : stripeCustomerId,
    payment_method_types : ["card"],
    success_url : `${config.app_url}/premium?success= true`,
    cancel_url : `${config.app_url}/payment?success= false`,
    metadata : {userId : user.id}
 })
 
 return session.url

})

return {
    paymentUrl : triansactionResult
}

}

const handelWeghook = async(Payload: Buffer, signature : string) =>{
  const endpointsecret = config.stripe_webhook_secret;
  const event = stripe.webhooks.constructEvent(
    Payload,
    signature,
    endpointsecret
  );
  //Handle the event 
  switch(event.type){
    case `checkout.session.completed`:
      await handelChakoutSessionCompleted(event.data.object);
      break;

    case`customer.subscription.updated`:
      //const subscription = event.data.object;
      await handelChangeSubscription(event.data.object);
      break;

    case `customer.subscription.deleted`: 
    //const subscriptionDeleted = event.data.object;
      await handelChangeSubscription(event.data.object);
    break;  

    default:
      console.log(`No events matched. Unhandled event type ${event.type}`);
      break;
  }
}

const getSubscriptStatus = async(userId : string) =>{
  const isSubscriptionExists = await prisma.subscription.findUniqueOrThrow({
    where : {
      userId
    }
  })
  const isActive = isSubscriptionExists.status === "ACTIVE" && 
       isSubscriptionExists.currentPeriodEnd && new Date(isSubscriptionExists.
       currentPeriodEnd) > new Date();

return {
  status : isSubscriptionExists.status,
  isSubscribed : isActive,
  currentPeriodEnd : isSubscriptionExists.currentPeriodEnd
}

}


export const subscriptionServices = {
    createCheckoutSession,
    handelWeghook,
    getSubscriptStatus
    
}