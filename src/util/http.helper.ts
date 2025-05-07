import axios from 'axios'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export interface ApiRequest {
  method: HttpMethod
  path: string
  basicAuth?: {
    username: string
    password: string
  }
  headers?: Record<string, string>
  body?: unknown
  params?: Record<string, unknown>
}

export interface ApiResponse<T = unknown> {
  status: number
  data: T
}

export const sendRequest = async <T = unknown>(
  req: ApiRequest,
  options?: { baseUrl?: string; timeout?: number },
): Promise<ApiResponse<T>> => {
  const { data, status } = await axios({
    auth: req.basicAuth,
    baseURL: options?.baseUrl,
    method: req.method,
    params: req.params,
    url: req.path,
    headers: req.headers || {},
    data: req.body || null,
    validateStatus: () => true,
    timeout: options?.timeout ?? 5000,
  })
  return { status, data }
}
