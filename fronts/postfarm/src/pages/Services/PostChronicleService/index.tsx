import { useState, type JSX } from 'react'
import { FiZap, FiCopy, FiRefreshCw, FiThumbsUp, FiInfo, FiArrowRight, FiClock, FiSend, FiPlus, FiFileText, FiPenTool } from 'react-icons/fi'
import { FaHistory } from 'react-icons/fa'
import apiAiService from '../../../pkg/api/api.ai.service'
import type { PostChronicleTypeEnum } from '../../../../../../pkg/types/ai.text.types'
import { SimpleLogoLoading } from '../../../components/Logo/LogoLoading'

type Tab = {
  id: string
  label: string
  icon: JSX.Element
  description: string
  example: string
  apiType: string
}

type Step = {
  number: number
  label: string
  icon: JSX.Element
}

const PostChronicleService = () => {
  const [historyPosts, setHistoryPosts] = useState('')
  const [generatedContent, setGeneratedContent] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState('continue')
  const [currentStep, setCurrentStep] = useState(1)
  const [error, setError] = useState<string | null>(null)

  const tabs: Tab[] = [
    { 
      id: 'continue', 
      label: 'Продолжение', 
      icon: <FiArrowRight className="text-sm" />,
      description: 'Логичное продолжение истории',
      example: 'Часть 3 → Часть 4 в том же стиле',
      apiType: 'CONTINUATION'
    },
    { 
      id: 'new-chapter', 
      label: 'Новая глава', 
      icon: <FiPlus className="text-sm" />,
      description: 'Новый поворот сюжета',
      example: 'Текущая линия → неожиданный поворот',
      apiType: 'NEW_CHAPTER'
    },
    { 
      id: 'spin-off', 
      label: 'Спин-офф', 
      icon: <FiFileText className="text-sm" />,
      description: 'Ответвление от темы',
      example: 'Основная тема → смежная история',
      apiType: 'SPINOFF'
    },
  ]

  const steps: Step[] = [
    { number: 1, label: 'История', icon: <FaHistory className="text-sm" /> },
    { number: 2, label: 'Анализ', icon: <FiZap className="text-sm" /> },
    { number: 3, label: 'Результат', icon: <FiSend className="text-sm" /> },
  ]

  const handleGenerate = async () => {
    if (!historyPosts.trim()) {
      setError('Пожалуйста, введите текст предыдущих постов')
      return
    }

    setIsGenerating(true)
    setError(null)
    setCurrentStep(2)
    setGeneratedContent(null)

    try {
      const currentTab = tabs.find(tab => tab.id === activeTab)
      const apiType = currentTab?.apiType || 'CONTINUATION'

      const response = await apiAiService.postChronicle({ 
        type: apiType as PostChronicleTypeEnum, 
        text: historyPosts.trim() 
      })

      if (response && typeof response === 'string' && response.trim()) {
        setGeneratedContent(response)
        setCurrentStep(3)
      } else {
        throw new Error('Не удалось получить ответ от сервера')
      }
    } catch (err) {
      console.error('API Error:', err)
      setError(err instanceof Error ? err.message : 'Ошибка при генерации контента. Попробуйте позже.')
      setCurrentStep(1)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = () => {
    if (!generatedContent) return
    navigator.clipboard.writeText(generatedContent)
  }

  const handleRegenerate = () => {
    handleGenerate()
  }

  return (
    <div className="min-h-screen bg-[#1E3A1E] text-white font-['Inter']">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <Header />
        <StepsIndicator steps={steps} currentStep={currentStep} />
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={(id) => {
          setActiveTab(id)
          setGeneratedContent(null)
          setCurrentStep(1)
          setError(null)
        }} />
        
        {error && <ErrorMessage error={error} />}
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-5">
            <HowItWorks activeTab={activeTab} />
            <HistoryInput 
              value={historyPosts} 
              onChange={setHistoryPosts} 
              isGenerating={isGenerating} 
            />
            <GenerateButton 
              isGenerating={isGenerating} 
              disabled={!historyPosts.trim()} 
              onClick={handleGenerate} 
            />
          </div>
          
          <div className="lg:col-span-3">
            <ResultSection 
              isGenerating={isGenerating}
              generatedContent={generatedContent}
              activeTab={activeTab}
              onCopy={handleCopy}
              onRegenerate={handleRegenerate}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

const Header = () => {
  return (
    <div className="mb-6 sm:mb-8">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-[-0.02em] mb-2">
        Хроника постов
      </h1>
    </div>
  )
}

const StepsIndicator = ({ steps, currentStep }: { steps: Step[], currentStep: number }) => {
  return (
    <div className="flex items-center gap-2 sm:gap-4 mb-6 sm:mb-8">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center gap-2 sm:gap-4">
          <div className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl transition-all duration-300 ${
            currentStep >= step.number 
              ? 'bg-[#FFA726]/20 border border-[#FFA726]/30' 
              : 'bg-white/5 border border-white/10'
          }`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              currentStep >= step.number 
                ? 'bg-[#FFA726] text-[#1E3A1E]' 
                : 'bg-white/10 text-white/40'
            }`}>
              {step.number}
            </span>
            <span className={`text-sm font-medium hidden sm:block ${
              currentStep >= step.number ? 'text-white' : 'text-white/40'
            }`}>
              {step.label}
            </span>
            <span className={`sm:hidden ${
              currentStep >= step.number ? 'text-[#FFA726]' : 'text-white/40'
            }`}>
              {step.icon}
            </span>
          </div>
          {index < steps.length - 1 && (
            <FiArrowRight className={`text-sm flex-shrink-0 ${
              currentStep > step.number ? 'text-[#FFA726]' : 'text-white/20'
            }`} />
          )}
        </div>
      ))}
    </div>
  )
}

