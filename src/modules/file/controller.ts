import { Request, Response } from "express"
import httpStatus from "http-status"

// Locals
import catchAsync from "@/utils/catch-async"
import config from "@/utils/config"

export default class FeatureController {
  uploadSingle = catchAsync(async (req: Request, res: Response): Promise<void> => {
    if (!req.file) {
      res.status(httpStatus.BAD_REQUEST).send({ message: "Please upload a file!" })
      return
    }

    res.status(httpStatus.OK).send({
      data: {
        filename: req.file?.filename,
        mimetype: req.file?.mimetype,
        path: config.appUrl + "/" + req.file?.path,
        size: req.file?.size,
      }
    })
  })

  uploadMultiple = catchAsync(async (req: Request, res: Response): Promise<void> => {
    if (!req.files) {
      res.status(httpStatus.BAD_REQUEST).send({ message: "Please upload a file!" })
      return
    }

    let result: any = []

    Object.keys(req.files).forEach((key) => {
      const file = req.files?.[key]
      result.push({
        filename: file?.filename,
        mimetype: file?.mimetype,
        path: config.appUrl + "/" + file?.path,
        size: file?.size,
      })
    })

    res.status(httpStatus.OK).send({ data: result })
  })
}
