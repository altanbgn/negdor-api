import { Router } from "express"

// Locals
import controller from "./controller"
import { requireLogin } from "@/middlewares/permission"

const router = Router()

router.post("/", requireLogin, controller.create)
router.get("/list", requireLogin, controller.find)

router.route("/me")
  .get(requireLogin, controller.findMe)
  .put(requireLogin, controller.updateMe)
  .delete(requireLogin, controller.deleteMe)

router.route("/:id")
  .get(controller.findById)
  .put(requireLogin, controller.updateById)
  .delete(requireLogin, controller.deleteById)

export default router
