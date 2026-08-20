import { apiRequest } from './apiClient'

export function getHome() {
  return apiRequest('/home')
}

export function getDailyRoutines() {
  return apiRequest('/daily-routines')
}
