import { apiRequest } from './apiClient'

export function getItems({ type, ownedOnly = false } = {}) {
  const searchParams = new URLSearchParams({
    ownedOnly: String(ownedOnly),
  })

  if (type) {
    searchParams.set('type', type)
  }

  return apiRequest(`/items?${searchParams.toString()}`)
}

export function updateAvatarEquipment(equippedItemIds) {
  return apiRequest('/avatars/me/equipment', {
    method: 'PUT',
    body: {
      equippedItemIds,
    },
  })
}
