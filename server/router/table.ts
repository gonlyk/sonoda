import Router from "@koa/router";
import Result, { ResultCode } from "../utils/result";
import { SonodaTableService } from "../service/table";
import { knex } from "../db";
import { SonodaTable } from "../model/table";
import { injectTransaction } from "../utils/postgresql";
import { SonodaColumn } from "../model/column";

const tableService = new SonodaTableService
const router = new Router({
  prefix: '/table'
})
router.use()

router.get('/', async ctx => {
  const { page, pageSize } = ctx.query
  const p = page ? Number(page) : 1
  const ps = pageSize ? Number(pageSize) : 10
  const users = await tableService.geTables(ctx)(p, ps)
  ctx.body = Result.success(users)
})

router.post('/', async ctx => {
  const { name, title, columns } = ctx.request.body as {
    name?: string,
    title?: string,
    columns?: SonodaColumn[]
  }
  if (!name || !title || !columns) {
    ctx.body = Result.fail(ResultCode.PARAM_REQUIRE, null, 'param name or password required')
    return
  }
  const rtx = await injectTransaction(ctx)
  try {
    const table = await tableService.createTable(ctx)(name, title, columns)
    await rtx.commit()
    ctx.body = Result.success(table)
  } catch (e) {
    console.error(e)
    rtx.rollback()
    throw e
  }
})

router.get('/id/:id', async ctx => {
  const id = ctx.params.id
  if (!id) {
    ctx.body = Result.fail(ResultCode.PARAM_REQUIRE, null, 'param id required')
    return
  }
  const table = await tableService.getTable(ctx)(Number(id))
  ctx.body = Result.success(table)
})

router.get('/name/:name', async ctx => {
  const name = ctx.params.name
  if (!name) {
    ctx.body = Result.fail(ResultCode.PARAM_REQUIRE, null, 'param id required')
    return
  }
  const table = await tableService.getTableByName(ctx)(name)
  ctx.body = Result.success(table)
})

router.post('/:id', async ctx => {
  const { id, name, title, columns } = ctx.request.body as {
    id?: number,
    name?: string,
    title?: string,
    columns?: SonodaColumn[]
  }
  if (!id) {
    ctx.body = Result.fail(ResultCode.PARAM_REQUIRE, null, 'param id required')
    return
  }
  const user = await tableService.updateTable(ctx)(id, name, title, columns)
  ctx.body = Result.success(user)
})

export default router
