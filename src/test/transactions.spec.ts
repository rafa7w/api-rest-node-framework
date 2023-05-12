import { it, test, beforeAll, afterAll, describe, expect, beforeEach } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest' 
import { app } from '../app'

describe('Transactions routes', () => {
  // executar um código antes que todos os testes executem uma única vez
  // no vitest temos também o beforeEah, afterAll e afterEach
  beforeAll(async () => {
    await app.ready()
  })
  
  afterAll(async () => {
    // remover a aplicação da memória
    await app.close()
  })

  beforeEach(() => {
    // conseguimos executar comandos no terminal por dentro da aplicação node
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })
  
  test('user can create a new transaction', async () => {
    /* const response = await request(app.server)
      .post('transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit'
      })
  
    expect(response.statusCode).toEqual(201) */
  
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit'
      }).expect(201)
  })

  it('should be able to list all transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit'
      }).expect(201)

    const cookies = createTransactionResponse.get('Set-Cookie')
    
    const listTransactionResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies) // o set é usado para configurar um cabeçalho da requisição
      .expect(200)

    expect(listTransactionResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'New transaction',
        amount: 5000,
      })
    ])
  })

  it('should be able to get a specific transaction', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit'
      })

    const cookies = createTransactionResponse.get('Set-Cookie')
    
    const listTransactionResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies) 
      .expect(200)

    const transactionId = listTransactionResponse.body.transactions[0].id

    const getTransactionResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(getTransactionResponse.body.transaction).toEqual(
      expect.objectContaining({
        title: 'New transaction',
        amount: 5000,
      }),
    )
  })

  it('should be able to get the summary', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Credit transaction',
        amount: 5000,
        type: 'credit'
      }).expect(201)

    const cookies = createTransactionResponse.get('Set-Cookie')

    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookies)
      .send({
        title: 'Debit transaction',
        amount: 2000,
        type: 'debit'
      }).expect(201)
    
    const summaryReponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies) // o set é usado para configurar um cabeçalho da requisição
      .expect(200)

    expect(summaryReponse.body.summary).toEqual({
      amount: 3000
    })
  })
})
