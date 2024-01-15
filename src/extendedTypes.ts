import { type Request } from "express";

export type ExtendedRequest = Request & { user?: Record<string, unknown> };
