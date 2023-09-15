import { Router } from "express"

// Locals
import controller from "./controller"
import { requireLogin } from "@/middlewares/permission"

const router = Router()

router.get("/login-facebook", controller.loginFacebook)
router.get("/login-google", controller.loginGoogle)

router.post("/login", controller.login)
router.post("/register", controller.register)
router.post("/forgot-password", controller.forgotPassword)
router.post("/recover-password", controller.recoverPassword)
router.post("/change-password", requireLogin, controller.changePassword)

export default router
