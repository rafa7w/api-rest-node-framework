import fastify from 'fastify'
import crypto from 'node:crypto'
import { knex } from './database'

const app = fastify()

app.get('/hello', async () => {
    /* const transaction = await knex('transaction').insert({
        id: crypto.randomUUID(),
        title: 'Transação de teste',
        amount: 1000,
    }).returning('*') */

    // const transactions = await knex('transaction').select('*')

    const transaction = await knex('transaction').where('amount', 1000).select('*')


    return transaction
})

app.listen({
    port: 3333,
}).then(() => {
    console.log('HTTP Server Running!')
})