import * as Koa from "koa";

declare module "koa" {
  interface Request {
      body?: null | Record<string, any>;
      rawBody: string;
  }
}