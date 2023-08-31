import { Router } from "express"

// Locals
import controller from "./controller"

const router = Router()

router.post("/", controller.create)
router.get("/list", controller.find)
router.route("/:id")
  .get(controller.findById)
  .put(controller.updateById)
  .delete(controller.deleteById)

export default router
