import { apiRequest, ApiError } from './apiClient'
import { getCurrentUser } from './userApi'

import { getAccessToken, removeAccessToken, saveAccessToken } from '../auth/tokenStorage'

export function createGuestSession() {
  return apiRequest('/sessions', {
    method: 'POST',
    auth: false,
  })
}

export async function ensureGuestSession() {
  const savedAccessToken = getAccessToken()

  if (savedAccessToken) {
    try {
      const user = await getCurrentUser()

      return {
        accessToken: savedAccessToken,
        user,
        nextStep: user.nextStep,
        isNewSession: false,
      }
    } catch (error) {
      if (!(error instanceof ApiError) || error.status !== 401) {
        throw error
      }

      removeAccessToken()
    }
  }

  const session = await createGuestSession()

  saveAccessToken(session.accessToken)

  return {
    ...session,
    isNewSession: true,
  }
}
