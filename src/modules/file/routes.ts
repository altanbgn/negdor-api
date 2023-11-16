import { Router } from "express"

// Locals
import FileController from "./controller"
import { requireLogin } from "@/middlewares/permission"
import multer from "@/middlewares/multer"

const router = Router()
const controller = new FileController()

router.post(
  "/upload/single",
  requireLogin,
  multer.single("file"),
  controller.uploadSingle
)
router.post(
  "/upload/multiple",
  requireLogin,
  multer.array("files"),
  controller.uploadMultiple
)

export default router
