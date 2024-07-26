import * as path from 'path'
import * as fs from 'fs'

export type Config = {
    dbUser: string
    dbPassword: string
    dbDatabase: string
    dbHost: string
    dbPort: number
    dbPrefix?: string
    initDbWhenStart?: boolean
}

function readConfig(): Config {
    const defaultConfig: Config = {
        dbUser: '',
        dbPassword: '',
        dbDatabase: '',
        dbHost: 'localhost',
        dbPort: 5432,
        dbPrefix: 'sonoda',
        initDbWhenStart: false
    }

    try {
        const configFilePath = path.resolve(process.cwd(), 'sonoda.config.ts')
        // const config = JSON.parse(fs.readFileSync(configFilePath, 'utf-8'))
        const config = require(configFilePath).default
        return Object.assign({}, defaultConfig, config)
    } catch {

    }
    return defaultConfig
}

let config: Config
export function getConfig() {
    if (config) {
        return config
    }
    config = readConfig()
    return config
}