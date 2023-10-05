import { Router } from "express"
import { UserRole } from "@prisma/client"

// Locals
import UserController from "./controller"
import { requireLogin, requireUserRole } from "@/middlewares/permission"

const router = Router()
const controller = new UserController()

router.post("/",
  requireLogin,
  controller.create
)
router.get("/list",
  requireLogin,
  controller.find
)
router.route("/me")
  .get(
    requireLogin,
    controller.findMe
  )
  .put(
    requireLogin,
    controller.updateMe
  )
  .delete(
    requireLogin,
    controller.deleteMe
  )

router.get("/send-verify-email",
  requireLogin,
  controller.sendVerifyEmail
)

router.get("/verify-email",
  requireLogin,
  controller.verifyEmail
)

router.post("/change-password",
  requireLogin,
  controller.changePassword
)

router.route("/:id")
  .get(controller.findById)
  .put(
    requireLogin,
    requireUserRole(UserRole.MODERATOR),
    controller.updateById
  )
  .delete(
    requireLogin,
    requireUserRole(UserRole.MODERATOR),
    controller.deleteById
  )

export default router