const Tabs = ({ tabs, activeTab, onTabChange }: { 
  tabs: Tab[], 
  activeTab: string, 
  onTabChange: (id: string) => void 
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 sm:mb-8">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`text-left p-4 rounded-xl transition-all duration-150 group ${
            activeTab === tab.id
              ? 'bg-[#FFA726]/20 border border-[#FFA726]/30 shadow-[0_0_12px_rgba(255,167,38,0.15)]'
              : 'bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/8'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className={activeTab === tab.id ? 'text-[#FFA726]' : 'text-white/60'}>
              {tab.icon}
            </span>
            <span className={`text-sm font-semibold ${
              activeTab === tab.id ? 'text-white' : 'text-white/80'
            }`}>
              {tab.label}
            </span>
          </div>
          <p className="text-xs text-white/40 leading-relaxed mb-1">
            {tab.description}
          </p>
          <p className="text-xs text-white/20 italic">
            {tab.example}
          </p>
        </button>
      ))}
    </div>
  )
}

const ErrorMessage = ({ error }: { error: string }) => {
  return (
    <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 text-sm">
      <div className="flex items-center gap-2">
        <FiInfo className="text-red-400" />
        <span>{error}</span>
      </div>
    </div>
  )
}

const HowItWorks = ({ activeTab }: { activeTab: string }) => {
  const getDescription = () => {
    switch(activeTab) {
      case 'continue':
        return 'Скопируйте 2-5 своих предыдущих постов. AI проанализирует стиль, тон и логику повествования, затем создаст естественное продолжение.'
      case 'new-chapter':
        return 'Загрузите историю постов, и AI придумает неожиданный поворот. Сохранит ваш стиль, но добавит новый конфликт или развитие темы.'
      case 'spin-off':
        return 'AI возьмёт тему из ваших постов и создаст ответвление — смежную историю, которая расширит контент и привлечёт новую аудиторию.'
      default:
        return 'Скопируйте 2-5 своих предыдущих постов для анализа стиля и генерации продолжения.'
    }
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-5 backdrop-blur-sm">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#FFA726]/20 flex items-center justify-center flex-shrink-0">
          <FiInfo className="text-[#FFA726] text-sm" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[#FFA726] mb-1">
            Как это работает
          </h3>
          <p className="text-white/50 text-xs leading-relaxed">
            {getDescription()}
          </p>
        </div>
      </div>
    </div>
  )
}

const HistoryInput = ({ 
  value, 
  onChange, 
  isGenerating 
}: { 
  value: string, 
  onChange: (value: string) => void, 
  isGenerating: boolean 
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-white/60 mb-2 tracking-[0.05em] uppercase">
        Ваши предыдущие посты
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Скопируйте сюда 2-5 ваших последних постов...&#10;&#10;Пост 1:&#10;Привет, друзья! Сегодня расскажу о...&#10;&#10;Пост 2:&#10;Продолжаю тему. В прошлый раз мы...&#10;&#10;Пост 3:&#10;Получил много вопросов после..."
        className="w-full h-64 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 resize-none focus:outline-none focus:border-[#FFA726] focus:shadow-[0_0_12px_rgba(255,167,38,0.15)] transition-all duration-150"
        disabled={isGenerating}
      />
      <div className="flex items-center gap-2 mt-2 text-white/20 text-xs">
        <FiInfo className="text-sm" />
        <span>Минимум 2 поста для анализа. Чем больше примеров — тем точнее стиль.</span>
      </div>
    </div>
  )
}

const GenerateButton = ({ 
  isGenerating, 
  disabled, 
  onClick 
}: { 
  isGenerating: boolean, 
  disabled: boolean, 
  onClick: () => void 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isGenerating}
      className="w-full bg-gradient-to-r from-[#FFA726] to-[#4CAF50] text-[#1E3A1E] rounded-xl px-6 py-4 font-bold hover:translate-y-[-2px] hover:shadow-[0_0_20px_rgba(255,167,38,0.4)] transition-all duration-150 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2 group"
    >
      {isGenerating ? (
        <>
          <span className="flex gap-1.5">
            <span className="w-2 h-2 bg-[#1E3A1E] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-[#1E3A1E] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-[#1E3A1E] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </span>
          <span className="text-sm">Анализирую стиль и создаю продолжение...</span>
        </>
      ) : (
        <>
          <FaHistory className="text-lg group-hover:scale-110 transition-transform" />
          <span>Создать продолжение</span>
          <FiArrowRight className="text-sm opacity-60" />
        </>
      )}
    </button>
  )
}

