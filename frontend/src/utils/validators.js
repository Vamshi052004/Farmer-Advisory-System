export function isValidMobile(number) {
  const mobileRegex = /^[6-9]\d{9}$/
  return mobileRegex.test(number)
}

export function isNotEmpty(value) {
  return value && value.trim().length > 0
}

export function isValidPassword(password) {
  return password.length >= 6
}