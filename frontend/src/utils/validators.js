export function isValidMobile(number) {
  if (!number) return false;
  const mobileRegex = /^[6-9]\d{9}$/;
  return mobileRegex.test(number.trim());
}

export function isNotEmpty(value) {
  return value?.trim().length > 0;
}

export function isValidPassword(password) {
  return password && password.length >= 6;
}