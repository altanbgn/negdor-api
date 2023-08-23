import { Router } from "express"

// Locals
import controller from "./controller"
import { requireLogin } from "@/middlewares/permission"

const router = Router()

router.get("/list", requireLogin, controller.find)

router.post("/", requireLogin, controller.create)

router.route("/:id")
  .get(controller.findById)
  .put(requireLogin, controller.updateById)
  .delete(requireLogin, controller.deleteById)

export default router
