import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "./catchAsyncErrors";
import ErrorHandler from "../utils/Errorhandler";
import jwt, { JwtPayload } from "jsonwebtoken"
import { updateAccessToken } from "../controllers/user.controller";
import { redis } from "../utils/redis";

export const isAuthenticated = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.headers["access-token"] as string
    if(!access_token){
        return next(
            new ErrorHandler("Please login to access this resource", 400)
        )
    }
    const decoded = jwt.decode(access_token) as JwtPayload
    if(!decoded){
        return next(new ErrorHandler("acess token  is not valid", 400))
    }
    // check if access token is expired
    if(decoded.exp && decoded.exp <= Date.now()/ 1000){
        try {
            await updateAccessToken(req, res, next)
        } catch (error) {
            return next(error)
        }
    } else {
        const user = await redis.get(decoded.id)
        if(!user){
            return next(new ErrorHandler("Please login to access this reources", 400))
        }
        req.user = JSON.parse(user)
        next()
    }
})