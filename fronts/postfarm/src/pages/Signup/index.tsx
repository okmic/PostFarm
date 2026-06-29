import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useNotifications } from '../../hooks/useNotifications'
import apiAuthService from '../../pkg/api/api.auth.service'
import { SignUpForm } from './SignupForm'
import { Logo } from '../../components/Logo/Logo'
import { useSelector } from 'react-redux'
import type { RootState } from '../../store/store'
import { FiMail, FiRefreshCw } from 'react-icons/fi'

export const SignUpPage: React.FC = () => {
  const { refCode } = useParams<{ refCode?: string }>()
  const authStatus = useSelector((s: RootState) => s.auth.authStatus)
  const navigate = useNavigate()
  const notifications = useNotifications()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null)

  useEffect(() => {
    if (authStatus === "loading") navigate("/")
  }, [authStatus])

  const handleSubmit = async (data: { name: string; email: string; psw: string }) => {
    setIsLoading(true)
    setError(null)

    try {
      await apiAuthService.signup({
        name: data.name,
        email: data.email,
        psw: data.psw,
        refCode: refCode || undefined,
      })
      setRegisteredEmail(data.email)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка регистрации'
      notifications.error(errorMessage)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  if (registeredEmail) {
    return (
      <div className="min-h-screen w-full relative overflow-hidden bg-[#1E3A1E] transition-colors duration-500">
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="w-full h-full" style={{ backgroundImage: `radial-gradient(circle at 24px 24px, #4CAF50 2px, transparent 0)`, backgroundSize: '48px 48px' }} />
        </div>

        <div className="absolute top-20 left-10 w-32 h-32 opacity-[0.08]">
          <div className="w-full h-full rounded-full bg-[#4CAF50] blur-3xl" />
        </div>

        <div className="absolute bottom-20 right-10 w-64 h-64 opacity-[0.08]">
          <div className="w-full h-full rounded-full bg-[#FFA726] blur-3xl" />
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-md text-center">
            <div className="flex w-full justify-center items-center mb-6">
              <Logo />
            </div>

            <div className="w-16 h-16 rounded-2xl bg-[#4CAF50]/10 border border-[#4CAF50]/20 flex items-center justify-center mx-auto mb-6">
              <FiMail className="text-2xl text-[#4CAF50]" />
            </div>

            <h2 className="text-xl sm:text-2xl font-light text-white mb-3 tracking-[-0.02em]">
              Проверьте почту
            </h2>
            
            <p className="text-sm text-white/40 mb-2 font-light">
              Мы отправили письмо на
            </p>
            <p className="text-sm text-white font-medium mb-6">
              {registeredEmail}
            </p>

            <p className="text-xs text-white/25 leading-relaxed mb-8 font-light max-w-sm mx-auto">
              Перейдите по ссылке в письме чтобы подтвердить что это ваша почта. Если письмо не пришло, проверьте папку «Спам».
            </p>

            <button
              onClick={() => setRegisteredEmail(null)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white/60 hover:bg-white/10 transition-colors text-sm"
            >
              <FiRefreshCw className="text-sm" />
              Назад к регистрации
            </button>

            <div className="mt-8">
              <Link
                to="/signin"
                className="text-sm text-white/40 hover:text-[#4CAF50] transition-colors duration-300 underline decoration-dotted underline-offset-4"
              >
                Уже подтвердили? Войти
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-[#1E3A1E] transition-colors duration-500">
      <div className="absolute inset-0 opacity-[0.04]">
        <div className="w-full h-full" style={{ backgroundImage: `radial-gradient(circle at 24px 24px, #4CAF50 2px, transparent 0)`, backgroundSize: '48px 48px' }} />
      </div>

      <div className="absolute top-20 left-10 w-32 h-32 opacity-[0.08]">
        <div className="w-full h-full rounded-full bg-[#4CAF50] blur-3xl" />
      </div>

      <div className="absolute bottom-20 right-10 w-64 h-64 opacity-[0.08]">
        <div className="w-full h-full rounded-full bg-[#FFA726] blur-3xl" />
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
              className="text-sm text-white/40 hover:text-[#4CAF50] transition-colors duration-300 underline decoration-dotted underline-offset-4"
            >
              Уже есть аккаунт? Войти
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}