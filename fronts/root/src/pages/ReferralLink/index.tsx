import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { 
  FaArrowLeft, FaPlus, FaTimes, FaCheck, FaTrash, FaCrown,
  FaRocket, FaLeaf, FaGem, FaUserAstronaut, FaChevronDown, FaChevronUp,
  FaCopy, FaLink, FaUsers, FaPowerOff, FaKey, FaExternalLinkAlt
} from "react-icons/fa"
import { FiShield, FiEdit3, FiCalendar, FiRefreshCw } from "react-icons/fi"
import apiReferralLinkService, { type IReferralLink } from "../../pkg/api/api.referralLink.service"

const RATE_OPTIONS = [
  { value: 3, label: "Росток", icon: FaRocket, color: "#26A5E4", limit: "3/день" },
  { value: 10, label: "Колос", icon: FaLeaf, color: "#34D399", limit: "10/день" },
  { value: 50, label: "Урожай", icon: FaGem, color: "#4CAF50", limit: "50/день" },
  { value: 100, label: "Агроном", icon: FaUserAstronaut, color: "#FFA726", limit: "100/день" },
  { value: 1000, label: "Агроном Pro", icon: FaUserAstronaut, color: "#FFA726", limit: "1000/день" },
  { value: 0, label: "Создатель", icon: FaCrown, color: "#F59E0B", limit: "∞" },
]

const getRateInfo = (rate: number) => RATE_OPTIONS.find(r => r.value === rate) || RATE_OPTIONS[0]

const ROLE_OPTIONS: { value: string, label: string }[] = [
  { value: "user", label: "Пользователь" },
  { value: "admin", label: "Администратор" },
  { value: "root", label: "Root" },
]

const generateCode = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

const getReferralUrl = (code: string) => `https://admin.postfarm.ru/signup/${code}`

