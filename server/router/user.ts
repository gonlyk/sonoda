import Router from "@koa/router";
import { SonodaUserService } from "../service/user";
import Result, { ResultCode } from "../../utils/result";
import { isNullOrUndefined } from "../../utils/util";
import { SonodaTableService } from "../service/table";

const userService = new SonodaUserService
const tableService = new SonodaTableService
const router = new Router({
  prefix: '/user'
})

router.get('/list', async ctx => {
  const { page, pageSize } = ctx.query
  const p = page ? Number(page) : 1
  const ps = pageSize ? Number(pageSize) : 10
  const [users, count] = await userService.getUsers(ctx)(p, ps)
  ctx.body = Result.list(p, ps, count, users)
})

router.post('/create', async ctx => {
  const { name, nickname, password } = ctx.request.body as { 
    name?: string,
    nickname?: string,
    password?: string }
  if (!name || !password) {
    ctx.body = Result.fail(ResultCode.PARAM_REQUIRE, null, 'param name or password required')
    return
  }
  const user = await userService.createUser(ctx)(name, nickname || '', password)
  ctx.body = Result.success(user)
})

router.get('/id/:id', async ctx => {
  const id = ctx.params.id
  if (!id) {
    ctx.body = Result.fail(ResultCode.PARAM_REQUIRE, null, 'param id required')
    return
  }
  const user = await userService.getUser(ctx)(Number(id))
  ctx.body = Result.success(user)
})

router.get('/name/:name', async ctx => {
  const name = ctx.params.name
  if (!name) {
    ctx.body = Result.fail(ResultCode.PARAM_REQUIRE, null, 'param name required')
    return
  }
  const user = await userService.getUserByName(ctx)(name)
  ctx.body = Result.success(user)
})

router.get('/tables', async ctx => {
  const tables = await tableService.getUserTables(ctx)()
  ctx.body = Result.success(tables)
})

router.post('/update', async ctx => {
  const { id, nickname, password, dataActive } = ctx.request.body as {
    id?: number,
    nickname?: string,
    password?: string,
    dataActive?: boolean
  }
  if (!id) {
    ctx.body = Result.fail(ResultCode.PARAM_REQUIRE, null, 'param id required')
    return
  }
  const user = await userService.updateUser(ctx)(Number(id), nickname, password, dataActive)
  ctx.body = Result.success(user)
})

export default router
