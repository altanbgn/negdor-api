import { Request, Response, NextFunction, RequestHandler } from "express"

export type CustomParamsDictionary = {
  [key: string]: any
}

const catchAsync =
  (
    fn: RequestHandler<CustomParamsDictionary,
    any,
    any,
    qs.ParsedQs,
    Record<string, any>>
  ) =>
  (
    req: Request<CustomParamsDictionary, any, any, any, Record<string, any>>,
    res: Response<any, Record<string, any>>,
    next: NextFunction
  ) => Promise.resolve(fn(req, res, next)).catch((err) => next(err))


export default catchAsync
