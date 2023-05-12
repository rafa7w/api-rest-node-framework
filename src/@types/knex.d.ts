// eslint-disable-next-line
import { Knex } from 'knex'

// declare module serve para declarar módulos personalizados
declare module 'knex/types/tables' {
  export interface Tables {
    transactions: {
      id: string
      title: string
      amount: number
      created_at: string
      session_id?: string
    }
  }
}