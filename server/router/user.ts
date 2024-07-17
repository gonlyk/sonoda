import Router from "@koa/router";
import { SonodaUserService } from "../service/user";
import Result, { ResultCode } from "../utils/result";
import { isNullOrUndefined } from "../utils/util";

const userService = new SonodaUserService
const router = new Router({
  prefix: '/user'
})
router.use()

router.get('/', async ctx => {
  const { page, pageSize } = ctx.query
  const p = page ? Number(page) : 1
  const ps = pageSize ? Number(pageSize) : 10
  const users = await userService.getUsers(ctx)(p, ps)
  ctx.body = Result.success(users)
})

router.post('/', async ctx => {
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

router.post('/:id', async ctx => {
  const { id, nickname, password } = ctx.request.body || {} as any
  if (!id) {
    ctx.body = Result.fail(ResultCode.PARAM_REQUIRE, null, 'param id required')
    return
  }
  const user = await userService.updateUser(ctx)(Number(id), nickname, password)
  ctx.body = Result.success(user)
})

export default router
