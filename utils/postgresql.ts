import { Context } from "../shared/koaContext";
import { knex } from "../server/db";

export function getNowTimeStamp() {
  return new Date()
}

export async function injectTransaction(ctx: Context) {
  const rtx = await knex.transaction()
  ctx.state.trx = rtx
  return rtx
}

export function getQueryer(ctx: Context) {
  return ctx?.state?.trx || knex
}
