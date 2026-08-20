import { apiRequest } from './apiClient'

export function getPhotoMission(dailyRoutineId) {
  return apiRequest(`/daily-routines/${dailyRoutineId}/photo-mission`, {
    method: 'POST',
  })
}

export function verifyRoutinePhoto(dailyRoutineId, photo) {
  const formData = new FormData()

  formData.append('photo', photo, photo.name ?? 'routine-verification.jpg')

  return apiRequest(`/daily-routines/${dailyRoutineId}/verifications/photo`, {
    method: 'POST',
    body: formData,
  })
}

export function verifyRoutineCheck(dailyRoutineId) {
  return apiRequest(`/daily-routines/${dailyRoutineId}/verifications/check`, {
    method: 'POST',
  })
}
