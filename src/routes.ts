import express from "express"

// Routes
import authRoutes from "@/modules/auth/routes"
import categoryRoutes from "@/modules/category/routes"
import organizationRoutes from "@/modules/organization/routes"
import reviewRoutes from "./modules/review/routes"
import ratingRoutes from "@/modules/rating/routes"
import tagRoutes from "@/modules/tag/routes"
import userRoutes from "@/modules/user/routes"
import config from "./utils/config"

const router = express.Router()

router.get("/health", (_req, res) => res.send("OK!"))
router.get("/version", (_req, res) => res.send(config.apiVersion))
router.use("/auth", authRoutes)
router.use("/category", categoryRoutes)
router.use("/organization", organizationRoutes)
router.use("/review", reviewRoutes)
router.use("/rating", ratingRoutes)
router.use("/tag", tagRoutes)
router.use("/user", userRoutes)

export default router
