import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useNotifications } from '../../hooks/useNotifications'
import apiAuthService from '../../pkg/api/api.auth.service'
import { SignUpForm } from './SignupForm'
import { Logo } from '../../components/Logo/Logo'

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate()
  const notifications = useNotifications()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: { name: string; email: string; psw: string }) => {
    setIsLoading(true)
    setError(null)

    try {
      await apiAuthService.signup({
        name: data.name,
        email: data.email,
        psw: data.psw,
        role: "User"
      })
      notifications.success('Регистрация прошла успешно!')
      navigate('/signin')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка регистрации'
      notifications.error(errorMessage)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-[#1E2A5E] transition-colors duration-500">
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 24px 24px, #2D9CDB 2px, transparent 0)`,
            backgroundSize: '48px 48px'
          }}
        />
      </div>

      <div className="absolute top-20 left-10 w-32 h-32 opacity-10">
        <div className="w-full h-full rounded-full bg-[#2D9CDB] blur-3xl" />
      </div>

      <div className="absolute bottom-20 right-10 w-64 h-64 opacity-10">
        <div className="w-full h-full rounded-full bg-[#20B2AA] blur-3xl" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="flex w-full justify-center items-center">
            <Logo />
          </div>

          <SignUpForm onSubmit={handleSubmit} isLoading={isLoading} error={error} />

          <div className="mt-8 text-center">
            <Link
              to="/signin"
              className="text-sm text-white/40 hover:text-[#2D9CDB] transition-colors duration-300 underline decoration-dotted underline-offset-4"
            >
              Уже есть аккаунт? Войти
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}