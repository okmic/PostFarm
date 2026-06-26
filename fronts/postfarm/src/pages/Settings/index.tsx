import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { logout, updateStateUser } from "../../store/slices/auth.slice"
import type { RootState } from "../../store/store"
import { 
  FaUser, FaSave, FaTimes, FaEye, FaEyeSlash, 
  FaStar, FaCrown, FaRocket, 
  FaUserAstronaut, FaGem, FaEdit, FaSignOutAlt,
  FaCheckCircle, FaBell, FaShieldAlt, FaClock,
  FaArrowLeft, FaLeaf, FaInfinity, FaEnvelope
} from "react-icons/fa"
import { MdOutlineVerified } from "react-icons/md"
import { useNavigate, Link } from "react-router-dom"
import apiUserService from "../../pkg/api/api.user.service"

const RATE_CONFIG: Record<number, {
  name: string
  icon: typeof FaStar
  color: string
  textColor: string
  bg: string
  border: string
  gradient: string
  stars: number
  dailyLimit: number
  description: string
}> = {
  0: {
    name: "Создатель",
    icon: FaCrown,
    color: "#F59E0B",
    textColor: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    gradient: "from-amber-500/20 via-yellow-500/10 to-[#FFA726]/20",
    stars: 5,
    dailyLimit: Infinity,
    description: "Безлимитный доступ"
  },
  1: {
    name: "Росток",
    icon: FaRocket,
    color: "#26A5E4",
    textColor: "text-sky-400",
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
    gradient: "from-sky-500/20 via-blue-500/10 to-cyan-500/20",
    stars: 1,
    dailyLimit: 3,
    description: "До 3 генераций в день"
  },
  2: {
    name: "Колос",
    icon: FaLeaf,
    color: "#34D399",
    textColor: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    gradient: "from-emerald-500/20 via-teal-500/10 to-cyan-500/20",
    stars: 2,
    dailyLimit: 10,
    description: "До 10 генераций в день"
  },
  3: {
    name: "Урожай",
    icon: FaGem,
    color: "#4CAF50",
    textColor: "text-[#4CAF50]",
    bg: "bg-[#4CAF50]/10",
    border: "border-[#4CAF50]/20",
    gradient: "from-[#4CAF50]/20 via-emerald-500/10 to-teal-500/20",
    stars: 3,
    dailyLimit: 50,
    description: "До 50 генераций в день"
  },
  4: {
    name: "Агроном",
    icon: FaUserAstronaut,
    color: "#FFA726",
    textColor: "text-[#FFA726]",
    bg: "bg-[#FFA726]/10",
    border: "border-[#FFA726]/20",
    gradient: "from-[#FFA726]/20 via-orange-500/10 to-amber-500/20",
    stars: 4,
    dailyLimit: 100,
    description: "До 100 генераций в день"
  },
  5: {
    name: "Агроном Pro",
    icon: FaUserAstronaut,
    color: "#FFA726",
    textColor: "text-[#FFA726]",
    bg: "bg-[#FFA726]/10",
    border: "border-[#FFA726]/20",
    gradient: "from-[#FFA726]/20 via-orange-500/10 to-amber-500/20",
    stars: 5,
    dailyLimit: 1000,
    description: "До 1000 генераций в день"
  }
}

const getRateConfig = (rate: number) => {
  if (rate === 0) return RATE_CONFIG[1]
  if (rate <= 3) return RATE_CONFIG[1]
  if (rate <= 10) return RATE_CONFIG[2]
  if (rate <= 50) return RATE_CONFIG[3]
  if (rate <= 100) return RATE_CONFIG[4]
  if (rate <= 1000) return RATE_CONFIG[5]
  return RATE_CONFIG[5]
}

