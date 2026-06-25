import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { 
  FaArrowLeft, FaSearch, FaEdit, FaTimes, FaCrown,
  FaRocket, FaLeaf, FaGem, FaUserAstronaut,
  FaKey, FaCheck, FaShieldAlt
} from "react-icons/fa"
import { FiUser, FiMail } from "react-icons/fi"
import type { IUser } from "../../pkg/types/user"
import apiUserService from "../../pkg/api/api.user.service"

const RATE_OPTIONS = [
  { value: 0, label: "Создатель", icon: FaCrown, color: "#F59E0B", limit: "∞" },
  { value: 1, label: "Росток", icon: FaRocket, color: "#26A5E4", limit: "3/день" },
  { value: 2, label: "Колос", icon: FaLeaf, color: "#34D399", limit: "10/день" },
  { value: 3, label: "Урожай", icon: FaGem, color: "#4CAF50", limit: "50/день" },
  { value: 4, label: "Агроном", icon: FaUserAstronaut, color: "#FFA726", limit: "100/день" },
  { value: 5, label: "Агроном Pro", icon: FaUserAstronaut, color: "#FFA726", limit: "1000/день" },
]

const ROLE_OPTIONS: { value: IUser["role"], label: string }[] = [
  { value: "user", label: "Пользователь" },
  { value: "admin", label: "Администратор" },
  { value: "root", label: "Root" },
]

const getRateInfo = (rate: number) => RATE_OPTIONS.find(r => r.value === rate) || RATE_OPTIONS[1]

const getRoleStyle = (role: string) => {
  switch (role) {
    case "root": return "text-amber-400 bg-amber-500/10 border-amber-500/20"
    case "admin": return "text-[#4CAF50] bg-[#4CAF50]/10 border-[#4CAF50]/20"
    default: return "text-white/40 bg-white/5 border-white/10"
  }
}

export default function UsersPage() {
  const navigate = useNavigate()
  const [users, setUsers] = useState<IUser[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    psw: "",
    rate: 1 as number,
    role: "user" as IUser["role"]
  })
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null)

  const loadUsers = useCallback(async () => {
    try {
      const result = await apiUserService.find()
      setUsers(Array.isArray(result) ? result : [])
    } catch (err) {
      setMessage({ type: "error", text: "Ошибка загрузки пользователей" })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadUsers() }, [loadUsers])

  const startEdit = (user: IUser) => {
    setEditingId(user._id)
    setEditForm({ name: user.name, email: user.email, psw: "", rate: user.rate, role: user.role })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({ name: "", email: "", psw: "", rate: 1, role: "user" })
  }

  const saveEdit = async (id: string) => {
    try {
      const data: Record<string, string | number> = {}
      const user = users.find(u => u._id === id)
      if (!user) return

      if (editForm.name !== user.name) data.name = editForm.name
      if (editForm.email !== user.email) data.email = editForm.email
      if (editForm.psw) data.psw = editForm.psw
      if (editForm.rate !== user.rate) data.rate = editForm.rate
      if (editForm.role !== user.role) data.role = editForm.role

      if (Object.keys(data).length === 0) {
        cancelEdit()
        return
      }

      await apiUserService.updateUser({ userId: id, payload: data })
      setUsers(prev => prev.map(u => {
        if (u._id !== id) return u
        return { ...u, name: editForm.name, email: editForm.email, rate: editForm.rate, role: editForm.role }
      }))
      cancelEdit()
      setMessage({ type: "success", text: "Пользователь обновлён" })
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      setMessage({ type: "error", text: "Ошибка обновления" })
    }
  }

  const filteredUsers = users.filter(u => {
    const s = search.toLowerCase()
    return u.name?.toLowerCase().includes(s) || u.email?.toLowerCase().includes(s)
  })

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-colors">
            <FaArrowLeft className="text-lg" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-light text-white tracking-[-0.02em] mb-1">
              Пользователи
            </h1>
            <p className="text-white/30 text-xs sm:text-sm font-light">
              {users.length} пользователей
            </p>
          </div>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-xl border text-sm ${
            message.type === "success" 
              ? "bg-[#4CAF50]/10 border-[#4CAF50]/20 text-[#4CAF50]" 
              : "bg-[#E57373]/10 border-[#E57373]/20 text-[#E57373]"
          }`}>
            {message.text}
          </div>
        )}

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
              const roleStyle = getRoleStyle(user.role)

              return (
                <div 
                  key={user._id} 
                  className={`rounded-2xl border transition-all duration-300 ${
                    isEditing 
                      ? 'bg-white/[0.04] border-white/[0.10]' 
                      : 'bg-white/[0.02] border-white/[0.04] hover:border-white/[0.06]'
                  }`}
                >
                  {isEditing ? (
                    <EditMode
                      editForm={editForm}
                      onChange={setEditForm}
                      onSave={() => saveEdit(user._id)}
                      onCancel={cancelEdit}
                    />
                  ) : (
                    <ViewMode
                      user={user}
                      rateInfo={rateInfo}
                      RateIcon={RateIcon}
                      roleStyle={roleStyle}
                      onEdit={() => startEdit(user)}
                    />
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

const ViewMode = ({ user, rateInfo, RateIcon, roleStyle, onEdit }: {
  user: IUser
  rateInfo: typeof RATE_OPTIONS[0]
  RateIcon: typeof FaCrown
  roleStyle: string
  onEdit: () => void
}) => (
  <div className="p-4 sm:p-5">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-[#4CAF50]/10 flex items-center justify-center text-sm font-medium text-[#4CAF50] flex-shrink-0">
          {user.name?.charAt(0).toUpperCase() || "?"}
        </div>
        
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-sm font-medium text-white truncate">{user.name}</p>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-md border ${roleStyle}`}>
              {user.role}
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-white/25 font-light">
            <span className="flex items-center gap-1">
              <FiMail className="text-[10px]" />
              {user.email}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0 ml-4">
        <div className="hidden sm:flex items-center gap-2">
          <RateIcon className="text-xs" style={{ color: rateInfo.color }} />
          <span className="text-xs text-white/40 font-light">{rateInfo.label}</span>
        </div>
        
        <div className="hidden sm:block text-[11px] text-white/20 font-light">
          {new Date(user.createdAt).toLocaleDateString("ru")}
        </div>

        <button
          onClick={onEdit}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/40 hover:text-white hover:bg-white/[0.08] hover:border-white/[0.10] transition-colors text-xs"
        >
          <FaEdit className="text-[10px]" />
          <span className="hidden sm:inline">Изменить</span>
        </button>
      </div>
    </div>
  </div>
)

