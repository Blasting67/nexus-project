import { USER_ENDPOINTS } from '../config/api'

export interface BackendUser {
  id: number
  name: string
  username: string
  email: string
  role: string
  is_active: number | boolean
  avatar: string | null
  bio?: string | null
  theme?: string
  created_at: string
  updated_at?: string
}

export interface BackendResponse<T = unknown> {
  success: boolean
  message?: string
  error?: string
  data?: T
  details?: unknown
}

async function userRequest<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options?.headers,
    },
  })

  const json: BackendResponse<T> = await res.json().catch(() => ({
    success: false,
    error: `${res.status} ${res.statusText}`,
  }))

  if (!res.ok || json.success === false) {
    const errorMsg = json.error || json.message || `Error del servidor (${res.status})`
    throw new Error(errorMsg)
  }

  return (json.data ?? json) as T
}

export const userService = {
  createUser: async (payload: {
    name: string
    username: string
    email: string
    password: string
    avatar?: string | null
  }): Promise<BackendUser> => {
    return userRequest<BackendUser>(USER_ENDPOINTS.USERS, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  loginUser: async (payload: {
    identifier: string
    password: string
  }): Promise<BackendUser> => {
    return userRequest<BackendUser>(USER_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  getUser: async (id: number | string): Promise<BackendUser> => {
    return userRequest<BackendUser>(USER_ENDPOINTS.USER_DETAIL(id))
  },

  listUsers: async (): Promise<BackendUser[]> => {
    return userRequest<BackendUser[]>(USER_ENDPOINTS.USERS)
  },

  checkHealth: async (): Promise<{ status: string; database: string }> => {
    return userRequest<{ status: string; database: string }>(USER_ENDPOINTS.HEALTH)
  },
}
