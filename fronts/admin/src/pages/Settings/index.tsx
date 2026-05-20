import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { logout, updateStateUser } from "../../store/slices/auth.slice"
import type { RootState } from "../../store/store"
import { 
  FaUser, FaSave, FaTimes, FaEye, FaEyeSlash, 
  FaStar, FaStarHalf, FaCrown, FaRocket, 
  FaUserAstronaut, FaGem, FaEdit, FaSignOutAlt,
  FaCheckCircle, FaBell, FaShieldAlt, FaClock,
  FaArrowLeft
} from "react-icons/fa"
import { MdOutlineVerified } from "react-icons/md"
import { useNavigate } from "react-router-dom"
import apiUserService from "../../pkg/api/api.user.service"
import "./styles.css"

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

  const getRateInfo = (rate: string) => {
    const rates = {
      "0": { name: "Базовый", color: "text-gray-400", bg: "bg-gray-500/10", border: "border-gray-500/20", stars: 1, icon: FaUser, gradient: "from-gray-500/20 to-gray-600/20" },
      "1": { name: "Продвинутый", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", stars: 2, icon: FaRocket, gradient: "from-emerald-500/20 to-teal-500/20" },
      "2": { name: "Профессиональный", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", stars: 3, icon: FaGem, gradient: "from-blue-500/20 to-cyan-500/20" },
      "3": { name: "Эксперт", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", stars: 4, icon: FaUserAstronaut, gradient: "from-purple-500/20 to-pink-500/20" },
      "4": { name: "Root", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", stars: 5, icon: FaCrown, gradient: "from-amber-500/20 to-orange-500/20" }
    }
    return rates[rate as keyof typeof rates] || rates["0"]
  }

  const rateInfo = getRateInfo(user?.rate || "0")
  const RateIcon = rateInfo.icon

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
    const stars = []
    for (let i = 1; i <= 5; i++) {
      if (i <= rateInfo.stars) {
        stars.push(<FaStar key={i} className={`${rateInfo.color} text-xs lg:text-sm`} />)
      } else {
        stars.push(<FaStarHalf key={i} className={`${rateInfo.color} text-xs lg:text-sm opacity-30`} />)
      }
    }
    return stars
  }

  const avatarLetter = user?.name?.charAt(0).toUpperCase() || "?"

  return (
    <div className="min-h-screen">
      <div className="relative max-w-6xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all group"
          >
            <FaArrowLeft className="text-lg group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white to-[#2D9CDB] bg-clip-text text-transparent">
                Настройки профиля
              </h1>
              <div className="max-sm:hidden px-2 py-0.5 lg:px-3 lg:py-1 rounded-full bg-white/5 border border-white/10">
                <span className="text-[10px] lg:text-xs text-white/40 font-mono">MBot v1.0</span>
              </div>
            </div>
            <p className="text-white/40 text-xs lg:text-sm">
              Управление личными данными и безопасностью аккаунта
            </p>
          </div>
        </div>

        <div className="flex gap-1 mb-8 border-b border-white/10">
          <button
            onClick={() => setActiveTab("profile")}
            className={`
              flex items-center gap-2 px-4 lg:px-6 py-2.5 lg:py-3 rounded-t-xl text-sm font-medium transition-all
              ${activeTab === "profile" 
                ? "text-white border-b-2 border-[#2D9CDB] bg-white/5" 
                : "text-white/40 hover:text-white/60 hover:bg-white/5"
              }
            `}
          >
            <FaUser className="text-sm lg:text-base" />
            <span className="hidden sm:inline">Профиль</span>
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`
              flex items-center gap-2 px-4 lg:px-6 py-2.5 lg:py-3 rounded-t-xl text-sm font-medium transition-all
              ${activeTab === "notifications" 
                ? "text-white border-b-2 border-[#2D9CDB] bg-white/5" 
                : "text-white/40 hover:text-white/60 hover:bg-white/5"
              }
            `}
          >
            <FaBell className="text-sm lg:text-base" />
            <span className="hidden sm:inline">Уведомления</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Sidebar - User Info Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="relative bg-gradient-to-br from-white/5 to-white/3 backdrop-blur-sm rounded-2xl border border-white/10 p-6 overflow-hidden group">
                <div className={`absolute inset-0 bg-gradient-to-br ${rateInfo.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-5">
                      <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-2xl bg-gradient-to-br from-[#2D9CDB] to-[#20B2AA] flex items-center justify-center text-white text-3xl lg:text-4xl font-bold shadow-2xl shadow-[#2D9CDB]/20 ring-4 ring-white/10">
                        {avatarLetter}
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-[#1E2A5E] border-2 border-white/10 flex items-center justify-center">
                        <MdOutlineVerified className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-[#2D9CDB]" />
                      </div>
                    </div>
                    
                    <h2 className="text-lg lg:text-xl font-bold text-white mb-1">
                      {user?.name || "Пользователь"}
                    </h2>
                    <p className="text-white/40 text-xs mb-4 break-all max-w-full">
                      {user?.email || "—"}
                    </p>
                    
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl ${rateInfo.bg} border ${rateInfo.border} mb-4`}>
                      <RateIcon className={`${rateInfo.color} text-xs`} />
                      <span className={`text-xs font-semibold ${rateInfo.color}`}>
                        {rateInfo.name}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1 mb-5">
                      {renderStars()}
                    </div>
                    
                    <div className="w-full space-y-3 pt-3 border-t border-white/10">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/40 flex items-center gap-1.5">
                          <FaShieldAlt className="text-[10px]" />
                          ID
                        </span>
                        <span className="text-white/60 font-mono text-[10px] lg:text-xs">
                          {user?._id?.slice(-12) || "—"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/40 flex items-center gap-1.5">
                          <FaClock className="text-[10px]" />
                          Статус
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Активен
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
              <div className="bg-gradient-to-br from-white/5 to-white/3 backdrop-blur-sm rounded-2xl border border-white/10 p-6 lg:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#2D9CDB]/20 flex items-center justify-center">
                      <FaUser className="text-[#2D9CDB] text-sm" />
                    </div>
                    Информация профиля
                  </h3>
                  
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2D9CDB]/20 border border-[#2D9CDB]/30 text-[#2D9CDB] text-sm font-medium transition-all hover:bg-[#2D9CDB]/30 hover:border-[#2D9CDB]/50 hover:translate-y-[-2px] active:scale-95"
                    >
                      <FaEdit className="text-sm" />
                      Редактировать
                    </button>
                  )}
                </div>
                
                {message && (
                  <div className={`mb-6 p-4 rounded-xl border animate-in fade-in slide-in-from-top-2 duration-300 ${
                    message.type === "success" 
                      ? "bg-emerald-500/10 border-emerald-500/20" 
                      : "bg-red-500/10 border-red-500/20"
                  }`}>
                    <div className={`flex items-center gap-2 text-sm ${message.type === "success" ? "text-emerald-400" : "text-red-400"}`}>
                      {message.type === "success" && <FaCheckCircle />}
                      {message.text}
                    </div>
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-white/60 mb-2">
                        Имя пользователя
                      </label>
                      {isEditing ? (
                        <div className="relative group">
                          <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm group-focus-within:text-[#2D9CDB] transition-colors" />
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#1E2A5E] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#2D9CDB] focus:ring-2 focus:ring-[#2D9CDB]/20 transition-all"
                            placeholder="Введите имя"
                          />
                        </div>
                      ) : (
                        <div className="px-4 py-3 rounded-xl bg-[#1E2A5E] border border-white/10 text-white flex items-center gap-2">
                          <FaUser className="text-white/40 text-sm" />
                          <span>{user?.name || "—"}</span>
                        </div>
                      )}
                    </div>

                    {/* Email - только для чтения */}
                    <div>
                      <label className="block text-sm font-medium text-white/60 mb-2">
                        Email адрес
                      </label>
                      <div className="px-4 py-3 rounded-xl bg-[#1E2A5E]/50 border border-white/10 text-white/60 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center">
                          <svg className="w-3.5 h-3.5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <span className="text-sm">{user?.email || "—"}</span>
                        <span className="ml-auto text-[10px] text-white/20 font-mono">не редактируется</span>
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-sm font-medium text-white/60 mb-2">
                        Пароль
                      </label>
                      {isEditing ? (
                        <div className="space-y-3">
                          <div className="relative group">
                            <FaEye className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm" />
                            <input
                              type={showPassword ? "text" : "password"}
                              name="psw"
                              value={formData.psw}
                              onChange={handleChange}
                              className="w-full pl-11 pr-12 py-3 rounded-xl bg-[#1E2A5E] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#2D9CDB] focus:ring-2 focus:ring-[#2D9CDB]/20 transition-all"
                              placeholder="Новый пароль"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-[#2D9CDB] transition-colors p-1"
                            >
                              {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                            </button>
                          </div>
                          <div className="relative group">
                            <FaEye className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm" />
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              name="confirmPsw"
                              value={formData.confirmPsw}
                              onChange={handleChange}
                              className="w-full pl-11 pr-12 py-3 rounded-xl bg-[#1E2A5E] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#2D9CDB] focus:ring-2 focus:ring-[#2D9CDB]/20 transition-all"
                              placeholder="Подтвердите пароль"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-[#2D9CDB] transition-colors p-1"
                            >
                              {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="px-4 py-3 rounded-xl bg-[#1E2A5E] border border-white/10 text-white/60 flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center">
                            <FaEye className="w-3.5 h-3.5 text-white/40" />
                          </div>
                          <span className="text-sm">••••••••</span>
                          <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="ml-auto text-xs text-[#2D9CDB]/60 hover:text-[#2D9CDB] transition-colors"
                          >
                            Изменить
                          </button>
                        </div>
                      )}
                    </div>

                    {isEditing && (
                      <div className="flex gap-3 pt-6">
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-[#2D9CDB] to-[#20B2AA] text-white font-medium text-sm transition-all hover:translate-y-[-2px] hover:shadow-lg hover:shadow-[#2D9CDB]/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <>
                              <FaSave />
                              Сохранить изменения
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={handleCancel}
                          className="flex-1 py-3 px-6 rounded-xl bg-white/5 border border-white/10 text-white/60 font-medium text-sm transition-all hover:bg-white/10 hover:text-white active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                          <FaTimes />
                          Отменить
                        </button>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="bg-gradient-to-br from-white/5 to-white/3 backdrop-blur-sm rounded-2xl border border-white/10 p-6 lg:p-8 min-h-[400px] flex items-center justify-center">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group hover:scale-105 transition-transform duration-300">
                    <FaBell className="text-3xl lg:text-4xl text-white/20 group-hover:text-white/30 transition-colors" />
                  </div>
                  <h3 className="text-base lg:text-lg font-medium text-white mb-2">
                    Нет уведомлений
                  </h3>
                  <p className="text-white/40 text-xs lg:text-sm max-w-xs">
                    Здесь будут отображаться уведомления о синхронизации и обновлениях
                  </p>
                </div>
              </div>
            )}

            <div className="mt-6">
              <button
                onClick={() => dispatch(logout())}
                className="group w-full py-4 px-6 rounded-xl bg-red-500/5 border border-red-500/20 text-red-400 font-medium text-sm transition-all hover:bg-red-500/15 hover:border-red-500/40 hover:translate-y-[-2px] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <FaSignOutAlt className="transition-transform group-hover:translate-x-0.5" />
                Выйти из аккаунта
              </button>
              <p className="mt-4 text-center text-[10px] lg:text-xs text-white/20">
                {rateInfo.name} уровень доступа
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}