export default function ReferralLinksPage() {
  const navigate = useNavigate()
  const [links, setLinks] = useState<IReferralLink[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [roleOpen, setRoleOpen] = useState(false)
  
  const [form, setForm] = useState({
    code: "",
    creationLimit: 1,
    source: "",
    rate: 3,
    role: "user" as string,
  })

  const loadLinks = useCallback(async () => {
    try {
      const result = await apiReferralLinkService.find()
      setLinks(Array.isArray(result) ? result : [])
    } catch (err) {
      setMessage({ type: "error", text: "Ошибка загрузки ссылок" })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadLinks() }, [loadLinks])

  const resetForm = () => {
    setForm({ code: "", creationLimit: 1, source: "", rate: 3, role: "user" })
    setIsCreating(false)
    setEditingId(null)
    setRoleOpen(false)
  }

  const handleCreate = async () => {
  try {
    await apiReferralLinkService.create({
      code: form.code || generateCode(),
      creationLimit: form.creationLimit,
      source: form.source,
      rate:form.rate,
      role: form.role,
    })
    await loadLinks()
    resetForm()
    setMessage({ type: "success", text: "Ссылка создана" })
    setTimeout(() => setMessage(null), 3000)
  } catch (err) {
    setMessage({ type: "error", text: "Ошибка создания ссылки" })
  }
}

const handleUpdate = async (id: string) => {
  try {
    await apiReferralLinkService.update(id, {
      ...form,
      rate: form.rate,
    })
    await loadLinks()
    resetForm()
    setMessage({ type: "success", text: "Ссылка обновлена" })
    setTimeout(() => setMessage(null), 3000)
  } catch (err) {
    setMessage({ type: "error", text: "Ошибка обновления ссылки" })
  }
}

  const handleDelete = async (id: string) => {
    try {
      await apiReferralLinkService.remove(id)
      await loadLinks()
      setMessage({ type: "success", text: "Ссылка удалена" })
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      setMessage({ type: "error", text: "Ошибка удаления ссылки" })
    }
  }

  const handleToggleActive = async (link: IReferralLink) => {
    try {
      await apiReferralLinkService.update(link._id, { active: !link.active })
      await loadLinks()
    } catch (err) {
      setMessage({ type: "error", text: "Ошибка обновления" })
    }
  }

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(getReferralUrl(code))
    setMessage({ type: "success", text: "Ссылка скопирована" })
    setTimeout(() => setMessage(null), 2000)
  }

  const startEdit = (link: IReferralLink) => {
    setEditingId(link._id)
    setIsCreating(true)
    setForm({
      code: link.code,
      creationLimit: link.creationLimit,
      source: link.source,
      rate: link.rate,
      role: link.role,
    })
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-colors">
              <FaArrowLeft className="text-lg" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-light text-white tracking-[-0.02em] mb-1">
                Реферальные ссылки
              </h1>
              <p className="text-white/30 text-xs sm:text-sm font-light">
                {links.length} ссылок · {links.filter(l => l.active).length} активных
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              resetForm()
              setForm(prev => ({ ...prev, code: generateCode() }))
              setIsCreating(true)
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#4CAF50]/20 border border-[#4CAF50]/30 text-[#4CAF50] text-sm font-medium transition-colors hover:bg-[#4CAF50]/30"
          >
            <FaPlus className="text-xs" />
            <span className="hidden sm:inline">Создать ссылку</span>
          </button>
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

        {isCreating && (
          <div className="mb-6 rounded-2xl bg-white/[0.04] border border-white/[0.10] overflow-hidden">
            <div className="p-5 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="flex items-center gap-1.5 text-[10px] text-white/30 uppercase tracking-[0.05em] mb-2">
                    <FaKey className="text-[10px]" />
                    Код ссылки
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={form.code}
                      onChange={e => setForm(prev => ({ ...prev, code: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#1E3A1E] border border-white/[0.08] text-white/60 text-sm focus:outline-none focus:border-[#4CAF50] transition-colors font-light font-mono pr-10"
                      placeholder="UUID генерируется автоматически"
                    />
                    <button
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, code: generateCode() }))}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.06] transition-colors"
                    >
                      <FiRefreshCw className="text-xs" />
                    </button>
                  </div>
                </div>

                <InputField
                  icon={<FaUsers className="text-[10px]" />}
                  label="Лимит регистраций"
                  type="number"
                  value={form.creationLimit}
                  onChange={v => setForm(prev => ({ ...prev, creationLimit: Number(v) }))}
                  placeholder="10"
                />

                <InputField
                  icon={<FaLink className="text-[10px]" />}
                  label="Источник"
                  value={form.source}
                  onChange={v => setForm(prev => ({ ...prev, source: v }))}
                  placeholder="telegram"
                />

                <Dropdown
                  icon={<FiShield className="text-[10px]" />}
                  label="Роль"
                  value={form.role}
                  options={ROLE_OPTIONS}
                  isOpen={roleOpen}
                  onToggle={() => setRoleOpen(!roleOpen)}
                  onSelect={(v) => {
                    setForm(prev => ({ ...prev, role: v }))
                    setRoleOpen(false)
                  }}
                />
              </div>

              <div className="mb-4">
                <label className="flex items-center gap-1.5 text-[10px] text-white/30 uppercase tracking-[0.05em] mb-3">
                  <FaCrown className="text-[10px]" />
                  Тариф
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {RATE_OPTIONS.map(opt => {
                    const OptIcon = opt.icon
                    const isActive = form.rate === opt.value
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setForm(prev => ({ ...prev, rate: opt.value }))}
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

              <div className="flex items-center gap-3 pt-4 border-t border-white/[0.04]">
                <button
                  onClick={editingId ? () => handleUpdate(editingId) : handleCreate}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4CAF50]/20 border border-[#4CAF50]/30 text-[#4CAF50] text-sm font-medium transition-colors hover:bg-[#4CAF50]/30"
                >
                  <FaCheck className="text-xs" />
                  {editingId ? "Сохранить" : "Создать"}
                </button>
                <button
                  onClick={resetForm}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white/40 text-sm font-medium transition-colors hover:bg-white/[0.08] hover:text-white/60"
                >
                  <FaTimes className="text-xs" />
                  Отмена
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-white/[0.06] border-t-[#4CAF50] rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-2">
            {links.map(link => {
              const rateInfo = getRateInfo(link.rate)
              const RateIcon = rateInfo.icon
              const isExpanded = expandedId === link._id
              const usagePercent = link.creationLimit > 0 
                ? Math.min(100, (link.createdByLink / link.creationLimit) * 100) 
                : 0
              const referralUrl = getReferralUrl(link.code)

              return (
                <div 
                  key={link._id} 
                  className="rounded-2xl bg-white/[0.02] border border-white/[0.04] overflow-hidden transition-colors"
                >
                  <div 
                    className="p-4 sm:p-5 flex items-center justify-between cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : link._id)}
                  >
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        link.active ? 'bg-[#4CAF50]/10' : 'bg-white/[0.03]'
                      }`}>
                        <FaLink className={`text-sm ${link.active ? 'text-[#4CAF50]' : 'text-white/20'}`} />
                      </div>
                      
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-medium text-white truncate font-mono">{link.code.slice(0, 8)}...</p>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-md border ${
                            link.active 
                              ? 'text-[#4CAF50] bg-[#4CAF50]/10 border-[#4CAF50]/20' 
                              : 'text-white/30 bg-white/[0.02] border-white/[0.04]'
                          }`}>
                            {link.active ? 'Активна' : 'Отключена'}
                          </span>
                        </div>
                        <p className="text-[11px] text-white/25 font-light truncate">{link.source}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                      <div className="hidden sm:flex items-center gap-2">
                        <RateIcon className="text-xs" style={{ color: rateInfo.color }} />
                        <span className="text-xs text-white/40 font-light">{rateInfo.label}</span>
                      </div>

                      <div className="hidden sm:flex items-center gap-1 text-xs text-white/25 font-light">
                        <FaUsers className="text-[10px]" />
                        <span>{link.createdByLink}/{link.creationLimit}</span>
                      </div>

                      <div className="text-white/20">
                        {isExpanded ? <FaChevronUp className="text-[10px]" /> : <FaChevronDown className="text-[10px]" />}
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-5 pb-5 border-t border-white/[0.04]">
                      <div className="pt-4 space-y-3">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                            <div 
                              className="h-full rounded-full bg-[#4CAF50] transition-all"
                              style={{ width: `${usagePercent}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-white/25 font-light">
                            {link.createdByLink}/{link.creationLimit}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                          <FaLink className="text-[10px] text-white/20 flex-shrink-0" />
                          <span className="text-xs text-white/40 font-light font-mono truncate flex-1">{referralUrl}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              copyToClipboard(link.code)
                            }}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/40 hover:text-white hover:bg-white/[0.08] transition-colors text-[10px] flex-shrink-0"
                          >
                            <FaCopy className="text-[8px]" />
                            Копировать
                          </button>
                          <a
                            href={referralUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/40 hover:text-white hover:bg-white/[0.08] transition-colors text-[10px] flex-shrink-0"
                          >
                            <FaExternalLinkAlt className="text-[8px]" />
                            Открыть
                          </a>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                          <div className="flex items-center gap-2 text-white/25">
                            <FiCalendar className="text-[10px] text-white/15" />
                            <span>{new Date(link.date).toLocaleDateString("ru")}</span>
                          </div>
                          <div className="flex items-center gap-2 text-white/25">
                            <FiShield className="text-[10px] text-white/15" />
                            <span>{link.role}</span>
                          </div>
                          <div className="flex items-center gap-2 text-white/25">
                            <RateIcon className="text-[10px]" style={{ color: rateInfo.color }} />
                            <span>{rateInfo.label} · {rateInfo.limit}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-3 border-t border-white/[0.04]">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              startEdit(link)
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/40 hover:text-white hover:bg-white/[0.08] transition-colors text-xs"
                          >
                            <FiEdit3 className="text-[10px]" />
                            Изменить
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleToggleActive(link)
                            }}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors text-xs ${
                              link.active 
                                ? 'bg-white/[0.04] border-white/[0.06] text-white/40 hover:text-white hover:bg-white/[0.08]'
                                : 'bg-[#4CAF50]/10 border-[#4CAF50]/20 text-[#4CAF50] hover:bg-[#4CAF50]/20'
                            }`}
                          >
                            <FaPowerOff className="text-[10px]" />
                            {link.active ? 'Отключить' : 'Включить'}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(link._id)
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E57373]/10 border border-[#E57373]/20 text-[#E57373] hover:bg-[#E57373]/20 transition-colors text-xs ml-auto"
                          >
                            <FaTrash className="text-[10px]" />
                            <span className="hidden sm:inline">Удалить</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}

            {links.length === 0 && !loading && (
              <div className="py-16 text-center text-sm text-white/15 font-light">
                Нет реферальных ссылок
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const InputField = ({ icon, label, value, onChange, placeholder, type = "text" }: {
  icon: React.ReactNode
  label: string
  value: string | number
  onChange: (v: string) => void
  placeholder: string
  type?: string
}) => (
  <div>
    <label className="flex items-center gap-1.5 text-[10px] text-white/30 uppercase tracking-[0.05em] mb-2">
      {icon}
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full px-3 py-2.5 rounded-xl bg-[#1E3A1E] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-[#4CAF50] transition-colors font-light placeholder-white/15"
      placeholder={placeholder}
    />
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
