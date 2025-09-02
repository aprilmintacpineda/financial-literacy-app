export function getEmailVerificationCodeExpiresAt() {
  // 15 minutes from now
  return new Date(Date.now() + 15 * 60 * 1000);
}

export function getEmailVerificationCodeCanSentAt() {
  // 2 minutes from now
  return new Date(Date.now() + 2 * 60 * 1000);
}

export function getChangePasswordVerificationCodeExpiresAt() {
  // 15 minutes from now
  return new Date(Date.now() + 15 * 60 * 1000);
}

export function getChangePasswordVerificationCodeCanSentAt() {
  // 2 minutes from now
  return new Date(Date.now() + 2 * 60 * 1000);
}
