import express from "express"

// Routes
import { verifyLogin } from "@/middlewares/permission"
import config from "./utils/config"
import authRoutes from "@/modules/auth/routes"
import categoryRoutes from "@/modules/category/routes"
import contentRoutes from "@/modules/content/routes"
import featureRoutes from "@/modules/feature/routes"
import fileRoutes from "@/modules/file/routes"
import menuRoutes from "@/modules/menu/routes"
import menuItemRoutes from "@/modules/menu-item/routes"
import organizationRoutes from "@/modules/organization/routes"
import reviewRoutes from "./modules/review/routes"
import ratingRoutes from "@/modules/rating/routes"
import tagRoutes from "@/modules/tag/routes"
import timeTableRoutes from "@/modules/time-table/routes"
import userRoutes from "@/modules/user/routes"

const router = express.Router()

router.get("/health", (_req, res) => res.send("OK!"))
router.get("/version", (_req, res) => res.send(config.apiVersion))

router.use(verifyLogin)

router.use("/auth", authRoutes)
router.use("/category", categoryRoutes)
router.use("/content", contentRoutes)
router.use("/feature", featureRoutes)
router.use("/file", fileRoutes)
router.use("/menu", menuRoutes)
router.use("/menu-item", menuItemRoutes)
router.use("/organization", organizationRoutes)
router.use("/review", reviewRoutes)
router.use("/rating", ratingRoutes)
router.use("/tag", tagRoutes)
router.use("/time-table", timeTableRoutes)
router.use("/user", userRoutes)

export default router
