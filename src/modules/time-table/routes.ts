import { Router } from "express"
import { MemberRole } from "@prisma/client"

// Locals
import { requireLogin, requireMemberRole } from "@/middlewares/permission"
import controller from "./controller"

const router = Router()

router.get("/list", controller.find)
router.post("/",
  requireLogin,
  requireMemberRole(
    "timeTable",
    MemberRole.OWNER, MemberRole.ADMIN, MemberRole.MODERATOR
  ),
  controller.create
)
router.route("/:id")
  .get(controller.findById)
  .put(
    requireLogin,
    requireMemberRole(
      "timeTable",
      MemberRole.OWNER, MemberRole.ADMIN, MemberRole.MODERATOR
    ),
    controller.updateById
  )
  .delete(
    requireLogin,
    requireMemberRole(
      "timeTable",
      MemberRole.OWNER, MemberRole.ADMIN, MemberRole.MODERATOR
    ),
    controller.deleteById
  )

export default router
