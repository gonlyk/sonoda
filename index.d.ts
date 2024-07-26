import * as Koa from "koa";
import * as http from "http";

declare module "koa" {
  interface Request {
      body?: null | Record<string, any>;
      rawBody: string;
  }
}

declare module "http" {
  interface IncomingMessage {
    state?: any
  }
}