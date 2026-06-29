import React, { useState, useEffect } from 'react'
import type { SignUpFormProps, SignUpFormData, SignUpFormErrors } from './types'
import { validateEmail, ALLOWED_DOMAINS } from '../../pkg/utils/mail.validator'
import { FiInfo, FiExternalLink, FiChevronDown, FiChevronUp } from 'react-icons/fi'

export const SignUpForm: React.FC<SignUpFormProps> = ({
  onSubmit,
  isLoading = false,
  error = null
}) => {
  const [formData, setFormData] = useState<SignUpFormData>({
    name: '',
    email: '',
    psw: '',
    confirmPsw: '',
  })

  const [errors, setErrors] = useState<SignUpFormErrors>({})
  const [touched, setTouched] = useState<Set<string>>(new Set())
  const [shake, setShake] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [showDomainInfo, setShowDomainInfo] = useState(false)

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (!value) return 'Имя обязательно'
        if (value.length < 2) return 'Минимум 2 символа'
        break
      case 'email':
        if (!value) return 'Email обязателен'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Неверный формат email'
        }
        if (!validateEmail(value)) {
          return 'Регистрация с этой почты недоступна'
        }
        break
      case 'psw':
        if (!value) return 'Пароль обязателен'
        if (value.length < 6) return 'Минимум 6 символов'
        break
      case 'confirmPsw':
        if (!value) return 'Подтвердите пароль'
        if (value !== formData.psw) return 'Пароли не совпадают'
        break
    }
    return undefined
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }))

    if (touched.has(name)) {
      const error = validateField(name, value)
      setErrors(prev => ({
        ...prev,
        [name]: error
      }))
    }

    if (name === 'psw' && touched.has('confirmPsw')) {
      const confirmError = validateField('confirmPsw', formData.confirmPsw)
      setErrors(prev => ({
        ...prev,
        confirmPsw: confirmError
      }))
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setTouched(prev => new Set(prev).add(name))
    setFocusedField(null)

    const error = validateField(name, value)
    setErrors(prev => ({
      ...prev,
      [name]: error
    }))
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocusedField(e.target.name)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: SignUpFormErrors = {}
    const fieldsToValidate = ['name', 'email', 'psw', 'confirmPsw']

    fieldsToValidate.forEach(key => {
      const error = validateField(key, formData[key as keyof SignUpFormData] as string)
      if (error) newErrors[key as keyof SignUpFormErrors] = error
    })

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      setShake(true)
      setTimeout(() => setShake(false), 500)
      return
    }

    onSubmit({
      name: formData.name,
      email: formData.email,
      psw: formData.psw,
    })
  }

  useEffect(() => {
    if (error) {
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
  }, [error])

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`
        w-full space-y-6
        transition-all duration-300
        ${shake ? 'animate-shake' : ''}
      `}
    >
      <div className="space-y-2">
        <label 
          htmlFor="name" 
          className={`
            block text-sm font-bold uppercase tracking-wide
            transition-colors duration-300
            ${focusedField === 'name' ? 'text-[#4CAF50]' : 'text-white'}
            ${errors.name ? 'text-[#E57373]' : ''}
            ${!focusedField && !errors.name ? 'opacity-80' : ''}
          `}
        >
          Имя
        </label>
        <div className="relative">
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={isLoading}
            placeholder="Иван Иванов"
            className={`
              w-full px-6 py-4 rounded-xl
              font-medium text-white placeholder-white/40
              transition-all duration-300
              outline-none border-2
              ${errors.name 
                ? 'border-[#E57373] bg-[#E57373]/10' 
                : focusedField === 'name'
                  ? 'border-[#4CAF50] bg-white/10'
                  : 'border-white/10 bg-white/5'
              }
              ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
              ${!errors.name && !focusedField ? 'hover:border-white/15 hover:bg-white/8' : ''}
            `}
          />
          <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
            <div className={`
              w-2 h-2 rounded-full
              transition-all duration-300
              ${formData.name && !errors.name 
                ? 'bg-[#4CAF50] animate-pulse' 
                : errors.name 
                  ? 'bg-[#E57373]' 
                  : 'bg-white/30'
              }
            `} />
          </div>
        </div>
        {errors.name && (
          <p className="text-sm text-[#E57373] mt-2 px-6 animate-fadeIn">
            {errors.name}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label 
          htmlFor="email" 
          className={`
            block text-sm font-bold uppercase tracking-wide
            transition-colors duration-300
            ${focusedField === 'email' ? 'text-[#4CAF50]' : 'text-white'}
            ${errors.email ? 'text-[#E57373]' : ''}
            ${!focusedField && !errors.email ? 'opacity-80' : ''}
          `}
        >
          Email
        </label>
        <div className="relative">
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={isLoading}
            placeholder="example@mail.ru"
            className={`
              w-full px-6 py-4 rounded-xl
              font-medium text-white placeholder-white/40
              transition-all duration-300
              outline-none border-2
              ${errors.email 
                ? 'border-[#E57373] bg-[#E57373]/10' 
                : focusedField === 'email'
                  ? 'border-[#4CAF50] bg-white/10'
                  : 'border-white/10 bg-white/5'
              }
              ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
              ${!errors.email && !focusedField ? 'hover:border-white/15 hover:bg-white/8' : ''}
            `}
          />
          <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
            <div className={`
              w-2 h-2 rounded-full
              transition-all duration-300
              ${formData.email && !errors.email 
                ? 'bg-[#4CAF50] animate-pulse' 
                : errors.email 
                  ? 'bg-[#E57373]' 
                  : 'bg-white/30'
              }
            `} />
          </div>
        </div>
        {errors.email && (
          <div className="mt-2 px-6">
            <p className="text-sm text-[#E57373] animate-fadeIn">
              {errors.email}
            </p>
            <button
              type="button"
              onClick={() => setShowDomainInfo(!showDomainInfo)}
              className="flex items-center gap-1.5 mt-2 text-xs text-white/30 hover:text-white/50 transition-colors"
            >
              <FiInfo className="text-[10px]" />
              <span>{showDomainInfo ? 'Скрыть' : 'Какие почты можно использовать?'}</span>
              {showDomainInfo ? <FiChevronUp className="text-[10px]" /> : <FiChevronDown className="text-[10px]" />}
            </button>
            {showDomainInfo && (
              <div className="mt-2 p-3 sm:p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] animate-fadeIn">
                <p className="text-xs text-white/40 leading-relaxed mb-3">
                  По закону РФ регистрация с иностранных почтовых сервисов ограничена.
                </p>
                <p className="text-[11px] text-white/50 font-medium mb-2">Доступные почтовые сервисы:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mb-3">
                  {ALLOWED_DOMAINS.map(domain => (
                    <div key={domain} className="flex items-center gap-2 px-2 py-1 rounded-lg">
                      <div className="w-1 h-1 rounded-full bg-[#4CAF50]/60 flex-shrink-0" />
                      <span className="text-xs text-[#4CAF50] font-light">@{domain}</span>
                    </div>
                  ))}
                </div>
                <a
                  href="https://www.consultant.ru/document/cons_doc_LAW_537878/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[10px] text-white/25 hover:text-white/40 transition-colors underline underline-offset-2"
                >
                  <FiExternalLink className="text-[9px]" />
                  Почитать об этом
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label 
          htmlFor="psw" 
          className={`
            block text-sm font-bold uppercase tracking-wide
            transition-colors duration-300
            ${focusedField === 'psw' ? 'text-[#4CAF50]' : 'text-white'}
            ${errors.psw ? 'text-[#E57373]' : ''}
            ${!focusedField && !errors.psw ? 'opacity-80' : ''}
          `}
        >
          Пароль
        </label>
        <div className="relative">
          <input
            type="password"
            id="psw"
            name="psw"
            value={formData.psw}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={isLoading}
            placeholder="••••••••"
            className={`
              w-full px-6 py-4 rounded-xl
              font-medium text-white placeholder-white/40
              transition-all duration-300
              outline-none border-2
              ${errors.psw 
                ? 'border-[#E57373] bg-[#E57373]/10' 
                : focusedField === 'psw'
                  ? 'border-[#4CAF50] bg-white/10'
                  : 'border-white/10 bg-white/5'
              }
              ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
              ${!errors.psw && !focusedField ? 'hover:border-white/15 hover:bg-white/8' : ''}
            `}
          />
          <div className="absolute right-6 top-1/2 transform -translate-y-1/2 flex gap-1">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className={`
                  w-1 h-4 rounded-full
                  transition-all duration-300
                  ${formData.psw.length >= i * 2 
                    ? formData.psw.length > 8 
                      ? 'bg-[#4CAF50]' 
                      : 'bg-[#FFA726]'
                    : 'bg-white/20'
                  }
                `}
              />
            ))}
          </div>
        </div>
        {errors.psw && (
          <p className="text-sm text-[#E57373] mt-2 px-6 animate-fadeIn">
            {errors.psw}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label 
          htmlFor="confirmPsw" 
          className={`
            block text-sm font-bold uppercase tracking-wide
            transition-colors duration-300
            ${focusedField === 'confirmPsw' ? 'text-[#4CAF50]' : 'text-white'}
            ${errors.confirmPsw ? 'text-[#E57373]' : ''}
            ${!focusedField && !errors.confirmPsw ? 'opacity-80' : ''}
          `}
        >
          Подтверждение пароля
        </label>
        <div className="relative">
          <input
            type="password"
            id="confirmPsw"
            name="confirmPsw"
            value={formData.confirmPsw}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={isLoading}
            placeholder="••••••••"
            className={`
              w-full px-6 py-4 rounded-xl
              font-medium text-white placeholder-white/40
              transition-all duration-300
              outline-none border-2
              ${errors.confirmPsw
                ? 'border-[#E57373] bg-[#E57373]/10' 
                : focusedField === 'confirmPsw'
                  ? 'border-[#4CAF50] bg-white/10'
                  : 'border-white/10 bg-white/5'
              }
              ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
              ${!errors.confirmPsw && !focusedField ? 'hover:border-white/15 hover:bg-white/8' : ''}
            `}
          />
          <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
            <div className={`
              w-2 h-2 rounded-full
              transition-all duration-300
              ${formData.confirmPsw && !errors.confirmPsw && formData.psw === formData.confirmPsw
                ? 'bg-[#4CAF50] animate-pulse' 
                : errors.confirmPsw
                  ? 'bg-[#E57373]' 
                  : 'bg-white/30'
              }
            `} />
          </div>
        </div>
        {errors.confirmPsw && (
          <p className="text-sm text-[#E57373] mt-2 px-6 animate-fadeIn">
            {errors.confirmPsw}
          </p>
        )}
      </div>

      {error && (
        <div className="
          p-4 rounded-xl
          bg-[#E57373]/10 border-2 border-[#E57373]/30
          text-[#E57373] text-sm text-center
          animate-fadeIn
        ">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className={`
          cursor-pointer w-full py-5 px-8 rounded-xl
          font-bold text-lg uppercase tracking-wider
          bg-gradient-to-r from-[#1E3A1E] to-[#4CAF50] text-white
          transition-all duration-300
          transform hover:scale-105 active:scale-95
          ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-[0_0_30px_rgba(76,175,80,0.4)]'}
          relative overflow-hidden group
        `}
      >
        <span className="relative z-10">
          {isLoading ? 'ПОДОЖДИТЕ...' : 'СОЗДАТЬ'}
        </span>
        
        {isLoading && (
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-white/30 animate-pulse" />
          </div>
        )}
      </button>
    </form>
  )
}
