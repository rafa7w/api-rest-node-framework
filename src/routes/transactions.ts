import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'

export async function transactionsRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {

    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit'])
    })

    // validando os dados do request.body para ver se batem com o schema definido
    const { title, amount, type } = createTransactionBodySchema.parse(request.body)
    // nada aqui embaixo vai executar se não passar o parse, pois dá um throw no erro

    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
    })

    // em rotas criação dentro da nossa API, geralmente não se faz retornos
    return reply.status(201).send()
  })
}