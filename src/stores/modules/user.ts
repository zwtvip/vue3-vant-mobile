import { defineStore } from 'pinia'
import type { LoginData, UserState } from '@/api/user'
import { getEmailCode, getUserInfo, resetPassword, login as userLogin, logout as userLogout } from '@/api/user'
import { clearToken, setToken } from '@/utils/auth'

const InitUserInfo = {
  uid: 0,
  nickname: '',
  avatar: '',
}

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<UserState>({ ...InitUserInfo })

  // Set user's information
  const setInfo = (partial: Partial<UserState>) => {
    userInfo.value = { ...partial }
  }

  const login = async (loginForm: LoginData) => {
    try {
      const { data } = await userLogin(loginForm)
      setToken(data.token)
    }
    catch (error) {
      clearToken()
      throw error
    }
  }

  const info = async () => {
    try {
      const { data } = await getUserInfo()
      setInfo(data)
    }
    catch (error) {
      clearToken()
      throw error
    }
  }

  const logout = async () => {
    try {
      await userLogout()
    }
    finally {
      clearToken()
      setInfo({ ...InitUserInfo })
    }
  }

  const getCode = async () => {
    try {
      const data = await getEmailCode()
      return data
    }
    catch {}
  }

  const reset = async () => {
    try {
      const data = await resetPassword()
      return data
    }
    catch {}
  }

  return {
    userInfo,
    info,
    login,
    logout,
    getCode,
    reset,
  }
}, {
  persist: true,
})

export default useUserStore
