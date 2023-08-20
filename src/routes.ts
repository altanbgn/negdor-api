import express from "express"

// Routes
// import authRoutes from "@/modules/auth/auth.routes"
// import categoryRoutes from "@/modules/category/category.routes"
// import organizationRoutes from "@/modules/organization/organization.routes"
// import reviewRoutes from "./modules/review/review.routes"
// import ratingRoutes from "@/modules/rating/rating.routes"
// import tagRoutes from "@/modules/tag/tag.routes"
// import userRoutes from "@/modules/user/user.routes"
import config from "./utils/config"

const router = express.Router()

router.get("/health", (_req, res) => res.send("OK!"))
router.get("/version", (_req, res) => res.send(config.apiVersion))
// router.use("/auth", authRoutes)
// router.use("/category", categoryRoutes)
// router.use("/organization", organizationRoutes)
// router.use("/review", reviewRoutes)
// router.use("/rating", ratingRoutes)
// router.use("/tag", tagRoutes)
// router.use("/user", userRoutes)

export default router
