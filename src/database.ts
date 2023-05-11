import { knex as setupKnex } from 'knex'

export const knex = setupKnex({
    // Informações obrigatórios
    client: 'sqlite',
    // para conexões com outros bancos, ver a documentação
    connection: {
        filename: './tmp/app.db'
    },
})