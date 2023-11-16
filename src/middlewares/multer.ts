import multer from "multer"
import httpStatus from "http-status"
import ApiError from "@/utils/api-error"

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "public/")
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
    cb(null, `${file.fieldname}-${uniqueSuffix}.${file.mimetype.split("/")[1]}`)
  }
})

export default multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB
  },
  fileFilter(_req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new ApiError(httpStatus.BAD_REQUEST, "Please upload a JPG/JPEG/PNG file"))
    }
    cb(null, true)
  }
})
