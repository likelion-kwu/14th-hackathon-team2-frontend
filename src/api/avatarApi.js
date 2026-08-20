import { apiRequest } from './apiClient'

export function createAvatar({ growthTrack, facePhoto }) {
  const formData = new FormData()

  formData.append('growthTrack', growthTrack)

  if (facePhoto) {
    formData.append('facePhoto', facePhoto)
  }

  return apiRequest('/avatars/me', {
    method: 'PUT',
    body: formData,
  })
}
export function getAvatarImage() {
  return apiRequest('/avatars/me/image', {
    responseType: 'blob',
  })
}
