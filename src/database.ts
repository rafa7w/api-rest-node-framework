import 'dotenv/config' 
import { knex as setupKnex, Knex } from 'knex'

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL env not found')
}

export const config: Knex.Config = {
    // Informações obrigatórios
    client: 'sqlite',
    // para conexões com outros bancos, ver a documentação
    connection: {
        filename: process.env.DATABASE_URL,
    },
    useNullAsDefault: true,
    migrations: {
        extension: 'ts',
        directory: './db/migrations',
    }
}

export const knex = setupKnex(config)