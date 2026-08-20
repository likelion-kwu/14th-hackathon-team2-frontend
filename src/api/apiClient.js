import { getAccessToken } from '../auth/tokenStorage'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export class ApiError extends Error {
  constructor({ message, status = 0, code = 'UNKNOWN_ERROR', details = [] }) {
    super(message)

    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
  }
}

function createRequestUrl(path) {
  const baseUrl = API_BASE_URL.replace(/\/$/, '')
  const endpoint = path.replace(/^\//, '')

  return `${baseUrl}/${endpoint}`
}

async function parseResponse(response) {
  if (response.status === 204) {
    return null
  }

  const responseText = await response.text()

  if (!responseText) {
    return null
  }

  try {
    return JSON.parse(responseText)
  } catch {
    return responseText
  }
}

export async function apiRequest(
  path,
  { method = 'GET', body, headers = {}, auth = true, ...options } = {},
) {
  const requestHeaders = new Headers(headers)

  let requestBody = body

  if (auth) {
    const accessToken = getAccessToken()

    if (!accessToken) {
      throw new ApiError({
        status: 401,
        code: 'UNAUTHORIZED',
        message: '저장된 사용자 정보가 없습니다.',
      })
    }

    requestHeaders.set('Authorization', `Bearer ${accessToken}`)
  }

  if (body != null && !(body instanceof FormData) && typeof body === 'object') {
    requestHeaders.set('Content-Type', 'application/json')
    requestBody = JSON.stringify(body)
  }

  let response

  try {
    response = await fetch(createRequestUrl(path), {
      method,
      headers: requestHeaders,
      body: requestBody,
      ...options,
    })
  } catch {
    throw new ApiError({
      code: 'NETWORK_ERROR',
      message: '서버에 연결하지 못했습니다.',
    })
  }

  const payload = await parseResponse(response)

  if (!response.ok) {
    throw new ApiError({
      status: response.status,
      code: payload?.code ?? 'HTTP_ERROR',
      message: payload?.message ?? '요청을 처리하지 못했습니다.',
      details: payload?.details ?? [],
    })
  }

  return payload?.data ?? payload
}
