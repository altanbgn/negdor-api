import { Router } from "express"
import { UserRole } from "@prisma/client"

// Locals
import { requireLogin, requireUserRole } from "@/middlewares/permission"
import controller from "./controller"

const router = Router()

router.get("/list", controller.find)
router.post("/", requireLogin, controller.create)
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
