import { test, beforeAll, afterAll, describe } from 'vitest'
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
})
