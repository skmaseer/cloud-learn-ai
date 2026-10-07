export type CloudLearnUser = {
  name: string
  registerNumber: string
  email: string
  password: string
}

const USER_KEY = 'cloudlearn_user'
const SESSION_KEY = 'cloudlearn_session'

export function getUser(): CloudLearnUser | null {
  if (typeof window === 'undefined') {
    return null
  }

  const storedUser = localStorage.getItem(USER_KEY)

  if (!storedUser) {
    return null
  }

  try {
    return JSON.parse(storedUser) as CloudLearnUser
  } catch {
    return null
  }
}

export function registerUser(user: CloudLearnUser) {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function loginUser(
  email: string,
  password: string
): boolean {
  const user = getUser()

  if (!user) {
    return false
  }

  if (user.email !== email || user.password !== password) {
    return false
  }

  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      email: user.email,
    })
  )

  return true
}

export function isLoggedIn(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  return localStorage.getItem(SESSION_KEY) !== null
}

export function logoutUser() {
  localStorage.removeItem(SESSION_KEY)
}