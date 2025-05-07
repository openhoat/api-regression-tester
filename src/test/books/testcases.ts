import type { Book } from '../../server/legacy/api/books'
import type { ApiRequest, ApiResponse } from '../../util/http.helper'

// biome-ignore lint/suspicious/noExplicitAny: Special case
export type Store = Map<string, any>

export interface ServerRequestTestCase {
  request: ApiRequest
  response?: ApiResponse
  before?: (data: { store: Store; request: ApiRequest }) => void
  after?: (data: {
    store: Store
    request: ApiRequest
    response: ApiResponse
  }) => void
}

export interface Testcase {
  name: string
  legacy: ServerRequestTestCase
  actual?: ServerRequestTestCase
}

export const testcases: Testcase[] = [
  {
    name: 'GET books',
    legacy: {
      request: { method: 'GET', path: '/api/books' },
      after: ({ store, response }) => {
        store.set('books', response.data)
      },
    },
  },
  {
    name: 'GET a book',
    legacy: {
      request: {
        method: 'GET',
        path: '/api/books/{bookId}',
      },
      before: ({ store, request }) => {
        const bookId = (store.get('books') as Book[] | undefined)?.[0].id
        if (bookId) {
          request.path = request.path.replace('{bookId}', bookId)
        }
      },
    },
    actual: {
      request: {
        method: 'GET',
        path: '/api/books/{bookId}',
      },
      before: ({ store, request }) => {
        const bookId = (store.get('books') as Book[] | undefined)?.[1].id
        if (bookId) {
          console.log('bookId:', bookId)
          request.path = request.path.replace('{bookId}', bookId)
        }
      },
    },
  },
  {
    name: 'GET a book given a title',
    legacy: {
      request: {
        method: 'GET',
        path: '/api/books',
        params: { title: 'Le Petit Prince' },
      },
    },
  },
]
