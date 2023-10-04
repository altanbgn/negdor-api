import { Router } from "express"

// Locals
import RatingController from "./controller"
import { requireLogin, requireOwnership } from "@/middlewares/permission"

const router = Router()
const controller = new RatingController()

router.get("/list", controller.find)
router.post("/", requireLogin, controller.create)
router.route("/:id")
  .get(controller.findById)
  .put(
    requireLogin,
    requireOwnership("rating"),
    controller.updateById
  )
  .delete(
    requireLogin,
    requireOwnership("rating"),
    controller.deleteById
  )

export default router
