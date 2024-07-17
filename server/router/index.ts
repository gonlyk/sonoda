import Router from "@koa/router";
import userRouter from './user'
import tableRouter from './table'

export function apiRouter() {
    const router = new Router({
        prefix: '/api'
    })
    router.use(userRouter.routes())
    router.use(tableRouter.routes())
    return router
}