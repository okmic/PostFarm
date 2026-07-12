import { useState, useMemo } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import type { RootState } from "../../store/store"
import { 
  FaArrowLeft, FaChartLine, FaFire, FaClock, FaRobot,
  FaCoins, FaBolt, FaStar, FaCrown, FaGem, FaRocket,
  FaUserAstronaut, FaLeaf, FaInfinity
} from "react-icons/fa"
import { FiInfo, FiTrendingUp, FiTarget, FiZap } from "react-icons/fi"

const RATE_CONFIG: Record<number, {
  name: string
  icon: typeof FaStar
  color: string
  bg: string
  border: string
  gradient: string
  dailyLimit: number
  level: string
  stars: number
}> = {
  0: {
    name: "Создатель",
    icon: FaCrown,
    color: "#F59E0B",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    gradient: "from-amber-500/20 via-yellow-500/10 to-[#FFA726]/20",
    dailyLimit: Infinity,
    level: "Безлимитный доступ ко всем функциям",
    stars: 5
  },
  1: {
    name: "Росток",
    icon: FaRocket,
    color: "#26A5E4",
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
    gradient: "from-sky-500/20 via-blue-500/10 to-cyan-500/20",
    dailyLimit: 3,
    level: "До 3 генераций в день",
    stars: 1
  },
  2: {
    name: "Колос",
    icon: FaLeaf,
    color: "#34D399",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    gradient: "from-emerald-500/20 via-teal-500/10 to-cyan-500/20",
    dailyLimit: 10,
    level: "До 10 генераций в день",
    stars: 2
  },
  3: {
    name: "Урожай",
    icon: FaGem,
    color: "#4CAF50",
    bg: "bg-[#4CAF50]/10",
    border: "border-[#4CAF50]/20",
    gradient: "from-[#4CAF50]/20 via-emerald-500/10 to-teal-500/20",
    dailyLimit: 50,
    level: "До 50 генераций в день",
    stars: 3
  },
  4: {
    name: "Агроном",
    icon: FaUserAstronaut,
    color: "#FFA726",
    bg: "bg-[#FFA726]/10",
    border: "border-[#FFA726]/20",
    gradient: "from-[#FFA726]/20 via-orange-500/10 to-amber-500/20",
    dailyLimit: 100,
    level: "До 100 генераций в день",
    stars: 4
  },
  5: {
    name: "Агроном Pro",
    icon: FaUserAstronaut,
    color: "#FFA726",
    bg: "bg-[#FFA726]/10",
    border: "border-[#FFA726]/20",
    gradient: "from-[#FFA726]/20 via-orange-500/10 to-amber-500/20",
    dailyLimit: 1000,
    level: "До 1000 генераций в день",
    stars: 5
  }
}

const getRateConfig = (rate: number) => {
  if (rate === 0) return RATE_CONFIG[0]
  if (rate <= 3) return RATE_CONFIG[1]
  if (rate <= 10) return RATE_CONFIG[2]
  if (rate <= 50) return RATE_CONFIG[3]
  if (rate <= 100) return RATE_CONFIG[4]
  return RATE_CONFIG[5]
}

const SERVICE_INFO: Record<string, { label: string; icon: typeof FaFire; color: string; bg: string }> = {
  "service.chronicle": { label: "Хроника", icon: FaClock, color: "#FFA726", bg: "bg-[#FFA726]/10" },
  "service.headline": { label: "Заголовки", icon: FaFire, color: "#FF7043", bg: "bg-[#FF7043]/10" },
  "service.education": { label: "Обучение", icon: FaStar, color: "#8B5CF6", bg: "bg-[#8B5CF6]/10" },
  "service.post_channel_content": { label: "Контент", icon: FaRobot, color: "#26A5E4", bg: "bg-[#26A5E4]/10" }
}

const getServiceInfo = (service: string) => {
  return SERVICE_INFO[service] || { label: service, icon: FaFire, color: "#9CA3AF", bg: "bg-gray-500/10" }
}

type Period = "today" | "week" | "month" | "all"

