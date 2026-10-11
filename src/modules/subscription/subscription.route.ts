import { Router } from "express";
import { subscriptionController } from "./subscription.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";



const router = Router()

router.post("/checkout",
    auth(Role.USER, Role.AUTHOR, Role.ADMIN),
     subscriptionController.createCheckourtSession
    )

    router.post('/webhook', subscriptionController.handelWebhook)

    router.get('/status',
    auth(Role.USER, Role.AUTHOR, Role.ADMIN),
    subscriptionController.getSubscriptStatus
    )

export const subscriptionRoutes = router