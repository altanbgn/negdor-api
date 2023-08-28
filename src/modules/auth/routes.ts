import { Router } from "express"

// Locals
import controller from "./controller"

const router = Router()

router.post("/login", controller.login)
router.post("/register", controller.register)
router.post("/change-password", controller.changePassword)
router.post("/forgot-password", controller.forgotPassword)
router.post("/recover-password", controller.recoverPassword)

export default router
