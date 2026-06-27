import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { 
  FaArrowLeft, FaSearch, FaCrown,
  FaRocket, FaLeaf, FaGem, FaUserAstronaut,
  FaKey, FaCheck, FaTimes, FaChevronDown, FaChevronUp,
  FaLock, FaUnlock
} from "react-icons/fa"
import { FiUser, FiMail, FiShield, FiCalendar, FiEdit3 } from "react-icons/fi"
import type { IUser } from "../../pkg/types/user"
import apiUserService from "../../pkg/api/api.user.service"
import { useNotifications } from "../../hooks/useNotifications"

const RATE_OPTIONS = [
  { value: 0, label: "Создатель", icon: FaCrown, color: "#F59E0B" },
  { value: 3, label: "Росток", icon: FaRocket, color: "#26A5E4" },
  { value: 10, label: "Колос", icon: FaLeaf, color: "#34D399" },
  { value: 50, label: "Урожай", icon: FaGem, color: "#4CAF50" },
  { value: 100, label: "Агроном", icon: FaUserAstronaut, color: "#FFA726" },
  { value: 1000, label: "Агроном Pro", icon: FaUserAstronaut, color: "#FFA726" },
]

const getRateInfo = (rate: number) => {
  if (rate === 0) return RATE_OPTIONS[0]
  if (rate <= 3) return RATE_OPTIONS[1]
  if (rate <= 10) return RATE_OPTIONS[2]
  if (rate <= 50) return RATE_OPTIONS[3]
  if (rate <= 100) return RATE_OPTIONS[4]
  return RATE_OPTIONS[5]
}

const ROLE_OPTIONS: { value: IUser["role"], label: string }[] = [
  { value: "user", label: "Пользователь" },
  { value: "admin", label: "Администратор" },
  { value: "root", label: "Root" },
]

const getRoleStyle = (role: string) => {
  switch (role) {
    case "root": return "text-amber-400 bg-amber-500/10 border-amber-500/20"
    case "admin": return "text-[#4CAF50] bg-[#4CAF50]/10 border-[#4CAF50]/20"
    default: return "text-white/40 bg-white/5 border-white/10"
  }
}

