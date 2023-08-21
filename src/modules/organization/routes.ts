import { Router } from "express"

// Locals
import controller from "./controller"
import { optionalLogin, requireLogin } from "@/middlewares/permission"

const router = Router()

router.route("/")
  .post(requireLogin, controller.create)

router.route("/list")
  .get(controller.find)

router.route("/:id")
  .get(optionalLogin, controller.findById)
  .put(requireLogin, controller.updateById)
  .delete(requireLogin, controller.deleteById)

export default router
