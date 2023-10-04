import { Router } from "express"
import { MemberRole, UserRole } from "@prisma/client"

// Locals
import { requireLogin, requireUserRole, requireMemberRole } from "@/middlewares/permission"
import MenuController from "./controller"

const router = Router()
const controller = new MenuController()

router.get("/list", controller.find)
router.post("/",
  requireLogin,
  requireMemberRole("menu", MemberRole.ADMIN, MemberRole.OWNER, MemberRole.MODERATOR),
  requireUserRole(UserRole.MODERATOR, UserRole.CLIENT),
  controller.create
)
router.route("/:id")
  .get(controller.findById)
  .put(
    requireLogin,
    requireMemberRole("menu", MemberRole.ADMIN, MemberRole.OWNER, MemberRole.MODERATOR),
    requireUserRole(UserRole.MODERATOR, UserRole.CLIENT),
    controller.updateById
  )
  .delete(
    requireLogin,
    requireMemberRole("menu", MemberRole.ADMIN, MemberRole.OWNER, MemberRole.MODERATOR),
    requireUserRole(UserRole.MODERATOR, UserRole.CLIENT),
    controller.deleteById
  )

export default router
