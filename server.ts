import 'reflect-metadata'
import bodyparser from 'koa-bodyparser'
import { getConfig } from "./utils/readConfig";
import { initDb } from "./server/db";
import { dev } from "./utils/env";
import Koa from 'koa'
import { apiRouter } from "./server/router";
import Result, { ResultCode } from './utils/result';
import { NoPermissionError } from './server/exception';
import cors from '@koa/cors'

const port = parseInt(process.env.PORT || "3000", 10);
async function initServer() {
  if (getConfig().initDbWhenStart) {
    await initDb()
  }
  const server = new Koa
  const api = apiRouter()
  server.use(async (ctx, next) => {
    try {
      ctx.status = 200
      ctx.state.user = 'system'
      await next()
    } catch (e: any) {
      if (e instanceof NoPermissionError) {
        ctx.status = 401
      } else {
        ctx.status = 500
      }
      ctx.body = Result.fail(ResultCode.SERVER_ERROR, null, e?.toString() || 'server error')
    }
  })
  server.use(cors());
  server.use(bodyparser())

  server.use(api.routes())
  server.use(api.allowedMethods())
  server.listen(port, () => {
    console.log(
      `> Server listening at http://localhost:${port} as ${dev ? "development" : process.env.NODE_ENV
      }`,
    );
  });
}

initServer()