const EditMode = ({ editForm, onChange, onSave, onCancel }: {
  editForm: { name: string; email: string; psw: string; rate: number; role: IUser["role"] }
  onChange: (form: typeof editForm) => void
  onSave: () => void
  onCancel: () => void
}) => (
  <div className="p-5 sm:p-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      <div>
        <label className="flex items-center gap-1.5 text-[10px] text-white/30 uppercase tracking-[0.05em] mb-2">
          <FiUser className="text-[10px]" />
          Имя
        </label>
        <input
          type="text"
          value={editForm.name}
          onChange={e => onChange({ ...editForm, name: e.target.value })}
          className="w-full px-3 py-2.5 rounded-xl bg-[#1E3A1E] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-[#4CAF50] transition-colors font-light placeholder-white/15"
          placeholder="Имя пользователя"
        />
      </div>

      <div>
        <label className="flex items-center gap-1.5 text-[10px] text-white/30 uppercase tracking-[0.05em] mb-2">
          <FiMail className="text-[10px]" />
          Email
        </label>
        <input
          type="email"
          value={editForm.email}
          onChange={e => onChange({ ...editForm, email: e.target.value })}
          className="w-full px-3 py-2.5 rounded-xl bg-[#1E3A1E] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-[#4CAF50] transition-colors font-light placeholder-white/15"
          placeholder="email@example.com"
        />
      </div>

      <div>
        <label className="flex items-center gap-1.5 text-[10px] text-white/30 uppercase tracking-[0.05em] mb-2">
          <FaKey className="text-[10px]" />
          Пароль
        </label>
        <input
          type="text"
          value={editForm.psw}
          onChange={e => onChange({ ...editForm, psw: e.target.value })}
          className="w-full px-3 py-2.5 rounded-xl bg-[#1E3A1E] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-[#4CAF50] transition-colors font-light placeholder-white/15"
          placeholder="Оставьте пустым чтобы не менять"
        />
        <p className="text-[10px] text-white/15 mt-1 font-light">Оставьте пустым чтобы не менять пароль</p>
      </div>

      <div>
        <label className="flex items-center gap-1.5 text-[10px] text-white/30 uppercase tracking-[0.05em] mb-2">
          <FaShieldAlt className="text-[10px]" />
          Роль
        </label>
        <select
          value={editForm.role}
          onChange={e => onChange({ ...editForm, role: e.target.value as IUser["role"] })}
          className="w-full px-3 py-2.5 rounded-xl bg-[#1E3A1E] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-[#4CAF50] transition-colors font-light"
        >
          {ROLE_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className="sm:col-span-2">
        <label className="flex items-center gap-1.5 text-[10px] text-white/30 uppercase tracking-[0.05em] mb-2">
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
                onClick={() => onChange({ ...editForm, rate: opt.value })}
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
                <span className="text-[9px] text-white/20">{opt.limit}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>

    <div className="flex items-center gap-3 pt-4 border-t border-white/[0.04]">
      <button
        onClick={onSave}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4CAF50]/20 border border-[#4CAF50]/30 text-[#4CAF50] text-sm font-medium transition-colors hover:bg-[#4CAF50]/30"
      >
        <FaCheck className="text-xs" />
        Сохранить
      </button>
      <button
        onClick={onCancel}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white/40 text-sm font-medium transition-colors hover:bg-white/[0.08] hover:text-white/60"
      >
        <FaTimes className="text-xs" />
        Отмена
      </button>
    </div>
  </div>
)
