import { type Request } from "express";

type UrlInfo = {
  originUrl: string,
  urlId: string,
  shortUrl: string,
  clickCount?: number,
  date: number,
}

export type UserInfo = {
  _id: string,
  userId: string,
  name: string,
  password?: string,
  email: string,
  urlList?: UrlInfo[],
}
export type ExtendedRequest = Request & { user?: UserInfo };
