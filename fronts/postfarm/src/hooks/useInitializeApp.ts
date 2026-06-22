import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../store/store"
import { setOrUpdateUsafeTokens, setPosts } from "../store/slices/tenantStore.slice"
import { authStatus } from "../store/slices/auth.slice"
import type { IUser } from "../pkg/types/user"
import apiUserService from "../pkg/api/api.user.service"
import { useNavigate } from "react-router-dom"
import apiTenantStoreService from "../pkg/api/api.tenantStore.service"

interface UseInitializeAppReturn {
  isCheckingAuth: boolean
  initialized: boolean
  user: IUser | null
  error: Error | null
}

export const useInitializeApp = (): UseInitializeAppReturn => {
  const dispatch = useDispatch()
  const [state, setState] = useState<UseInitializeAppReturn>({
    isCheckingAuth: true,
    initialized: false,
    user: null,
    error: null,
  })
  const auth = useSelector((s: RootState) => s.auth)
  const navigation = useNavigate()

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const me = await apiUserService.getMyInfo()

        if (me) {
          dispatch(authStatus({ status: "auth", user: me }))
          try {
            const [posts, usageTokens] = await Promise.all([
              apiTenantStoreService.getPosts(),
              apiTenantStoreService.usageTokens(),
            ])
            dispatch(setPosts({ posts }))
            dispatch(setOrUpdateUsafeTokens({ usageTokens }))
          } catch (e) {}
          setState({
            isCheckingAuth: false,
            initialized: true,
            user: me,
            error: null,
          })
          navigation("/")
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
  }, [dispatch, auth.authStatus])

  return state
}