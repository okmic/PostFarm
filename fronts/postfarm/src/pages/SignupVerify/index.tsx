import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import apiAuthService from '../../pkg/api/api.auth.service'
import { useNotifications } from '../../hooks/useNotifications'
import { useSelector } from 'react-redux'
import type { RootState } from '../../store/store'

export const SignUpVerify: React.FC = () => {
  const { code } = useParams<{ code?: string }>()
  const authStatus = useSelector((s: RootState) => s.auth.authStatus)
  const notifications = useNotifications()
  const navigate = useNavigate()
  const onAuth = async () => {
    try {
      if(!code) {
        navigate("/signup")
        return
      }
      await apiAuthService.signupVerify({
        code
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка регистрации'
      notifications.error(errorMessage)
    } 
  }

  useEffect(() => {
    onAuth()
  },[])

  useEffect(() => {
    if(authStatus === "loading") navigate("/")
  }, [authStatus])

  return <></>
}
