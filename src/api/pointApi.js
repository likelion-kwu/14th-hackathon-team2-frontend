import { apiRequest } from './apiClient'

export function claimRoutinePoint(dailyRoutineId) {
  return apiRequest(`/daily-routines/${dailyRoutineId}/point-claim`, {
    method: 'POST',
  })
}
