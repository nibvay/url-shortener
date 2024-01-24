import { type NextFunction, Response } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

import { type ExtendedRequest } from "../types/extendedTypes";
import CustomError from "../utils/CustomError";

function authenticate(req: ExtendedRequest, res: Response, next: NextFunction) {
  try {
    passport.authenticate("jwt", (error: Error, user, info) => {
      // console.error("[authenticate]", error);
      // console.error("[authenticate] info", info);
      if (error) return next(error);
      if (!user && info instanceof jwt.TokenExpiredError) {
        throw new CustomError({ message: "token expired", status: 401 });
      }
      if (!user) {
        throw new CustomError({ message: "no user", status: 401 });
      }
      req.user = user;
      return next();
    })(req, res, next);
  } catch (e) {
    next(e);
  }
}

export default authenticate;
