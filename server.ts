import 'reflect-metadata'
import bodyparser from 'koa-bodyparser'
import next from "next";
import { getConfig } from "./server/utils/readConfig";
import { initDb } from "./server/db";
import { dev } from "./server/utils/env";
import Koa from 'koa'
import { apiRouter } from "./server/router";
import Result, { ResultCode } from './server/utils/result';
import { NoPermissionError } from './server/exception';

const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  if (getConfig().initDbWhenStart) {
    await initDb()
  }
  const server = new Koa
  const api = apiRouter()
  server.use(async (ctx, next) => {
    try {
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
  server.use(bodyparser())

  server.use(api.routes())
  server.use(api.allowedMethods())
  server.use(async ctx => {
    await handle(ctx.req, ctx.res)
    ctx.responed = false
  })
  server.listen(port, () => {
    console.log(
      `> Server listening at http://localhost:${port} as ${
        dev ? "development" : process.env.NODE_ENV
      }`,
    );
  });

}).catch(console.error);

