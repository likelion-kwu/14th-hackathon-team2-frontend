import { apiRequest } from './apiClient'

export function getSpeechStylePresets() {
  return apiRequest('/speech-style/presets')
}

export function activateSpeechStylePreset(presetCode) {
  return apiRequest('/speech-style/preset', {
    method: 'POST',
    body: {
      presetCode,
    },
  })
}

export function updateSpeechStyle(settings) {
  return apiRequest('/speech-style', {
    method: 'PATCH',
    body: settings,
  })
}
