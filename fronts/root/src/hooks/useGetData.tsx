import { useEffect, useState, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../store/store"
import { setUsers } from "../store/slices/tenantStore.slice"
import { authStatus } from "../store/slices/auth.slice"
import type { IUser } from "../pkg/types/user"
import apiUserService from "../pkg/api/api.user.service"
import { useNavigate } from "react-router-dom"

interface UseGetDataReturn {
  isCheckingAuth: boolean
  initialized: boolean
  user: IUser | null
  error: Error | null
  refreshUsers: () => Promise<void>
  refreshAll: () => Promise<void>
}

export const useGetData = (): UseGetDataReturn => {
  const dispatch = useDispatch()
  const navigation = useNavigate()
  const auth = useSelector((s: RootState) => s.auth)

  const [state, setState] = useState<Omit<UseGetDataReturn, 'refreshUsers' | 'refreshAll'>>({
    isCheckingAuth: true,
    initialized: false,
    user: null,
    error: null,
  })

  const refreshUsers = useCallback(async () => {
    try {
      const users = await apiUserService.find()
      dispatch(setUsers({ users }))
    } catch (error) {
      console.error('Failed to refresh posts:', error)
    }
  }, [dispatch])

  const refreshAll = useCallback(async () => {
    await Promise.all([refreshUsers()])
  }, [refreshUsers])

  useEffect(() => {
    if (auth.authStatus === "auth") return
    if (state.initialized) return

    const initializeApp = async () => {
      try {
        const me = await apiUserService.getMyInfo()

        if (me) {
          dispatch(authStatus({ status: "auth", user: me }))
          
          try {
            await Promise.all([refreshUsers()])
          } catch (e) {
            console.error('Failed to load tenant data:', e)
          }

          setState({
            isCheckingAuth: false,
            initialized: true,
            user: me,
            error: null,
          })
          
          const currentPath = window.location.pathname
          if (currentPath === "/login" || currentPath === "/register") {
            navigation("/")
          }
        } else {
          dispatch(authStatus({ status: "notAuth", user: null }))
          setState({
            isCheckingAuth: false,
            initialized: true,
            user: null,
            error: null,
          })
        }
      } catch (error) {
        dispatch(authStatus({ status: "notAuth", user: null }))
        setState({
          isCheckingAuth: false,
          initialized: true,
          user: null,
          error: error as Error,
        })
      }
    }
    initializeApp()
  }, [dispatch, auth.authStatus, state.initialized, navigation, refreshUsers])

  return {
    ...state,
    refreshUsers,
    refreshAll,
  }
}