export default function UsersPage() {
  const navigate = useNavigate()
  const { success, error } = useNotifications()
  const [users, setUsers] = useState<IUser[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    psw: "",
    rate: 3 as number,
    blocked: false,
    role: "user" as IUser["role"]
  })
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [roleOpen, setRoleOpen] = useState(false)

  const loadUsers = useCallback(async () => {
    try {
      const result = await apiUserService.find()
      setUsers(Array.isArray(result) ? result : [])
    } catch (err) {
      error("Ошибка загрузки пользователей")
    } finally {
      setLoading(false)
    }
  }, [error])

  useEffect(() => { loadUsers() }, [loadUsers])

  const startEdit = (user: IUser) => {
    setEditingId(user._id)
    setEditForm({ 
      name: user.name, 
      email: user.email, 
      psw: "", 
      rate: user.rate, 
      role: user.role,
      blocked: user.blocked || false,
    })
    setExpandedId(user._id)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setExpandedId(null)
    setRoleOpen(false)
    setEditForm({ name: "", email: "", psw: "", rate: 3, role: "user", blocked: false })
  }

  const handleToggleBlocked = async (user: IUser) => {
    try {
      await apiUserService.updateUser({ 
        userId: user._id, 
        payload: { blocked: !user.blocked } 
      })
      setUsers(prev => prev.map(u => {
        if (u._id !== user._id) return u
        return { ...u, blocked: !user.blocked }
      }))
      success(user.blocked ? "Пользователь разблокирован" : "Пользователь заблокирован")
    } catch (err) {
      error("Ошибка обновления")
    }
  }

  const saveEdit = async (id: string) => {
    try {
      const data: Record<string, string | number | boolean> = {}
      const user = users.find(u => u._id === id)
      if (!user) return

      if (editForm.name !== user.name) data.name = editForm.name
      if (editForm.email !== user.email) data.email = editForm.email
      if (editForm.psw) data.psw = editForm.psw
      if (editForm.rate !== user.rate) data.rate = editForm.rate
      if (editForm.blocked !== user.blocked) data.blocked = editForm.blocked
      if (editForm.role !== user.role) data.role = editForm.role

      if (Object.keys(data).length === 0) {
        cancelEdit()
        return
      }

      await apiUserService.updateUser({ userId: id, payload: data })
      setUsers(prev => prev.map(u => {
        if (u._id !== id) return u
        return { ...u, name: editForm.name, email: editForm.email, rate: editForm.rate, blocked: editForm.blocked, role: editForm.role }
      }))
      cancelEdit()
      success("Пользователь обновлён")
    } catch (err) {
      error("Ошибка обновления")
    }
  }

  const filteredUsers = users.filter(u => {
    const s = search.toLowerCase()
    return u.name?.toLowerCase().includes(s) || u.email?.toLowerCase().includes(s)
  })

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-colors">
            <FaArrowLeft className="text-lg" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-light text-white tracking-[-0.02em] mb-1">
              Пользователи
            </h1>
            <p className="text-white/30 text-xs sm:text-sm font-light">
              {users.length} пользователей · {users.filter(u => u.blocked).length} заблокировано
            </p>
          </div>
        </div>

        <div className="relative mb-6">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 text-sm" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск по имени или email..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white placeholder-white/20 focus:outline-none focus:border-white/[0.12] transition-colors text-sm font-light"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-white/[0.06] border-t-[#4CAF50] rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-2">
            {filteredUsers.map(user => {
              const rateInfo = getRateInfo(user.rate)
              const RateIcon = rateInfo.icon
              const isEditing = editingId === user._id
              const isExpanded = expandedId === user._id

              return (
                <div 
                  key={user._id} 
                  className={`rounded-2xl border overflow-hidden transition-colors ${
                    user.blocked 
                      ? 'bg-[#E57373]/[0.02] border-[#E57373]/[0.08]' 
                      : 'bg-white/[0.02] border-white/[0.04]'
                  }`}
                >
                  <div 
                    className="p-4 sm:p-5 flex items-center justify-between cursor-pointer"
                    onClick={() => {
                      if (!isEditing) {
                        setExpandedId(isExpanded ? null : user._id)
                      }
                    }}
                  >
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium flex-shrink-0 ${
                        user.blocked ? 'bg-[#E57373]/10 text-[#E57373]' : 'bg-[#4CAF50]/10 text-[#4CAF50]'
                      }`}>
                        {user.blocked ? <FaLock className="text-xs" /> : user.name?.charAt(0).toUpperCase() || "?"}
                      </div>
                      
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`text-sm font-medium truncate ${user.blocked ? 'text-white/50' : 'text-white'}`}>{user.name}</p>
                          {user.blocked && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-md border border-[#E57373]/20 bg-[#E57373]/10 text-[#E57373] flex-shrink-0">
                              Заблокирован
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-white/25 font-light truncate">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                      <div className="hidden sm:flex items-center gap-2">
                        <RateIcon className="text-xs" style={{ color: rateInfo.color }} />
                        <span className="text-xs text-white/40 font-light">{rateInfo.label}</span>
                      </div>
                      
                      <span className={`hidden sm:inline text-[10px] px-1.5 py-0.5 rounded-md border ${getRoleStyle(user.role)}`}>
                        {user.role}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleToggleBlocked(user)
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors text-xs ${
                          user.blocked 
                            ? 'bg-[#4CAF50]/10 border-[#4CAF50]/20 text-[#4CAF50] hover:bg-[#4CAF50]/20'
                            : 'bg-[#E57373]/10 border-[#E57373]/20 text-[#E57373] hover:bg-[#E57373]/20'
                        }`}
                      >
                        {user.blocked ? (
                          <><FaUnlock className="text-[10px]" /><span className="hidden sm:inline">Разблокировать</span></>
                        ) : (
                          <><FaLock className="text-[10px]" /><span className="hidden sm:inline">Заблокировать</span></>
                        )}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          isEditing ? cancelEdit() : startEdit(user)
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/40 hover:text-white hover:bg-white/[0.08] transition-colors text-xs"
                      >
                        {isEditing ? (
                          <><FaTimes className="text-[10px]" /><span className="hidden sm:inline">Закрыть</span></>
                        ) : (
                          <><FiEdit3 className="text-[10px]" /><span className="hidden sm:inline">Изменить</span></>
                        )}
                      </button>

                      <div className="text-white/20">
                        {isExpanded && !isEditing ? <FaChevronUp className="text-[10px]" /> : <FaChevronDown className="text-[10px]" />}
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="px-5 pb-5 border-t border-white/[0.04]">
                      <div className="pt-5 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <InputField
                            icon={<FiUser className="text-[10px]" />}
                            label="Имя"
                            value={editForm.name}
                            onChange={v => setEditForm(prev => ({ ...prev, name: v }))}
                            placeholder="Имя пользователя"
                          />
                          <InputField
                            icon={<FiMail className="text-[10px]" />}
                            label="Email"
                            value={editForm.email}
                            onChange={v => setEditForm(prev => ({ ...prev, email: v }))}
                            placeholder="email@example.com"
                          />
                          <InputField
                            icon={<FaKey className="text-[10px]" />}
                            label="Пароль"
                            value={editForm.psw}
                            onChange={v => setEditForm(prev => ({ ...prev, psw: v }))}
                            placeholder="Оставьте пустым чтобы не менять"
                            hint="Оставьте пустым чтобы не менять пароль"
                          />
                          <Dropdown
                            icon={<FiShield className="text-[10px]" />}
                            label="Роль"
                            value={editForm.role}
                            options={ROLE_OPTIONS}
                            isOpen={roleOpen}
                            onToggle={() => setRoleOpen(!roleOpen)}
                            onSelect={(v) => {
                              setEditForm(prev => ({ ...prev, role: v as IUser["role"] }))
                              setRoleOpen(false)
                            }}
                          />
                        </div>

                        <div>
                          <label className="flex items-center gap-1.5 text-[10px] text-white/30 uppercase tracking-[0.05em] mb-3">
                            <FaCrown className="text-[10px]" />
                            Тариф
                          </label>
                          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                            {RATE_OPTIONS.map(opt => {
                              const OptIcon = opt.icon
                              const isActive = editForm.rate === opt.value
                              return (
                                <button
                                  key={opt.value}
                                  type="button"
                                  onClick={() => setEditForm(prev => ({ ...prev, rate: opt.value }))}
                                  className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border transition-colors text-center ${
                                    isActive 
                                      ? 'bg-white/[0.06] border-white/[0.15]' 
                                      : 'bg-transparent border-white/[0.04] hover:border-white/[0.08]'
                                  }`}
                                >
                                  <OptIcon className="text-sm" style={{ color: opt.color }} />
                                  <span className={`text-[10px] font-medium ${isActive ? 'text-white' : 'text-white/40'}`}>
                                    {opt.label}
                                  </span>
                                </button>
                              )
                            })}
                          </div>
                        </div>

                        <div>
                          <label className="flex items-center gap-1.5 text-[10px] text-white/30 uppercase tracking-[0.05em] mb-3">
                            <FaLock className="text-[10px]" />
                            Блокировка
                          </label>
                          <button
                            type="button"
                            onClick={() => setEditForm(prev => ({ ...prev, blocked: !prev.blocked }))}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-colors text-sm font-light ${
                              editForm.blocked
                                ? 'bg-[#E57373]/10 border-[#E57373]/20 text-[#E57373]'
                                : 'bg-white/[0.04] border-white/[0.06] text-white/60'
                            }`}
                          >
                            {editForm.blocked ? (
                              <><FaLock className="text-xs" /> Заблокирован</>
                            ) : (
                              <><FaUnlock className="text-xs" /> Активен</>
                            )}
                          </button>
                        </div>

                        <div className="flex items-center gap-3 pt-4 border-t border-white/[0.04]">
                          <button
                            onClick={() => saveEdit(user._id)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4CAF50]/20 border border-[#4CAF50]/30 text-[#4CAF50] text-sm font-medium transition-colors hover:bg-[#4CAF50]/30"
                          >
                            <FaCheck className="text-xs" />
                            Сохранить
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white/40 text-sm font-medium transition-colors hover:bg-white/[0.08] hover:text-white/60"
                          >
                            <FaTimes className="text-xs" />
                            Отмена
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {isExpanded && !isEditing && (
                    <div className="px-5 pb-5 border-t border-white/[0.04]">
                      <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="flex items-center gap-2 text-white/25">
                          <FiCalendar className="text-[10px] text-white/15" />
                          <span>{new Date(user.createdAt).toLocaleDateString("ru")}</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/25">
                          <FiShield className="text-[10px] text-white/15" />
                          <span className={`px-1.5 py-0.5 rounded-md border ${getRoleStyle(user.role)}`}>
                            {user.role}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-white/25">
                          <RateIcon className="text-[10px]" style={{ color: rateInfo.color }} />
                          <span>{rateInfo.label}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}

            {filteredUsers.length === 0 && (
              <div className="py-16 text-center text-sm text-white/15 font-light">
                Пользователи не найдены
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const InputField = ({ icon, label, value, onChange, placeholder, hint }: {
  icon: React.ReactNode
  label: string
  value: string
  onChange: (v: string) => void
  placeholder: string
  hint?: string
}) => (
  <div>
    <label className="flex items-center gap-1.5 text-[10px] text-white/30 uppercase tracking-[0.05em] mb-2">
      {icon}
      {label}
    </label>
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full px-3 py-2.5 rounded-xl bg-[#1E3A1E] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-[#4CAF50] transition-colors font-light placeholder-white/15"
      placeholder={placeholder}
    />
    {hint && <p className="text-[10px] text-white/15 mt-1 font-light">{hint}</p>}
  </div>
)

const Dropdown = ({ icon, label, value, options, isOpen, onToggle, onSelect }: {
  icon: React.ReactNode
  label: string
  value: string
  options: { value: string; label: string }[]
  isOpen: boolean
  onToggle: () => void
  onSelect: (v: string) => void
}) => {
  const selected = options.find(o => o.value === value)

  return (
    <div className="relative">
      <label className="flex items-center gap-1.5 text-[10px] text-white/30 uppercase tracking-[0.05em] mb-2">
        {icon}
        {label}
      </label>
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-[#1E3A1E] border border-white/[0.08] text-white text-sm transition-colors font-light hover:border-white/[0.12]"
      >
        <span>{selected?.label || value}</span>
        <FaChevronDown className={`text-[10px] text-white/30 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 rounded-xl bg-[#1A2E1A] border border-white/[0.10] shadow-[0_8px_24px_rgba(0,0,0,0.4)] overflow-hidden z-20">
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onSelect(opt.value)}
              className={`w-full text-left px-3 py-2.5 text-sm transition-colors font-light ${
                opt.value === value 
                  ? 'bg-white/[0.06] text-white' 
                  : 'text-white/50 hover:bg-white/[0.04] hover:text-white/80'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
