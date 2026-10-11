

import {  Router } from "express";
import { userContoler } from "./user.controller";
import { Role } from "../../../generated/prisma/enums";
import httpstatus from "http-status"
import { auth } from "../../middlewares/auth";


const router = Router();


router.post("/register",userContoler.registerUser)


router.get("/me",auth
//   (req: Request, res: Response, next: NextFunction )=>{
// //   res.status(200).json({
// //     success: true,
// //     statusCode: 200,
// //     message: "User Profile successfuly"
// //   })
//   console.log(req.cookies)
//   const {accessToken} = req.cookies
//  // console.log(req.user, "user reqest")
//  const verifieToken = jwtUitile.verifiToken(accessToken, config.jwt_access_secret) 
   
// if(!verifieToken.success){
//  throw new Error (verifieToken.error)
// }

//  const {email, name, id, role} = verifieToken.data as JwtPayload

//  const requiredRoles = [Role.ADMIN, Role.USER, Role.AUTHOR];

//  if(!requiredRoles.includes(role)){
//     return res.status(404).json({
//         success: false,
//         statuscods: httpstatus.FORBIDDEN,
//         massage: "Forbidden your dont poblem"
//     })
//  }
//  req.user = {
//     email,
//     name,
//     id,
//     role
//  };
// next();

// },

(Role.ADMIN, Role.AUTHOR, Role.USER),
 userContoler.getmyprofile);


 router.put("/my-profile", auth(Role.ADMIN, Role.USER, Role.AUTHOR),
 userContoler.updetmyProfile
)

 
export const userRouter = router;