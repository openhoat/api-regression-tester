export interface ApiRequest {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  path: string
  headers?: Record<string, string>
  body?: unknown
  params?: Record<string, unknown>
}

export interface ApiResponse<T = unknown> {
  status: number
  data: T
}

export interface Service {
  start: () => Promise<void>
  stop: () => Promise<void>
}
