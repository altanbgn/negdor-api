import { Router } from "express"

// Locals
import controller from "./controller"
import { requireLogin, requireOwnership } from "@/middlewares/permission"

const router = Router()

router.get("/list", controller.find)
router.post("/",
  requireLogin,
  controller.create
)
router.route("/:id")
  .get(controller.findById)
  .put(
    requireLogin,
    requireOwnership("review"),
    controller.updateById
  )
  .delete(
    requireLogin,
    requireOwnership("review"),
    controller.deleteById
  )

export default router
