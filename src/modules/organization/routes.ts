import { Router } from "express"
import { MemberRole } from "@prisma/client"

// Locals
import OrganizationController from "./controller"
import { requireLogin, requireMemberRole } from "@/middlewares/permission"

const router = Router()
const controller = new OrganizationController()

router.get("/list", controller.find)
router.post("/", requireLogin, controller.create)
router.route("/:id")
  .get(controller.findById)
  .put(
    requireLogin,
    requireMemberRole("organization", MemberRole.OWNER, MemberRole.ADMIN, MemberRole.MODERATOR),
    controller.updateById)
  .delete(
    requireLogin,
    requireMemberRole("organization", MemberRole.OWNER),
    controller.deleteById
  )

export default router
