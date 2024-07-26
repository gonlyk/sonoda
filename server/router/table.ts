import Router from "@koa/router";
import Result, { ResultCode } from "../../utils/result";
import { SonodaTableService } from "../service/table";
import { knex } from "../db";
import { SonodaTable } from "../model/table";
import { injectTransaction } from "../../utils/postgresql";
import { SonodaColumn } from "../model/column";
import { SonodaUserTable } from "../model/userTable";
import { UserTablePermission } from "../../shared/constant";

const tableService = new SonodaTableService
const router = new Router({
  prefix: '/table'
})

router.get('/list', async ctx => {
  const { page, pageSize } = ctx.query
  const p = page ? Number(page) : 1
  const ps = pageSize ? Number(pageSize) : 10
  const [tables, count] = await tableService.getTables(ctx)(p, ps)
  ctx.body = Result.list(p, ps, count, tables)
})

router.post('/create', async ctx => {
  const { base, columns } = ctx.request.body as {
    base: {
      name: string,
      title: string,
      comment: string,
    },
    columns: SonodaColumn[]
  }
  if (!base.name || !base.title || !columns) {
    ctx.body = Result.fail(ResultCode.PARAM_REQUIRE, null, 'param name or password required')
    return
  }
  const rtx = await injectTransaction(ctx)
  try {
    const table = await tableService.createTable(ctx)(base, columns)
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

router.post('/update', async ctx => {
  const { id, comment, title, columns } = ctx.request.body as {
    id?: number,
    comment?: string,
    title?: string,
    columns?: SonodaColumn[]
  }
  if (!id) {
    ctx.body = Result.fail(ResultCode.PARAM_REQUIRE, null, 'param id required')
    return
  }

  const rtx = await injectTransaction(ctx)
  try {
    const table = await tableService.updateTable(ctx)(id, comment, title, columns)
    await rtx.commit()
    ctx.body = Result.success(table)
  } catch (e) {
    console.error(e)
    rtx.rollback()
    throw e
  }
})

router.post('/user/update', async ctx => {
  const { id, users } = ctx.request.body as {
    id?: number,
    users?: [(number | string), UserTablePermission][]
  }
  if (!id || !users) {
    ctx.body = Result.fail(ResultCode.PARAM_REQUIRE, null, 'param id and permission required')
    return
  }

  if (users.length === 0) {
    ctx.body = Result.fail(ResultCode.PARAM_INVALID, null, 'param permission at least length 1')
    return
  }

  const rtx = await injectTransaction(ctx)
  try {
    await tableService.updateTablePerimssion(ctx)(id, users)
    await rtx.commit()
    ctx.body = Result.success()
  } catch (e) {
    console.error(e)
    rtx.rollback()
    throw e
  }
})

export default router
