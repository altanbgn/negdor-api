import { Router } from "express"
import { UserRole } from "@prisma/client"

// Locals
import { requireLogin, requireUserRole } from "@/middlewares/permission"
import ContentController from "./controller"

const router = Router()
const controller = new ContentController()

router.get("/list", controller.find)
router.post("/",
  requireLogin,
  requireUserRole(UserRole.ADMIN, UserRole.MODERATOR),
  controller.create
)
router.route("/:key")
  .get(controller.findByKey)
  .put(
    requireLogin,
    requireUserRole(UserRole.ADMIN, UserRole.MODERATOR),
    controller.updateByKey
  )
  .delete(
    requireLogin,
    requireUserRole(UserRole.ADMIN, UserRole.MODERATOR),
    controller.deleteByKey
  )

export default router