export default function StatsPage() {
  const navigate = useNavigate()
  const store = useSelector((s: RootState) => s.tenantStore)
  const user = useSelector((s: RootState) => s.auth.user)
  
  const [period, setPeriod] = useState<Period>("today")
  const [selectedService, setSelectedService] = useState<string>("all")

  const userRate = typeof user?.rate === 'number' ? user.rate : 3
  const rateConfig = getRateConfig(userRate)
  const RateIcon = rateConfig.icon

  const tokenHistory = Array.isArray(store?.usageTokens?.history) ? store.usageTokens.history : []
  const tokenLimit: number = store?.usageTokens?.limit || rateConfig.dailyLimit
  const usedToday: number = store?.usageTokens?.usedToday || 0
  const posts = Array.isArray(store?.posts) ? store.posts : []

  const now = new Date()
  const periodStart = useMemo(() => {
    switch(period) {
      case "today": return new Date(now.getFullYear(), now.getMonth(), now.getDate())
      case "week": return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      case "month": return new Date(now.getFullYear(), now.getMonth(), 1)
      case "all": return new Date(0)
    }
  }, [period, now])

  const filteredTokens = useMemo(() => 
    tokenHistory.filter(t => {
      if (!t?.createdAt) return false
      const tokenDate = new Date(t.createdAt)
      const matchesPeriod = tokenDate >= periodStart
      const matchesService = selectedService === "all" || t.service === selectedService
      return matchesPeriod && matchesService
    })
  , [tokenHistory, periodStart, selectedService])

  const filteredPosts = useMemo(() => 
    posts.filter(p => {
      if (!p?.createdAt) return false
      const postDate = new Date(p.createdAt)
      return postDate >= periodStart
    })
  , [posts, periodStart])

  const displayLimit = tokenLimit === Infinity ? Infinity : (tokenLimit || rateConfig.dailyLimit)
  const limitPercent = displayLimit === Infinity || displayLimit === 0 ? 0 : Math.min(100, (usedToday / displayLimit) * 100)
  const isLimitReached = displayLimit !== Infinity && displayLimit > 0 && usedToday >= displayLimit

  const totalTokens = filteredTokens.reduce((sum, t) => sum + (t.usageTokens || 0), 0)
  const totalGenerations = filteredTokens.length
  const aiPostsCount = filteredPosts.filter(p => p.isAI).length
  const aiPostPercent = filteredPosts.length > 0 ? Math.round((aiPostsCount / filteredPosts.length) * 100) : 0

  const serviceBreakdown = useMemo(() => {
    const breakdown: Record<string, { tokens: number; count: number }> = {}
    filteredTokens.forEach(t => {
      const service = t.service || "unknown"
      if (!breakdown[service]) breakdown[service] = { tokens: 0, count: 0 }
      breakdown[service].tokens += t.usageTokens || 0
      breakdown[service].count++
    })
    return Object.entries(breakdown)
      .map(([service, data]) => ({ service, ...data }))
      .sort((a, b) => b.tokens - a.tokens)
  }, [filteredTokens])

  const periodLabels: Record<Period, string> = {
    today: "Сегодня",
    week: "7 дней",
    month: "Месяц",
    all: "Всё время"
  }

  const formatTokens = (tokens: number) => {
    if (tokens >= 1_000_000) return `${(tokens / 1_000_000).toFixed(1)}M`
    if (tokens >= 1_000) return `${(tokens / 1_000).toFixed(1)}K`
    return tokens.toString()
  }

  const limitColor = isLimitReached 
    ? "from-[#E57373] to-[#EF5350]" 
    : limitPercent > 80 
      ? "from-[#FFA726] to-[#FF9800]" 
      : "from-[#4CAF50] to-[#66BB6A]"

  const renderStars = (count: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar 
        key={i} 
        className={`text-[8px] ${i < count ? '' : 'text-white/10'}`} 
        style={i < count ? { color: rateConfig.color } : {}}
      />
    ))
  }

  return (
    <div className="min-h-screen">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-colors">
            <FaArrowLeft className="text-lg" />
          </button>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-[-0.02em]">Статистика</h1>
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${rateConfig.gradient} border ${rateConfig.border}`}>
                <RateIcon className="text-xs" style={{ color: rateConfig.color }} />
                <span className="text-xs font-medium" style={{ color: rateConfig.color }}>{rateConfig.name}</span>
                <div className="flex items-center gap-0.5 ml-1">
                  {renderStars(rateConfig.stars)}
                </div>
              </div>
            </div>
            <p className="text-white/40 text-xs sm:text-sm">{rateConfig.level}</p>
          </div>
        </div>

        <div className="mb-6 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${rateConfig.bg} border ${rateConfig.border} flex items-center justify-center`}>
                <FaBolt className="text-sm" style={{ color: rateConfig.color }} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-white">Дневной лимит</h3>
                <p className="text-[11px] text-white/30">Генераций использовано сегодня</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">
                {usedToday}
                <span className="text-lg text-white/30 font-normal"> / {displayLimit === Infinity ? "∞" : displayLimit}</span>
              </div>
              <div className="text-[10px] text-white/20">генераций сегодня</div>
            </div>
          </div>
          
          <div className="relative h-3 rounded-full bg-white/10 overflow-hidden mb-3">
            <div 
              className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r transition-all duration-700 ease-out ${limitColor}`}
              style={{ width: `${displayLimit === Infinity ? 0 : limitPercent}%` }}
            />
          </div>
          
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-white/20">0</span>
            {displayLimit !== Infinity && limitPercent > 0 && (
              <span className="text-white/40">{Math.round(limitPercent)}%</span>
            )}
            <span className="text-white/20">{displayLimit === Infinity ? "∞" : displayLimit}</span>
          </div>
          
          {isLimitReached && displayLimit !== Infinity && (
            <div className="mt-4 p-3 rounded-xl bg-[#E57373]/10 border border-[#E57373]/20 text-[#E57373] text-xs flex items-center gap-2">
              <FiInfo className="flex-shrink-0" />
              <span>Лимит исчерпан. Обновится завтра или повысьте тариф в настройках.</span>
            </div>
          )}
          
          {!isLimitReached && displayLimit !== Infinity && limitPercent > 80 && (
            <div className="mt-4 p-3 rounded-xl bg-[#FFA726]/10 border border-[#FFA726]/20 text-[#FFA726] text-xs flex items-center gap-2">
              <FiInfo className="flex-shrink-0" />
              <span>Осталось {displayLimit - usedToday} генераций.</span>
            </div>
          )}
          
          {displayLimit === Infinity && (
            <div className="mt-4 p-3 rounded-xl bg-[#4CAF50]/10 border border-[#4CAF50]/20 text-[#4CAF50] text-xs flex items-center gap-2">
              <FaInfinity className="flex-shrink-0" />
              <span>Безлимитный доступ. Используйте без ограничений.</span>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
            {(Object.keys(periodLabels) as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  period === p ? "bg-[#4CAF50]/20 text-[#4CAF50]" : "text-white/40 hover:text-white/60"
                }`}
              >
                {periodLabels[p]}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
            <button
              onClick={() => setSelectedService("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedService === "all" ? "bg-[#4CAF50]/20 text-[#4CAF50]" : "text-white/40 hover:text-white/60"
              }`}
            >
              Все
            </button>
            {Object.entries(SERVICE_INFO).map(([key, info]) => (
              <button
                key={key}
                onClick={() => setSelectedService(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedService === key ? "bg-[#4CAF50]/20 text-[#4CAF50]" : "text-white/40 hover:text-white/60"
                }`}
              >
                <info.icon className="text-[10px]" style={{ color: selectedService === key ? "#4CAF50" : info.color }} />
                <span className="hidden sm:inline">{info.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatCard 
            icon={<FiZap />}
            label="Генераций"
            value={totalGenerations.toString()}
            sub={periodLabels[period]}
            color="#4CAF50"
          />
          <StatCard 
            icon={<FaCoins />}
            label="Токенов"
            value={formatTokens(totalTokens)}
            sub={`~${totalGenerations > 0 ? formatTokens(Math.round(totalTokens / totalGenerations)) : 0} ток/ген`}
            color="#FFA726"
          />
          <StatCard 
            icon={<FaRobot />}
            label="AI-постов"
            value={`${aiPostPercent}%`}
            sub={`${aiPostsCount} из ${filteredPosts.length}`}
            color="#8B5CF6"
          />
          <StatCard 
            icon={<FiTarget />}
            label="Сервисов"
            value={serviceBreakdown.length.toString()}
            sub="активных"
            color="#26A5E4"
          />
        </div>

        {serviceBreakdown.length > 0 && (
          <div className="mb-6 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#4CAF50]/10 border border-[#4CAF50]/20 flex items-center justify-center">
                <FiTrendingUp className="text-[#4CAF50] text-sm" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-white">По сервисам</h3>
                <p className="text-[11px] text-white/30">Распределение токенов</p>
              </div>
            </div>
            <div className="space-y-3">
              {serviceBreakdown.map(({ service, tokens, count }) => {
                const info = getServiceInfo(service)
                const InfoIcon = info.icon
                const maxTokens = serviceBreakdown[0]?.tokens || 1
                const barPercent = (tokens / maxTokens) * 100
                
                return (
                  <div key={service}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-lg ${info.bg} flex items-center justify-center`}>
                          <InfoIcon className="text-[10px]" style={{ color: info.color }} />
                        </div>
                        <span className="text-xs text-white/60">{info.label}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-white/20">{count} ген.</span>
                        <span className="text-xs text-white/40 font-medium">{formatTokens(tokens)} ток.</span>
                      </div>
                    </div>
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${barPercent}%`, backgroundColor: info.color }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {totalGenerations === 0 && filteredPosts.length === 0 && (
          <div className="p-12 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
              <FaChartLine className="text-3xl text-white/10" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Нет данных</h3>
            <p className="text-white/40 text-sm max-w-md">
              {period === "today" 
                ? "Сегодня ещё не было генераций. Создайте первый пост через AI."
                : `За ${periodLabels[period].toLowerCase()} не найдено активности.`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

const StatCard = ({ icon, label, value, sub, color }: { 
  icon: React.ReactNode
  label: string
  value: string
  sub: string
  color: string 
}) => (
  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm transition-colors hover:bg-white/[0.07]">
    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${color}15` }}>
      <span style={{ color }} className="text-lg">{icon}</span>
    </div>
    <div className="text-2xl font-bold text-white mb-1 tracking-[-0.02em]">{value}</div>
    <div className="text-[11px] text-white/30">{label}</div>
    <div className="text-[10px] text-white/15 mt-1 font-light">{sub}</div>
  </div>
)