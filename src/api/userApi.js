import { apiRequest } from './apiClient'

export function getCurrentUser() {
  return apiRequest('/users/me')
}

export function updateNickname(nickname) {
  return apiRequest('/users/me', {
    method: 'PATCH',

    body: {
      nickname,
    },
  })
}