export default function SettingsPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state: RootState) => state.auth.user)
  
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [activeTab, setActiveTab] = useState<"profile" | "notifications">("profile")
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    psw: "",
    confirmPsw: ""
  })

  const userRate = typeof user?.rate === 'number' ? user.rate : 3
  const rateConfig = getRateConfig(userRate)
  const RateIcon = rateConfig.icon

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (formData.psw && formData.psw !== formData.confirmPsw) {
      setMessage({ type: "error", text: "Пароли не совпадают" })
      setLoading(false)
      return
    }

    if (formData.psw && formData.psw.length < 6) {
      setMessage({ type: "error", text: "Пароль должен содержать минимум 6 символов" })
      setLoading(false)
      return
    }

    try {
      const updateData: { psw?: string; name?: string } = {}
      
      if (formData.name !== user?.name) {
        updateData.name = formData.name
      }
      if (formData.psw) {
        updateData.psw = formData.psw
      }

      if (Object.keys(updateData).length === 0) {
        setMessage({ type: "error", text: "Нет изменений для сохранения" })
        setLoading(false)
        return
      }

      await apiUserService.updateUser(updateData)
      .then(() => {
        dispatch(updateStateUser({ user: { ...updateData, psw: null } }))
      })
      
      setMessage({ type: "success", text: "Данные успешно обновлены" })
      setIsEditing(false)
      setFormData(prev => ({ ...prev, psw: "", confirmPsw: "" }))
      
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: "error", text: "Ошибка при обновлении данных" })
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFormData({
      name: user?.name || "",
      psw: "",
      confirmPsw: ""
    })
    setMessage(null)
  }

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar 
        key={i} 
        className={`text-xs ${i < rateConfig.stars ? rateConfig.textColor : 'text-white/10'}`}
      />
    ))
  }

  const avatarLetter = user?.name?.charAt(0).toUpperCase() || "?"

  return (
    <div className="min-h-screen">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="cursor-pointer p-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <FaArrowLeft className="text-lg" />
          </button>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-[-0.02em]">
                Настройки профиля
              </h1>
              <div className="hidden sm:block px-3 py-1 rounded-full bg-white/5 border border-white/10">
                <span className="text-[10px] text-white/40 font-mono">ПостФерма v1.0</span>
              </div>
            </div>
            <p className="text-white/40 text-xs sm:text-sm">
              Управление личными данными и безопасностью аккаунта
            </p>
          </div>
        </div>

        <div className="flex gap-1 mb-8 border-b border-white/10">
          <button
            onClick={() => setActiveTab("profile")}
            className={`cursor-pointer flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-t-xl text-sm font-medium transition-colors ${
              activeTab === "profile" 
                ? "text-white border-b-2 border-[#4CAF50] bg-white/5" 
                : "text-white/40 hover:text-white/60 hover:bg-white/5"
            }`}
          >
            <FaUser className="text-sm" />
            <span className="hidden sm:inline">Профиль</span>
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`cursor-pointer flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-t-xl text-sm font-medium transition-colors ${
              activeTab === "notifications" 
                ? "text-white border-b-2 border-[#4CAF50] bg-white/5" 
                : "text-white/40 hover:text-white/60 hover:bg-white/5"
            }`}
          >
            <FaBell className="text-sm" />
            <span className="hidden sm:inline">Уведомления</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-8">
              <div className="relative bg-white/[0.03] backdrop-blur-sm rounded-2xl border border-white/[0.08] p-6 overflow-hidden group">
                <div className={`absolute inset-0 bg-gradient-to-br ${rateConfig.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-5">
                      <div 
                        className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl flex items-center justify-center text-white text-2xl sm:text-4xl font-bold ring-4 ring-white/10"
                        style={{ 
                          background: `linear-gradient(135deg, ${rateConfig.color}60, ${rateConfig.color}20)`,
                          boxShadow: `0 8px 32px ${rateConfig.color}20`
                        }}
                      >
                        {avatarLetter}
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#1E3A1E] border-2 border-white/10 flex items-center justify-center">
                        {rateConfig.stars === 5 ? (
                          <FaCrown className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: rateConfig.color }} />
                        ) : (
                          <MdOutlineVerified className="w-3 h-3 sm:w-4 sm:h-4 text-[#4CAF50]" />
                        )}
                      </div>
                    </div>
                    
                    <h2 className="text-base sm:text-xl font-bold text-white mb-1">
                      {user?.name || "Пользователь"}
                    </h2>
                    <p className="text-white/40 text-[11px] sm:text-xs mb-4 break-all max-w-full">
                      {user?.email || "—"}
                    </p>
                    
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl ${rateConfig.bg} border ${rateConfig.border} mb-3`}>
                      <RateIcon className={`${rateConfig.textColor} text-[10px] sm:text-xs`} />
                      <span className={`text-[10px] sm:text-xs font-semibold ${rateConfig.textColor}`}>
                        {rateConfig.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 mb-1">
                      {renderStars()}
                    </div>

                    <p className="text-[9px] sm:text-[10px] text-white/20 mb-3">{rateConfig.description}</p>

                    {(rateConfig.dailyLimit !== Infinity && userRate < 1000) && (
                      <Link
                        to="/ai-limit"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFA726]/10 border border-[#FFA726]/20 text-[#FFA726] text-[10px] sm:text-[11px] font-medium transition-colors hover:bg-[#FFA726]/20 mb-4"
                      >
                        <FaEnvelope className="text-[9px] sm:text-[10px]" />
                        Увеличить лимит
                      </Link>
                    )}
                    
                    <div className="w-full space-y-3 pt-3 border-t border-white/10">
                      <div className="flex items-center justify-between text-[11px] sm:text-xs">
                        <span className="text-white/40 flex items-center gap-1.5">
                          <FaShieldAlt className="text-[9px] sm:text-[10px]" />
                          ID
                        </span>
                        <span className="text-white/60 font-mono text-[9px] sm:text-[10px]">
                          {user?._id ? String(user._id).slice(-8) : "—"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] sm:text-xs">
                        <span className="text-white/40 flex items-center gap-1.5">
                          <FaClock className="text-[9px] sm:text-[10px]" />
                          Статус
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-[#4CAF50]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#4CAF50]" />
                          Активен
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] sm:text-xs">
                        <span className="text-white/40 flex items-center gap-1.5">
                          <FaInfinity className="text-[9px] sm:text-[10px]" />
                          Лимит
                        </span>
                        <span className="text-white/60 text-[9px] sm:text-[10px]">
                          {rateConfig.dailyLimit === Infinity ? "Безлимит" : `${rateConfig.dailyLimit}/день`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {activeTab === "profile" && (
              <div className="bg-white/[0.03] backdrop-blur-sm rounded-2xl border border-white/[0.08] p-5 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#4CAF50]/20 flex items-center justify-center">
                      <FaUser className="text-[#4CAF50] text-xs sm:text-sm" />
                    </div>
                    Информация профиля
                  </h3>
                  
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2 rounded-xl bg-[#4CAF50]/20 border border-[#4CAF50]/30 text-[#4CAF50] text-xs sm:text-sm font-medium transition-colors hover:bg-[#4CAF50]/30"
                    >
                      <FaEdit className="text-xs sm:text-sm" />
                    </button>
                  )}
                </div>
                
                {message && (
                  <div className={`mb-6 p-3 sm:p-4 rounded-xl border ${
                    message.type === "success" 
                      ? "bg-[#4CAF50]/10 border-[#4CAF50]/20" 
                      : "bg-[#E57373]/10 border-[#E57373]/20"
                  }`}>
                    <div className={`flex items-center gap-2 text-xs sm:text-sm ${message.type === "success" ? "text-[#4CAF50]" : "text-[#E57373]"}`}>
                      {message.type === "success" && <FaCheckCircle />}
                      {message.text}
                    </div>
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4 sm:space-y-5">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-white/60 mb-2">
                        Имя пользователя
                      </label>
                      {isEditing ? (
                        <div className="relative">
                          <FaUser className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-white/30 text-xs sm:text-sm" />
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-xl bg-[#1E3A1E] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#4CAF50] transition-colors"
                            placeholder="Введите имя"
                          />
                        </div>
                      ) : (
                        <div className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-[#1E3A1E] border border-white/10 text-white flex items-center gap-2 text-sm">
                          <FaUser className="text-white/40 text-xs sm:text-sm" />
                          <span>{user?.name || "—"}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-white/60 mb-2">
                        Email адрес
                      </label>
                      <div className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-[#1E3A1E]/50 border border-white/10 text-white/60 flex items-center gap-2 text-sm">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-white/5 flex items-center justify-center">
                          <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <span className="text-xs sm:text-sm">{user?.email || "—"}</span>
                        <span className="ml-auto text-[9px] sm:text-[10px] text-white/20 font-mono">не редактируется</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-white/60 mb-2">
                        Пароль
                      </label>
                      {isEditing ? (
                        <div className="space-y-2 sm:space-y-3">
                          <div className="relative">
                            <FaEye className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-white/30 text-xs sm:text-sm" />
                            <input
                              type={showPassword ? "text" : "password"}
                              name="psw"
                              value={formData.psw}
                              onChange={handleChange}
                              className="w-full pl-9 sm:pl-11 pr-10 sm:pr-12 py-2.5 sm:py-3 rounded-xl bg-[#1E3A1E] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#4CAF50] transition-colors"
                              placeholder="Новый пароль"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="cursor-pointer absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-[#4CAF50] transition-colors p-1"
                            >
                              {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                            </button>
                          </div>
                          <div className="relative">
                            <FaEye className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-white/30 text-xs sm:text-sm" />
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              name="confirmPsw"
                              value={formData.confirmPsw}
                              onChange={handleChange}
                              className="w-full pl-9 sm:pl-11 pr-10 sm:pr-12 py-2.5 sm:py-3 rounded-xl bg-[#1E3A1E] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#4CAF50] transition-colors"
                              placeholder="Подтвердите пароль"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="cursor-pointer absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-[#4CAF50] transition-colors p-1"
                            >
                              {showConfirmPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-[#1E3A1E] border border-white/10 text-white/60 flex items-center gap-2 text-sm">
                          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-white/5 flex items-center justify-center">
                            <FaEye className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/40" />
                          </div>
                          <span className="text-xs sm:text-sm">••••••••</span>
                          <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="cursor-pointer ml-auto text-[10px] sm:text-xs text-[#4CAF50]/60 hover:text-[#4CAF50] transition-colors"
                          >
                            Изменить
                          </button>
                        </div>
                      )}
                    </div>

                    {isEditing && (
                      <div className="flex gap-2 sm:gap-3 pt-4 sm:pt-6">
                        <button
                          type="submit"
                          disabled={loading}
                          className="cursor-pointer flex-1 py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl bg-gradient-to-r from-[#4CAF50] to-[#FFA726] text-white font-medium text-xs sm:text-sm transition-colors hover:shadow-[0_0_12px_rgba(76,175,80,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 sm:gap-2"
                        >
                          {loading ? (
                            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <>
                              <FaSave className="text-[10px] sm:text-sm" />
                              Сохранить
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={handleCancel}
                          className="cursor-pointer flex-1 py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl bg-white/5 border border-white/10 text-white/60 font-medium text-xs sm:text-sm transition-colors hover:bg-white/10 hover:text-white flex items-center justify-center gap-1.5 sm:gap-2"
                        >
                          <FaTimes className="text-[10px] sm:text-sm" />
                          Отменить
                        </button>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="bg-white/[0.03] backdrop-blur-sm rounded-2xl border border-white/[0.08] p-5 sm:p-8 min-h-[300px] sm:min-h-[400px] flex items-center justify-center">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                    <FaBell className="text-2xl sm:text-4xl text-white/20" />
                  </div>
                  <h3 className="text-sm sm:text-lg font-medium text-white mb-2">
                    Нет уведомлений
                  </h3>
                  <p className="text-white/40 text-[10px] sm:text-sm max-w-xs">
                    Здесь будут отображаться уведомления о синхронизации и обновлениях
                  </p>
                </div>
              </div>
            )}

            <div className="mt-6">
              <button
                onClick={() => dispatch(logout())}
                className="cursor-pointer w-full py-3 sm:py-4 px-5 sm:px-6 rounded-xl bg-[#E57373]/5 border border-[#E57373]/20 text-[#E57373] font-medium text-xs sm:text-sm transition-colors hover:bg-[#E57373]/15 flex items-center justify-center gap-2"
              >
                <FaSignOutAlt className="text-[10px] sm:text-sm" />
                Выйти из аккаунта
              </button>
              <p className="mt-4 text-center text-[9px] sm:text-[10px] text-white/20">
                {rateConfig.name} • {rateConfig.dailyLimit === Infinity ? "Безлимит" : `${rateConfig.dailyLimit} ген/день`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
