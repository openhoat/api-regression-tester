import axios from 'axios'
import type { ApiRequest, ApiResponse } from '../types'

export const sendRequest = async <T = unknown>(
  baseUrl: string,
  req: ApiRequest,
  options?: { timeout?: number },
): Promise<ApiResponse<T>> => {
  const { data, status } = await axios({
    baseURL: baseUrl,
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
