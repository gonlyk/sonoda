import Router from "@koa/router"
import { SonodaCustomTableService } from "../service/customTable"
import Result, { ResultCode } from "../../utils/result"
import { injectTransaction } from "../../utils/postgresql"

const tableService = new SonodaCustomTableService
const router = new Router({
  prefix: '/custom'
})


router.post('/insert', async ctx => {
  const { tableName, record } = ctx.request.body as {
    tableName?: string,
    record?: any
  }
  if (!tableName || !record) {
    ctx.body = Result.fail(ResultCode.PARAM_REQUIRE, null, 'param tableName and record required')
    return
  }

  const rtx = await injectTransaction(ctx)
  try {
    const rec = await tableService.insertCustomTable(ctx)(tableName, record)
    await rtx.commit()
    ctx.body = Result.success(rec)
  } catch (e) {
    console.error(e)
    rtx.rollback()
    throw e
  }
})

router.get('/select', async ctx => {
  const { tableName, page, pageSize } = ctx.query as {tableName: string, page?: string, pageSize?: string}
  const p = page ? Number(page) : 1
  const ps = pageSize ? Number(pageSize) : 10
  if (!tableName) {
    ctx.body = Result.fail(ResultCode.PARAM_REQUIRE, null, 'param tableName required')
    return
  }

  const rtx = await injectTransaction(ctx)
  try {
    const [records, count] = await tableService.selectCustomTable(ctx)(tableName, p, ps)
    await rtx.commit()
    ctx.body = Result.list(p, ps , count, records)
  } catch (e) {
    console.error(e)
    rtx.rollback()
    throw e
  }
})

export default router