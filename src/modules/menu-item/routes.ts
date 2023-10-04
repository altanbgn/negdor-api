import { Router } from "express"
// import { MemberRole } from "@prisma/client"

// Locals
import { requireLogin } from "@/middlewares/permission"
import MenuItemController from "./controller"

const router = Router()
const controller = new MenuItemController()

router.get("/list", controller.find)
router.post("/",
  requireLogin,
  // requireMemberRole("menuItem", MemberRole.ADMIN, MemberRole.MODERATOR, MemberRole.OWNER),
  controller.create
)
router.route("/:id")
  .get(controller.findById)
  .put(
    requireLogin,
    // requireMemberRole("menuItem", MemberRole.ADMIN, MemberRole.MODERATOR, MemberRole.OWNER),
    controller.updateById
  )
  .delete(
    requireLogin,
    // requireMemberRole("menuItem", MemberRole.ADMIN, MemberRole.MODERATOR, MemberRole.OWNER),
    controller.deleteById
  )

export default router
