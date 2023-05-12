import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function transactionsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request, reply) => {
    // tudo aqui fica valendo apenas para o plugin de transações
  })

  app.get('/', {
    preHandler: [checkSessionIdExists],
  }, async (request, reply) => {
    const { sessionId } = request.cookies

    const transactions = await knex('transactions')
      .where('session_id', sessionId)
      .select()

    // retornando como objeto deixa mais flexível para enviar outros dados juntos
    return {transactions}
  })

  app.get('/:id', {
    preHandler: [checkSessionIdExists],
  }, async (request) => {
    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getTransactionParamsSchema.parse(request.params)

    const { sessionId } = request.cookies

    const transaction = await knex('transactions')
      .where({
        session_id: sessionId,
        id,
      })
      .first()

    return { transaction }
  })

  app.get('/summary', {
    preHandler: [checkSessionIdExists],
  }, async (request) => {
    const { sessionId } = request.cookies
    const summary = await knex('transactions')
      .where('session_id', sessionId)
      .sum('amount', {as:'amount'})
      .first()

    return { summary }
  })

  app.post('/', async (request, reply) => {

    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit'])
    })

    // validando os dados do request.body para ver se batem com o schema definido
    const { title, amount, type } = createTransactionBodySchema.parse(request.body)
    // nada aqui embaixo vai executar se não passar o parse, pois dá um throw no erro

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      reply.cookie('sessionId', sessionId, {
        // quais endereços esse cookie vai estar disponível
        // quais rotas do backend vão poder acessar esse cookie
        path: '/', // / qualquer rota pode acessar 
        maxAge: 1000 * 60 * 60 * 24 * 7, // passa em ms o tempo que o cookie deve durar no navegador do usuário
      })
    }

    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId
    })

    // em rotas criação dentro da nossa API, geralmente não se faz retornos
    return reply.status(201).send()
  })
}