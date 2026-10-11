import { Router } from "express";
import { authContoler } from "./auth.contoler";


const router = Router()

router.post("/login",authContoler.loginUser)

router.post("/refresh-token",authContoler.refreshToken)

export const authRouter = router;