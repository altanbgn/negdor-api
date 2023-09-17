import nodemailer from "nodemailer"
import config from "@/utils/config"

export default nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.mailerUser,
    pass: config.mailerPass
  },
})
