import { apiRequest } from './apiClient'

export function getStories() {
  return apiRequest('/stories')
}
