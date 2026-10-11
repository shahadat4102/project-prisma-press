import { subscription } from './../../../generated/prisma/client';
import { NextFunction, Request, Response, Router } from "express";
import { premiumController } from "./premium.controller";
import { auth } from "../../middlewares/auth";
import { Role, subscriptionStatus } from "../../../generated/prisma/enums";
import { catchAsync } from "../../utlis/catchasync";
import { prisma } from '../../lib/prisma';
import { subscribGuard } from '../../middlewares/premiumGurd';


const router = Router()

router.get('/', 
    auth(Role.USER, Role.AUTHOR, Role.ADMIN),
    subscribGuard(),
    premiumController.getpremiumContent)


export const premiumRoutes = router