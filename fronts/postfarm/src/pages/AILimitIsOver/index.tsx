import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import type { RootState } from "../../store/store"
import { 
  FaArrowLeft, FaBolt, FaCrown, FaEnvelope, FaClock,
  FaRocket, FaGem, FaUserAstronaut, FaLeaf, FaStar,
  FaCheckCircle
} from "react-icons/fa"

const RATE_CONFIG: Record<number, {
  name: string
  icon: typeof FaStar
  color: string
  bg: string
  border: string
  dailyLimit: number | string
  stars: number
  features: string[]
}> = {
  0: {
    name: "Создатель",
    icon: FaCrown,
    color: "#F59E0B",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    dailyLimit: "∞",
    stars: 5,
    features: ["Безлимитные генерации", "Все сервисы", "Приоритетная поддержка"]
  },
  1: {
    name: "Росток",
    icon: FaRocket,
    color: "#26A5E4",
    bg: "bg-sky-500/10",
    border: "border-sky-500/30",
    dailyLimit: 3,
    stars: 1,
    features: ["3 генерации в день", "Базовые сервисы", "Стандартная поддержка"]
  },
  2: {
    name: "Колос",
    icon: FaLeaf,
    color: "#34D399",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    dailyLimit: 10,
    stars: 2,
    features: ["10 генераций в день", "Все сервисы", "Стандартная поддержка"]
  },
  3: {
    name: "Урожай",
    icon: FaGem,
    color: "#4CAF50",
    bg: "bg-[#4CAF50]/10",
    border: "border-[#4CAF50]/30",
    dailyLimit: 50,
    stars: 3,
    features: ["50 генераций в день", "Все сервисы", "Приоритетная поддержка"]
  },
  4: {
    name: "Агроном",
    icon: FaUserAstronaut,
    color: "#FFA726",
    bg: "bg-[#FFA726]/10",
    border: "border-[#FFA726]/30",
    dailyLimit: 100,
    stars: 4,
    features: ["100 генераций в день", "Все сервисы", "Расширенная аналитика"]
  },
  5: {
    name: "Агроном Pro",
    icon: FaUserAstronaut,
    color: "#FFA726",
    bg: "bg-[#FFA726]/10",
    border: "border-[#FFA726]/30",
    dailyLimit: 1000,
    stars: 4,
    features: ["1000 генераций в день", "Все сервисы", "Персональный менеджер"]
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

export default function AILimitIsOverPage() {
  const navigate = useNavigate()
  const user = useSelector((s: RootState) => s.auth.user)
  const usageTokens = useSelector((s: RootState) => s.tenantStore.usageTokens)

  const userRate = typeof user?.rate === 'number' ? user.rate : 3
  const rateConfig = getRateConfig(userRate)
  const RateIcon = rateConfig.icon

  const usedToday = usageTokens?.usedToday || 0
  const dailyLimit = rateConfig.dailyLimit

  const getTimeUntilReset = () => {
    const now = new Date()
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
    const diff = tomorrow.getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours} ч ${minutes} мин`
  }

  const allRates = [0, 1, 2, 3, 4, 5].map(key => RATE_CONFIG[key])
  const currentRateIndex = allRates.findIndex(r => r.dailyLimit === dailyLimit)

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        
        <button 
          onClick={() => navigate(-1)} 
          className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-colors text-sm"
        >
          <FaArrowLeft className="text-sm" />
          <span>Назад</span>
        </button>

        <div className="text-center mb-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#E57373]/10 border border-[#E57373]/20 flex items-center justify-center mx-auto mb-5">
            <FaBolt className="text-3xl sm:text-4xl text-[#E57373]" />
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-[-0.02em]">
            Лимит исчерпан
          </h1>
          <p className="text-white/40 text-sm max-w-sm mx-auto leading-relaxed">
            Вы использовали все доступные генерации на сегодня
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#E57373]/10 flex items-center justify-center">
                <FaBolt className="text-[#E57373] text-lg" />
              </div>
              <div>
                <p className="text-sm text-white font-medium">{usedToday} / {dailyLimit}</p>
                <p className="text-xs text-white/30">использовано сегодня</p>
              </div>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-[#E57373] to-[#EF5350]" style={{ width: '100%' }} />
            </div>
            <div className="flex items-center gap-1.5 mt-4">
              <span className="text-[11px] text-white/25">Тариф:</span>
              <RateIcon className="text-xs" style={{ color: rateConfig.color }} />
              <span className="text-[11px] font-medium" style={{ color: rateConfig.color }}>{rateConfig.name}</span>
            </div>
          </div>

          <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#4CAF50]/10 flex items-center justify-center">
                <FaClock className="text-[#4CAF50] text-lg" />
              </div>
              <div>
                <p className="text-sm text-white font-medium">Лимит обновится</p>
                <p className="text-xs text-white/30">через {getTimeUntilReset()}</p>
              </div>
            </div>
            <p className="text-xs text-white/25 leading-relaxed">
              Возвращайтесь завтра. Генерации обновляются каждый день в полночь.
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6 sm:p-8 mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#FFA726]/10 border border-[#FFA726]/20 flex items-center justify-center">
              <FaEnvelope className="text-[#FFA726] text-lg" />
            </div>
            <div>
              <h3 className="text-base font-medium text-white">Доступные тарифы</h3>
              <p className="text-xs text-white/30">Ваш тариф выделен. Для повышения напишите менеджеру.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-4">
            {allRates.map((rate, index) => {
              const RateIconComponent = rate.icon
              const isCurrent = index === currentRateIndex
              const isHigher = index > currentRateIndex
              
              return (
                <div 
                  key={index}
                  className={`relative rounded-xl p-3 text-center border-2 transition-colors ${
                    isCurrent 
                      ? `${rate.bg} ${rate.border} shadow-[0_0_20px_rgba(0,0,0,0.2)]` 
                      : isHigher
                        ? 'border-white/[0.06] bg-white/[0.02]'
                        : 'border-white/[0.03] bg-white/[0.01] opacity-40'
                  }`}
                >
                  {isCurrent && (
                    <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#4CAF50] border-2 border-[#1E3A1E] flex items-center justify-center">
                      <FaCheckCircle className="text-white text-[8px]" />
                    </div>
                  )}
                  
                  <RateIconComponent className="text-lg mb-1.5 mx-auto" style={{ color: rate.color }} />
                  <p className={`text-[11px] font-medium leading-tight mb-0.5 ${isCurrent ? 'text-white' : 'text-white/70'}`}>
                    {rate.name}
                  </p>
                  <p className={`text-[10px] mb-1.5 ${isCurrent ? 'text-white/40' : 'text-white/30'}`}>
                    {rate.dailyLimit}/день
                  </p>
                  <div className="flex justify-center gap-0.5">
                    {Array.from({ length: rate.stars }, (_, i) => (
                      <FaStar key={i} className="text-[6px]" style={{ color: rate.color }} />
                    ))}
                  </div>
                  
                  {isCurrent && (
                    <div className={`mt-2 pt-2 border-t ${rate.border}`}>
                      <span className="text-[9px] font-medium" style={{ color: rate.color }}>
                        Ваш тариф
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="text-center">
            <p className="text-[11px] text-white/20 mb-3">
              Для уточнения стоимости и смены тарифа напишите менеджеру
            </p>
            <a
              href="mailto:miconext@yandex.ru?subject=Повышение тарифа ПостФерма — сейчас {rateConfig.name}"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#4CAF50] to-[#FFA726] text-white font-medium text-sm transition-colors hover:shadow-[0_0_16px_rgba(76,175,80,0.3)]"
            >
              <FaEnvelope className="text-sm" />
              miconext@yandex.ru
            </a>
          </div>
        </div>

        <p className="text-center text-[10px] text-white/10">
          ПостФерма • Выращиваем контент автоматически
        </p>
      </div>
    </div>
  )
}
