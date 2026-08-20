import { apiRequest } from './apiClient'

export function getRecords({ fromDate, toDate }) {
  const searchParams = new URLSearchParams({
    fromDate,
    toDate,
  })

  return apiRequest(`/records?${searchParams.toString()}`)
}
