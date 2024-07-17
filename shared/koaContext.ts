import { Knex } from "knex"
import { ParameterizedContext } from "koa"

export type SonodaState = {
  trx?: Knex.Transaction
  user?: string
}

export type Context = ParameterizedContext<SonodaState>