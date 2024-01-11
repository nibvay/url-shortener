import { type NextFunction, Request, Response } from "express";
import signale from "signale";
import CustomError from "../utils/CustomError";

const { PROCESS_MODE } = process.env;

function errorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
  if (PROCESS_MODE === "dev") {
    signale.fatal(error);
  }

  if (error instanceof CustomError) {
    return res.status(error.status || 500).json({
      message: error.message || "Internal server error",
    });
  }

  return res.status(500).json({ message: "Something went wrong" });
}

export default errorHandler;
