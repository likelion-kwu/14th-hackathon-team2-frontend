import { apiRequest } from './apiClient'

export function getCompetitionLeaderboard(month) {
  const searchParams = new URLSearchParams({
    month,
  })

  return apiRequest(`/competition/leaderboard?${searchParams.toString()}`)
}
