const ACCESS_TOKEN_KEY = 'godsaeng_access_token'

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function saveAccessToken(accessToken) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
}

export function removeAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
}
