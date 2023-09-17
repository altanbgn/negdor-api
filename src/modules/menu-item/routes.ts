import { Router } from "express"
import { MemberRole, UserRole } from "@prisma/client"

// Locals
import { requireLogin, requireMemberRole, requireUserRole } from "@/middlewares/permission"
import controller from "./controller"

const router = Router()

router.get("/list", controller.find)
router.post("/",
  requireLogin,
  requireMemberRole(MemberRole.ADMIN, MemberRole.MODERATOR, MemberRole.OWNER),
  requireUserRole(UserRole.ADMIN, UserRole.MODERATOR, UserRole.CLIENT),
  controller.create
)
router.route("/:id")
  .get(controller.findById)
  .put(
    requireLogin,
    requireMemberRole(MemberRole.ADMIN, MemberRole.MODERATOR, MemberRole.OWNER),
    requireUserRole(UserRole.ADMIN, UserRole.MODERATOR, UserRole.CLIENT),
    controller.updateById
  )
  .delete(
    requireLogin,
    requireMemberRole(MemberRole.ADMIN, MemberRole.MODERATOR, MemberRole.OWNER),
    requireUserRole(UserRole.ADMIN, UserRole.MODERATOR, UserRole.CLIENT),
    controller.deleteById
  )

export default router