const ResultSection = ({ 
  isGenerating, 
  generatedContent, 
  activeTab, 
  onCopy, 
  onRegenerate 
}: { 
  isGenerating: boolean, 
  generatedContent: string | null, 
  activeTab: string, 
  onCopy: () => void, 
  onRegenerate: () => void 
}) => {
  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-medium text-white/60 tracking-[0.05em] uppercase flex items-center gap-2">
          <FiSend className="text-sm" />
          Результат генерации
        </label>
        {generatedContent && (
          <div className="flex gap-2">
            <button
              onClick={onCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 border border-white/10 transition-all duration-150"
            >
              <FiCopy className="text-sm" />
              <span className="hidden sm:inline">Копировать</span>
            </button>
            <button
              onClick={onRegenerate}
              disabled={isGenerating}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 border border-white/10 transition-all duration-150"
            >
              <FiRefreshCw className={`text-sm ${isGenerating ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Перегенерировать</span>
            </button>
          </div>
        )}
      </div>

      {isGenerating ? (
        <LoadingState />
      ) : generatedContent ? (
        <GeneratedResult content={generatedContent} activeTab={activeTab} />
      ) : (
        <EmptyState activeTab={activeTab} />
      )}
    </>
  )
}



const LoadingState = () => {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-8 sm:p-12 backdrop-blur-sm flex flex-col items-center justify-center text-center min-h-[500px]">
      <SimpleLogoLoading />
      <div className="mt-8 flex items-center gap-4 text-white/15 text-xs">
        <div className="flex items-center gap-1.5">
          <FiPenTool className="text-sm" />
          <span>Анализ стиля</span>
        </div>
        <div className="w-1 h-1 bg-white/20 rounded-full" />
        <div className="flex items-center gap-1.5">
          <FaHistory className="text-sm" />
          <span>Понимание контекста</span>
        </div>
        <div className="w-1 h-1 bg-white/20 rounded-full" />
        <div className="flex items-center gap-1.5">
          <FiSend className="text-sm" />
          <span>Генерация текста</span>
        </div>
      </div>
    </div>
  )
}

const GeneratedResult = ({ content, activeTab }: { content: string, activeTab: string }) => {
  const getAdvice = () => {
    switch(activeTab) {
      case 'continue':
        return 'Не публикуйте AI-продолжение как есть. Добавьте актуальные детали из вашей ниши и личный комментарий. AI сохраняет стиль, но только вы знаете, что происходит прямо сейчас.'
      case 'new-chapter':
        return 'Новый поворот должен удивлять, но не отрываться от реальности. Используйте этот пост как основу и добавьте конкретные примеры из своего опыта.'
      case 'spin-off':
        return 'Спин-офф — отличный способ протестировать новую тему. Если аудитория отреагирует хорошо — развивайте направление дальше.'
      default:
        return 'Добавьте личный комментарий и актуальные детали перед публикацией.'
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-white/5 border border-white/10 rounded-xl p-5 sm:p-6 backdrop-blur-sm">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#FFA726]/20 flex items-center justify-center flex-shrink-0">
            <FiSend className="text-[#FFA726] text-lg" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
              {content}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#FFA726]/10 to-[#4CAF50]/10 border border-[#FFA726]/20 rounded-xl p-4 sm:p-5 backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FFA726] to-[#4CAF50] flex items-center justify-center flex-shrink-0">
            <FiZap className="text-white text-sm" />
          </div>
          <div>
            <h3 className="text-[#FFA726] font-semibold mb-2 text-sm">
              Совет по использованию
            </h3>
            <p className="text-white/70 text-xs leading-relaxed">
              {getAdvice()}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/40">Оценить:</span>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/60 hover:text-[#FFA726] hover:bg-[#FFA726]/10 transition-all duration-150">
            <FiThumbsUp className="text-sm" />
            Полезно
          </button>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-white/20">
          <FiClock className="text-sm" />
          <span>Сгенерировано только что</span>
        </div>
      </div>
    </div>
  )
}

const EmptyState = ({ activeTab }: { activeTab: string }) => {
  const getMessage = () => {
    switch(activeTab) {
      case 'continue':
        return 'Вставьте 2-5 своих прошлых постов, и AI напишет логичное продолжение. Сохранит ваш стиль и тон.'
      case 'new-chapter':
        return 'Загрузите историю постов, и AI придумает неожиданный поворот. Новый конфликт или развитие темы.'
      case 'spin-off':
        return 'Дайте AI вашу серию постов, и он создаст ответвление — смежную историю для расширения контента.'
      default:
        return 'Вставьте предыдущие посты для генерации продолжения.'
    }
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-8 sm:p-12 backdrop-blur-sm flex flex-col items-center justify-center text-center min-h-[500px]">
      <div className="w-16 h-16 rounded-2xl bg-[#FFA726]/10 flex items-center justify-center mb-5">
        <FaHistory className="text-[#FFA726] text-2xl" />
      </div>
      <h3 className="text-white/80 font-semibold mb-2">
        Готово к созданию
      </h3>
      <p className="text-white/30 text-sm max-w-sm mb-6">
        {getMessage()}
      </p>
      <div className="flex items-center gap-4 text-white/15 text-xs">
        <div className="flex items-center gap-1.5">
          <FiClock className="text-sm" />
          <span>~15-30 секунд</span>
        </div>
        <div className="flex items-center gap-1.5">
          <FiPenTool className="text-sm" />
          <span>Анализ стиля</span>
        </div>
        <div className="flex items-center gap-1.5">
          <FiSend className="text-sm" />
          <span>Готово к посту</span>
        </div>
      </div>
    </div>
  )
}

export default PostChronicleService