import { stripe } from './lib/stripe';
import { join } from './../generated/prisma/internal/prismaNamespace';

import { userRouter } from './modules/user/user.route';


import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import { authRouter } from './modules/auth/auth.rotes';
import { postRouters } from './modules/post/post.router';
import { commentRouters } from './modules/comment/comment.router';
import { subscriptionRoutes } from './modules/subscription/subscription.route';
import { subscriptionController } from './modules/subscription/subscription.controller';
import { premiumRoutes } from './modules/premium/premium.router';






const app: Application = express();

app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  })
);

const endpointsecret = config.stripe_webhook_secret;

// app.post("/api/subscription/webhook", express.raw({type: 'Application/join'}), (req: Request, res: Response)=>{

//   let event = req.body;

//   if(endpointsecret){

//     const signature = req.headers['stripe-signature'] !;
//     try {
//       event = stripe.webhooks.constructEvent(
//         req.body,
//         signature,
//         endpointsecret
//       );
//     } catch (error: any) {
//       console.log('Error verifying webhook signature:', error);
//       return res.status(400).json({
//         message: error.message,

//       })
//     }

//   }

//   switch(event.type){
//     case 'payment_intent.succeeded':
//       const paymentIntent  = event.data.object;
//       console.log(`PaymentIntent for ${paymentIntent.amount}was successful!`);
//       break;
//     case`payment_method.attached`:
//     const paymentMethod = event.data.object;
//     break;
//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }



//   })

app.post("/api/subscription/webhook", express.raw({type: 'application/json'}), subscriptionController.handelWebhook)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});




// app.post();
app.use("/api/users",userRouter)

app.use("/api/auth",authRouter)

app.use("/api/posts", postRouters)

app.use("/api/comments",commentRouters)

app.use("/api/subscription", subscriptionRoutes)

app.use("/api/premium", premiumRoutes)





export default app;

