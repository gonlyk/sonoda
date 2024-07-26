import Router from "@koa/router";
import userRouter from './user'
import tableRouter from './table'
import customTableRouter from './customTable'
import { NextServer } from "next/dist/server/next";

export function apiRouter() {
    const router = new Router({
        prefix: '/api'
    })
    router.use(userRouter.routes())
    router.use(tableRouter.routes())
    router.use(customTableRouter.routes())
    return router
}

export function pageRouter(app: NextServer) {
    const router = new Router()
    router.get('/table/create', async ctx => {
        await app.render(ctx.req, ctx.res, '/table/create')
        // ctx.res.write('123')
        // ctx.res.end();
        ctx.respond = false
    })
    router.get('/table/list/:table', async ctx => {
        await app.render(ctx.req, ctx.res, '/table/[table]', { table: ctx.params.table })
    })
    return router
}