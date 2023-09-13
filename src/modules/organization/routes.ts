import { Router } from "express"
import { MemberRole } from "@prisma/client"

// Locals
import controller from "./controller"
import { requireLogin, requireMemberRole } from "@/middlewares/permission"

const router = Router()

router.get("/list", controller.find)
router.post("/", requireLogin, controller.create)
router.route("/:id")
  .get(controller.findById)
  .put(
    requireLogin,
    requireMemberRole(MemberRole.OWNER, MemberRole.ADMIN, MemberRole.MODERATOR),
    controller.updateById)
  .delete(
    requireLogin,
    requireMemberRole(MemberRole.OWNER),
    controller.deleteById
  )

export default router
