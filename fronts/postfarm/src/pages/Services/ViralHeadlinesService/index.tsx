import { useState, type JSX } from 'react'
import { FiZap, FiCopy, FiRefreshCw, FiThumbsUp, FiTarget, FiTrendingUp, FiVolume2, FiInfo, FiStar, FiArrowRight, FiClock, FiSend, FiPenTool } from 'react-icons/fi'
import type { HeadlineStyleEnum, HeadlineContentEnum } from '../../../../../../pkg/types/ai.text.types'
import apiAiService from '../../../pkg/api/api.ai.service'
import { SimpleLogoLoading } from '../../../components/Logo/LogoLoading'
import { useSelector } from 'react-redux'
import type { RootState } from '../../../store/store'
import { useGetData } from '../../../hooks/useGetData'

type Tab = {
  id: string
  label: string
  icon: JSX.Element
  description: string
  example: string
  apiType: HeadlineContentEnum
}

type Step = {
  number: number
  label: string
  icon: JSX.Element
}

const ViralHeadlinesService = () => {
  const [topic, setTopic] = useState('')
  const [generatedContent, setGeneratedContent] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState('headlines')
  const [style, setStyle] = useState<HeadlineStyleEnum>('VIRAL')
  const [currentStep, setCurrentStep] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const userId = useSelector((s: RootState) => s.auth.user!._id!)
  const { refreshAll } = useGetData()
  
  const tabs: Tab[] = [
    { 
      id: 'headlines', 
      label: 'Заголовки', 
      icon: <FiTrendingUp className="text-sm" />,
      description: 'Названия, которые заставляют нажать',
      example: 'Тема → 3 варианта с разной механикой',
      apiType: 'HEADLINES'
    },
    { 
      id: 'hooks', 
      label: 'Hooks', 
      icon: <FiZap className="text-sm" />,
      description: 'Первые цепляющие строки поста',
      example: 'Ниша → 3 хука с разными эмоциями',
      apiType: 'HOOKS'
    },
    { 
      id: 'cta', 
      label: 'CTA', 
      icon: <FiTarget className="text-sm" />,
      description: 'Призывы к действию с конверсией',
      example: 'Тип поста → 3 CTA с разной целью',
      apiType: 'CTA'
    },
    { 
      id: 'viral', 
      label: 'Вирусные', 
      icon: <FiVolume2 className="text-sm" />,
      description: 'Идеи под максимальные охваты',
      example: 'Тема → 3 вирусные механики',
      apiType: 'VIRAL'
    },
  ]

  const styles = [
    { id: 'VIRAL' as HeadlineStyleEnum, label: 'Вирусный', icon: <FiVolume2 className="text-sm" />, desc: 'Шок, интрига, срочность' },
    { id: 'EMOTIONAL' as HeadlineStyleEnum, label: 'Эмоциональный', icon: <FiZap className="text-sm" />, desc: 'Эмпатия, история, чувства' },
    { id: 'PROVOCATIVE' as HeadlineStyleEnum, label: 'Провокационный', icon: <FiTarget className="text-sm" />, desc: 'Спор, вызов, дискуссия' },
    { id: 'EDUCATIONAL' as HeadlineStyleEnum, label: 'Обучающий', icon: <FiPenTool className="text-sm" />, desc: 'Польза, цифры, факты' },
  ]

  const steps: Step[] = [
    { number: 1, label: 'Тема', icon: <FiPenTool className="text-sm" /> },
    { number: 2, label: 'Стиль', icon: <FiZap className="text-sm" /> },
    { number: 3, label: 'Результат', icon: <FiTrendingUp className="text-sm" /> },
  ]

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Пожалуйста, введите тему')
      return
    }

    setIsGenerating(true)
    setError(null)
    setCurrentStep(2)
    setGeneratedContent(null)

    try {
      const response = await apiAiService.viralHeadlines({ 
        topic: topic.trim(), 
        type: activeTab as HeadlineContentEnum, 
        style: style,
        userId,
      })

      if (response && response && response.trim()) {
        setGeneratedContent(response)
        setCurrentStep(3)
        refreshAll()
      } else {
        throw new Error('Не удалось получить результат')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при генерации. Попробуйте позже.')
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

  const getStyleColor = (styleId: HeadlineStyleEnum) => {
    const colors: Record<HeadlineStyleEnum, string> = {
      VIRAL: '#FFA726',
      EMOTIONAL: '#E57373',
      PROVOCATIVE: '#FF7043',
      EDUCATIONAL: '#4CAF50'
    }
    return colors[styleId] || '#FFA726'
  }

  const currentStyleColor = getStyleColor(style)

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
            <StyleSelector 
              styles={styles} 
              activeStyle={style} 
              onStyleChange={(s) => setStyle(s as HeadlineStyleEnum)} 
            />
            <TopicInput 
              value={topic} 
              onChange={setTopic} 
              activeTab={activeTab}
              isGenerating={isGenerating} 
            />
            <GenerateButton 
              isGenerating={isGenerating} 
              disabled={!topic.trim()} 
              onClick={handleGenerate} 
            />
          </div>
          
          <div className="lg:col-span-3">
            <ResultSection 
              isGenerating={isGenerating}
              generatedContent={generatedContent}
              activeTab={activeTab}
              style={style}
              currentStyleColor={currentStyleColor}
              onCopy={handleCopy}
              onRegenerate={handleRegenerate}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// КОМПОНЕНТЫ
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const Header = () => {
  return (
    <div className="mb-6 sm:mb-8">
      <span className="inline-block px-3 py-1 bg-[#FFA726]/20 text-[#FFA726] text-xs font-medium rounded-full uppercase tracking-[0.05em] mb-3">
        Вовлечение
      </span>
      <h1 className="text-3xl sm:text-4xl font-bold tracking-[-0.02em] mb-2">
        Цепляющие заголовки
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6 sm:mb-8">
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
      case 'headlines':
        return 'Введите тему, и AI создаст мощный заголовок. Он проанализирует лучшие примеры, оценит свои варианты по 3 критериям и выдаст только победителя.'
      case 'hooks':
        return 'Укажите тему поста, и AI напишет цепляющий хук. Короткий, резкий, с эмоциональным триггером — такой, который остановит скролл за 0.5 секунды.'
      case 'cta':
        return 'Опишите контекст, и AI предложит призыв к действию. С конкретной выгодой для читателя и лёгким FOMO.'
      case 'viral':
        return 'Назовите нишу, и AI придумает вирусную механику. С описанием, почему это сработает и на какую эмоцию давит.'
      default:
        return 'Введите тему, и AI создаст цепляющий заголовок с максимальным CTR.'
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

const StyleSelector = ({ 
  styles, 
  activeStyle, 
  onStyleChange 
}: { 
  styles: Array<{ id: HeadlineStyleEnum, label: string, icon: JSX.Element, desc: string }>, 
  activeStyle: HeadlineStyleEnum, 
  onStyleChange: (style: string) => void 
}) => {
  const getStyleColor = (styleId: HeadlineStyleEnum) => {
    const colors: Record<HeadlineStyleEnum, string> = {
      VIRAL: '#FFA726',
      EMOTIONAL: '#E57373',
      PROVOCATIVE: '#FF7043',
      EDUCATIONAL: '#4CAF50'
    }
    return colors[styleId] || '#FFA726'
  }

  return (
    <div>
      <label className="block text-sm font-medium text-white/60 mb-3 tracking-[0.05em] uppercase">
        Стиль
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {styles.map((s) => {
          const color = getStyleColor(s.id)
          const isActive = activeStyle === s.id
          
          return (
            <button
              key={s.id}
              onClick={() => onStyleChange(s.id)}
              className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-150 ${
                isActive
                  ? 'bg-white/5 border shadow-lg'
                  : 'bg-white/5 border border-white/10 hover:border-white/20'
              }`}
              style={isActive ? { borderColor: `${color}40`, boxShadow: `0 0 12px ${color}20` } : {}}
            >
              <div 
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-150"
                style={{ backgroundColor: isActive ? `${color}30` : 'rgba(255,255,255,0.05)' }}
              >
                <span style={{ color: isActive ? color : 'rgba(255,255,255,0.4)' }}>
                  {s.icon}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p 
                  className="text-sm font-medium transition-colors duration-150"
                  style={{ color: isActive ? 'white' : 'rgba(255,255,255,0.6)' }}
                >
                  {s.label}
                </p>
                <p className="text-xs text-white/30 truncate">{s.desc}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

const TopicInput = ({ 
  value, 
  onChange, 
  activeTab,
  isGenerating 
}: { 
  value: string, 
  onChange: (value: string) => void,
  activeTab: string,
  isGenerating: boolean 
}) => {
  const getPlaceholder = () => {
    switch(activeTab) {
      case 'headlines': return 'Например: как продвигать Telegram-канал бесплатно'
      case 'hooks': return 'Например: пост про ошибки новичков в маркетинге'
      case 'cta': return 'Например: обучающий пост про AI-инструменты'
      case 'viral': return 'Например: сравнение Telegram и WhatsApp для бизнеса'
      default: return 'Введите тему для генерации...'
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-white/60 mb-2 tracking-[0.05em] uppercase">
        Тема или ниша
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={getPlaceholder()}
        className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 resize-none focus:outline-none focus:border-[#FFA726] focus:shadow-[0_0_12px_rgba(255,167,38,0.15)] transition-all duration-150 text-sm"
        disabled={isGenerating}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey && value.trim() && !isGenerating) {
            e.preventDefault()
            const btn = document.getElementById('generate-btn')
            btn?.click()
          }
        }}
      />
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
      id="generate-btn"
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
          <span className="text-sm">Генерируем заголовок...</span>
        </>
      ) : (
        <>
          <FiZap className="text-lg group-hover:scale-110 transition-transform" />
          <span>Сгенерировать</span>
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
  style,
  currentStyleColor,
  onCopy, 
  onRegenerate 
}: { 
  isGenerating: boolean, 
  generatedContent: string | null, 
  activeTab: string,
  style: HeadlineStyleEnum,
  currentStyleColor: string,
  onCopy: () => void, 
  onRegenerate: () => void 
}) => {
  const getLabel = () => {
    switch(activeTab) {
      case 'headlines': return 'Заголовок'
      case 'hooks': return 'Хук'
      case 'cta': return 'CTA'
      case 'viral': return 'Вирусная идея'
      default: return 'Результат'
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-medium text-white/60 tracking-[0.05em] uppercase flex items-center gap-2">
          <FiTrendingUp className="text-sm" />
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
              <span className="hidden sm:inline">Обновить</span>
            </button>
          </div>
        )}
      </div>

      {isGenerating ? (
        <LoadingState />
      ) : generatedContent ? (
        <GeneratedResult 
          content={generatedContent} 
          label={getLabel()}
          activeTab={activeTab}
          currentStyleColor={currentStyleColor}
          style={style}
        />
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
          <span>Анализ темы</span>
        </div>
        <div className="w-1 h-1 bg-white/20 rounded-full" />
        <div className="flex items-center gap-1.5">
          <FiStar className="text-sm" />
          <span>Оценка вариантов</span>
        </div>
        <div className="w-1 h-1 bg-white/20 rounded-full" />
        <div className="flex items-center gap-1.5">
          <FiSend className="text-sm" />
          <span>Выбор лучшего</span>
        </div>
      </div>
    </div>
  )
}

const GeneratedResult = ({ 
  content, 
  label,
  activeTab,
  currentStyleColor,
  style
}: { 
  content: string
  label: string
  activeTab: string
  currentStyleColor: string
  style: HeadlineStyleEnum
}) => {
  const getStyleLabel = () => {
    const labels: Record<HeadlineStyleEnum, string> = {
      VIRAL: 'Вирусный стиль',
      EMOTIONAL: 'Эмоциональный стиль',
      PROVOCATIVE: 'Провокационный стиль',
      EDUCATIONAL: 'Обучающий стиль'
    }
    return labels[style] || ''
  }

  const getAdvice = () => {
    switch(activeTab) {
      case 'headlines':
        return 'Сильные заголовки строятся на трёх китах: конкретика, интрига, обещание. Чем точнее вы попадаете в боль аудитории — тем выше отклик. Тестируйте 2-3 варианта на один пост и анализируйте статистику.'
      case 'hooks':
        return 'Хороший хук удерживает внимание в первые 3 секунды. Используйте личные истории, неожиданные факты или вопросы. Главное правило: пообещали интригу — раскройте её в тексте.'
      case 'cta':
        return 'Без CTA даже вирусный пост не приносит подписчиков. Одно конкретное действие работает лучше, чем три. Чем проще действие — тем выше конверсия в отклик.'
      case 'viral':
        return 'Вирусность — это формула: сильная эмоция + простота репоста + актуальность. Спорные темы работают лучше всего, но сохраняйте уважение к аудитории.'
      default:
        return 'Используйте этот результат как основу и добавляйте свои детали.'
    }
  }

  return (
    <div className="space-y-4">
      {/* Главный результат */}
      <div 
        className="relative rounded-xl p-6 sm:p-8 backdrop-blur-sm overflow-hidden"
        style={{ 
          background: `linear-gradient(135deg, ${currentStyleColor}10 0%, ${currentStyleColor}05 100%)`,
          border: `1px solid ${currentStyleColor}30`
        }}
      >
        {/* Glow effect */}
        <div 
          className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-20"
          style={{ background: currentStyleColor }}
        />
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${currentStyleColor}20` }}
            >
              <FiStar style={{ color: currentStyleColor }} className="text-lg" />
            </div>
            <div>
              <span 
                className="text-xs font-medium uppercase tracking-wider"
                style={{ color: currentStyleColor }}
              >
                {label}
              </span>
              <p className="text-white/30 text-xs">{getStyleLabel()}</p>
            </div>
          </div>
          
          <p className="text-white/90 text-lg sm:text-xl font-medium leading-relaxed whitespace-pre-wrap pl-13">
            {content}
          </p>
        </div>
      </div>

      {/* Совет */}
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

      {/* Оценка */}
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
      case 'headlines':
        return 'Введите тему, и AI создаст мощный заголовок. Сам оценит варианты и выдаст только лучший.'
      case 'hooks':
        return 'Укажите тему, и AI напишет цепляющий хук. Который остановит скролл за 0.5 секунды.'
      case 'cta':
        return 'Опишите контекст, и AI предложит призыв к действию. С конкретной выгодой для читателя.'
      case 'viral':
        return 'Назовите нишу, и AI придумает вирусную механику. С описанием, почему это сработает.'
      default:
        return 'Введите тему для генерации заголовка.'
    }
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-8 sm:p-12 backdrop-blur-sm flex flex-col items-center justify-center text-center min-h-[500px]">
      <div className="w-16 h-16 rounded-2xl bg-[#FFA726]/10 flex items-center justify-center mb-5">
        {activeTab === 'headlines' && <FiTrendingUp className="text-[#FFA726] text-2xl" />}
        {activeTab === 'hooks' && <FiZap className="text-[#FFA726] text-2xl" />}
        {activeTab === 'cta' && <FiTarget className="text-[#FFA726] text-2xl" />}
        {activeTab === 'viral' && <FiVolume2 className="text-[#FFA726] text-2xl" />}
      </div>
      <h3 className="text-white/80 font-semibold mb-2">
        Готово к генерации
      </h3>
      <p className="text-white/30 text-sm max-w-sm mb-6">
        {getMessage()}
      </p>
      <div className="flex items-center gap-4 text-white/15 text-xs">
        <div className="flex items-center gap-1.5">
          <FiClock className="text-sm" />
          <span>~8 секунд</span>
        </div>
        <div className="flex items-center gap-1.5">
          <FiTarget className="text-sm" />
          <span>4 стиля</span>
        </div>
        <div className="flex items-center gap-1.5">
          <FiSend className="text-sm" />
          <span>Готово к посту</span>
        </div>
      </div>
    </div>
  )
}

export default ViralHeadlinesService