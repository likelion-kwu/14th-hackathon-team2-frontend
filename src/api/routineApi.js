import { apiRequest } from './apiClient'

export const ROUTINE_RECOMMENDATION_CATEGORIES = ['SKIN', 'WELL_BEING', 'HEALTH_FIT', 'DIET']

export function getVerificationObjects() {
  return apiRequest('/verification-objects')
}

export function getRoutineRecommendations(category) {
  const searchParams = new URLSearchParams({ category })

  return apiRequest(`/routine-recommendations?${searchParams.toString()}`)
}

export function createRoutine(routine) {
  return apiRequest('/routines', {
    method: 'POST',
    body: routine,
  })
}
