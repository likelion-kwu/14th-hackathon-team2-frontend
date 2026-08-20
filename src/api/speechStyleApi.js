import { apiRequest } from './apiClient'

export function getSpeechStyle() {
  return apiRequest('/speech-style')
}

export function updateSpeechStyle(settings) {
  return apiRequest('/speech-style', {
    method: 'PATCH',
    body: settings,
  })
}

export function createKakaoSpeechStyleJob(file) {
  const formData = new FormData()

  formData.append('file', file)

  return apiRequest('/speech-style/kakao/jobs', {
    method: 'POST',
    body: formData,
  })
}

export function analyzeKakaoSpeechStyleJob(jobId, participantId) {
  return apiRequest(`/speech-style/kakao/jobs/${jobId}/analyze`, {
    method: 'POST',
    body: {
      participantId,
    },
  })
}

export function getKakaoSpeechStyleJob(jobId) {
  return apiRequest(`/speech-style/kakao/jobs/${jobId}`)
}
