import passport from "passport";
import jwt from "jsonwebtoken";
import CustomError from "../utils/CustomError.js";

function authenticate(req, res, next) {
  try {
    passport.authenticate("jwt", (error, user, info) => {
      // console.error("[authenticate]", error);
      // console.error("[authenticate] info", info);
      if (error) return next(error);
      if (!user && info instanceof jwt.TokenExpiredError) throw new CustomError({ message: "token expired", status: 401});
      if (!user) throw new CustomError({ message: "no user", status: 401});
      return next();
    })(req, res, next);
  } catch (e) {
    next(e);
  }
}

export default authenticate;