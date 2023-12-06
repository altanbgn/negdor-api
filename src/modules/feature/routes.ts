import { Router } from "express"
import { UserRole } from "@prisma/client"

// Locals
import { requireLogin, requireUserRole } from "@/middlewares/permission"
import FeatureController from "./controller"

const router = Router()
const controller = new FeatureController()

router.get("/list", controller.find)
router.post("/", requireLogin, controller.create)
router.route("/:id")
  .get(controller.findById)
  .put(
    requireLogin,
    requireUserRole(UserRole.CLIENT),
    controller.updateById
  )
  .delete(
    requireLogin,
    requireUserRole(UserRole.CLIENT),
    controller.deleteById
  )

export default router
