import nodemailer from "nodemailer"

export default nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "altanbagana605@gmail.com",
    pass: "uqfjowrgukrniydm"
  },
})
