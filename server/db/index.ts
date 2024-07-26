import Knex from 'knex'
// @ts-ignore
import plugin from 'knex-case-converter-plugin';
import { getConfig } from '../../utils/readConfig';
import * as fs from 'fs'
import * as path from 'path'
import { dev } from '../../utils/env';

const { dbHost, dbPort, dbUser, dbPassword, dbDatabase, dbPrefix } = getConfig()

export const knex = Knex({
    client: 'pg',
    connection: {
        host: dbHost,
        port: dbPort,
        user: dbUser,
        password: dbPassword,
        database: dbDatabase,
    },
    pool: { min: 0, max: 7 },
    ...plugin
})


export async function initDb() {
    // 初始化默认表
    await initSql()
    await knex.raw(`CALL init_sonoda_database('${dbPrefix}')`)
}

async function initSql() {
    return await knex.transaction(async trx => {
        const sqlDir = path.join(__dirname, dev ? '../../sql' : '../../../sql')
        const files = fs.readdirSync(sqlDir)
        const promises = []
        for (const file of files) {
            if (path.extname(file) === '.pgsql') {
                const sql = fs.readFileSync(path.join(sqlDir, file), 'utf-8')
                promises.push(trx.raw(sql))
            }
        }
        return Promise.all(promises).catch((e) => {
            console.error(e)
            trx.rollback()
        })
    })
}