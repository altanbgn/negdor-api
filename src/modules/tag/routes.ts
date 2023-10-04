import { Router } from "express"
import { UserRole } from "@prisma/client"

// Locals
import { requireLogin, requireUserRole } from "@/middlewares/permission"
import TagController from "./controller"

const router = Router()
const controller = new TagController()

router.get("/list", controller.find)
router.post("/",
  requireLogin,
  requireUserRole(UserRole.MODERATOR),
  controller.create
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
