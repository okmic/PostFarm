import { useState, type JSX } from 'react'
import { FiSend, FiZap, FiCopy, FiRefreshCw, FiThumbsUp, FiMessageSquare, FiLayers, FiInfo, FiArrowRight, FiClock, FiTarget, FiSmile, FiPenTool } from 'react-icons/fi'
import apiAiService from '../../../pkg/api/api.ai.service'
import type { PostChannelContentTypeEnum, PostChannelContentToneEnum } from '../../../../../../pkg/types/ai.text.types'
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
  apiType: PostChannelContentTypeEnum
}

type Tone = {
  id: string
  label: string
  icon: JSX.Element
  desc: string
  apiType: PostChannelContentToneEnum
}

type Step = {
  number: number
  label: string
  icon: JSX.Element
}

type GeneratedContent = {
  title: string
  content: string
  toneNote: string
  structureNote: string
}

const ChannelContentService = () => {
  const [prompt, setPrompt] = useState('')
  const userId = useSelector((s: RootState) => s.auth.user!._id!)
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState('post')
  const [tone, setTone] = useState('friendly')
  const [currentStep, setCurrentStep] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const { refreshAll } = useGetData()

  const tabs: Tab[] = [
    { 
      id: 'post', 
      label: 'Пост', 
      icon: <FiSend className="text-sm" />,
      description: 'Готовый текст для публикации',
      example: 'Тема → структурированный пост с эмодзи и CTA',
      apiType: 'POST'
    },
    { 
      id: 'ideas', 
      label: 'Идеи', 
      icon: <FiZap className="text-sm" />,
      description: 'Темы для новых публикаций',
      example: 'Ниша → 5 тем на неделю с рубриками',
      apiType: 'IDEA'
    },
    { 
      id: 'poll', 
      label: 'Опрос', 
      icon: <FiMessageSquare className="text-sm" />,
      description: 'Вовлекающий интерактив',
      example: 'Тема → вопросы с вариантами ответов',
      apiType: 'POLL'
    },
    { 
      id: 'series', 
      label: 'Серия', 
      icon: <FiLayers className="text-sm" />,
      description: 'Связанные публикации',
      example: 'Идея → 5 постов от простого к сложному',
      apiType: 'SERIES'
    },
  ]

  const tones: Tone[] = [
    { id: 'friendly', label: 'Дружелюбный', icon: <FiSmile className="text-sm" />, desc: 'Привет! Смотри, что я нашёл 🤩', apiType: 'FRIENDLY' },
    { id: 'expert', label: 'Экспертный', icon: <FiTarget className="text-sm" />, desc: 'Согласно исследованию, 73%...', apiType: 'EXPERT' },
    { id: 'casual', label: 'Повседневный', icon: <FiPenTool className="text-sm" />, desc: 'Короче, ребята, делюсь находкой', apiType: 'СASUAL' },
    { id: 'humor', label: 'С юмором', icon: <FiSmile className="text-sm" />, desc: 'Угадайте, что я натворил сегодня 😅', apiType: 'HUMOROUS' },
  ]

  const steps: Step[] = [
    { number: 1, label: 'Тема', icon: <FiPenTool className="text-sm" /> },
    { number: 2, label: 'Генерация', icon: <FiZap className="text-sm" /> },
    { number: 3, label: 'Результат', icon: <FiSend className="text-sm" /> },
  ]

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Пожалуйста, введите тему для генерации')
      return
    }

    setIsGenerating(true)
    setError(null)
    setCurrentStep(2)
    setGeneratedContent(null)

    try {
      const currentTab = tabs.find(tab => tab.id === activeTab)
      const currentTone = tones.find(t => t.id === tone)
      
      const apiType = currentTab?.apiType || 'POST'
      const apiTone = currentTone?.apiType || 'FRIENDLY'

      const response = await apiAiService.chanelContent({ 
        text: prompt.trim(),
        type: apiType,
        tone: apiTone,
        userId,
      })

      if (response && typeof response === 'string' && response.trim()) {
        setGeneratedContent({
          title: getTitleByTab(activeTab),
          content: response,
          toneNote: `Тон: ${currentTone?.label || 'Дружелюбный'}. Сохранён выбранный стиль общения.`,
          structureNote: getStructureNoteByTab(activeTab)
        })
        setCurrentStep(3)
        refreshAll()
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

  const getTitleByTab = (tabId: string): string => {
    switch(tabId) {
      case 'post': return '📝 Готовый пост'
      case 'ideas': return '💡 Идеи для публикаций'
      case 'poll': return '📊 Вовлекающий опрос'
      case 'series': return '📖 Серия постов'
      default: return '✨ Сгенерированный контент'
    }
  }

  const getStructureNoteByTab = (tabId: string): string => {
    switch(tabId) {
      case 'post': return 'Структура: заголовок → вступление → основные тезисы → примеры → вопрос аудитории → призыв к действию.'
      case 'ideas': return 'Структура: список идей → обоснование каждой → рекомендации по реализации.'
      case 'poll': return 'Структура: вопрос → варианты ответов → призыв к участию → обещание подвести итоги.'
      case 'series': return 'Структура: тема серии → разбивка на части → анонс продолжения → призыв подписаться.'
      default: return 'Структура адаптирована под выбранный тип контента.'
    }
  }

  const handleCopy = () => {
    if (!generatedContent) return
    navigator.clipboard.writeText(`${generatedContent.title}\n\n${generatedContent.content}`)
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
            <ToneSelector tones={tones} selectedTone={tone} onToneChange={setTone} />
            <TopicInput 
              value={prompt} 
              onChange={setPrompt} 
              activeTab={activeTab}
              isGenerating={isGenerating}
            />
            <GenerateButton 
              isGenerating={isGenerating} 
              disabled={!prompt.trim()} 
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
        Контент для блога
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
              ? 'bg-[#4CAF50]/20 border border-[#4CAF50]/30' 
              : 'bg-white/5 border border-white/10'
          }`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              currentStep >= step.number 
                ? 'bg-[#4CAF50] text-white' 
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
              currentStep >= step.number ? 'text-[#4CAF50]' : 'text-white/40'
            }`}>
              {step.icon}
            </span>
          </div>
          {index < steps.length - 1 && (
            <FiArrowRight className={`text-sm flex-shrink-0 ${
              currentStep > step.number ? 'text-[#4CAF50]' : 'text-white/20'
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
          className={`text-left p-4 rounded-xl transition-all duration-150 cursor-pointer ${
            activeTab === tab.id
              ? 'bg-[#4CAF50]/20 border border-[#4CAF50]/30 shadow-[0_0_12px_rgba(76,175,80,0.15)]'
              : 'bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/8'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className={activeTab === tab.id ? 'text-[#4CAF50]' : 'text-white/60'}>
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
      case 'post':
        return 'Введите тему, и AI создаст готовый пост. С правильной структурой, эмодзи, призывом к действию и вовлекающими элементами. Просто скопируйте и опубликуйте.'
      case 'ideas':
        return 'Укажите тему или направление, и AI предложит идеи для публикаций. Каждая идея с обоснованием — почему это сработает. Экономит часы мозгового штурма.'
      case 'poll':
        return 'Назовите тему, и AI создаст опрос с продуманными вариантами ответов. Вовлекающий контент, который повышает активность и даёт обратную связь.'
      case 'series':
        return 'Задайте тему серии, и AI разработает структуру из связанных постов. С прогрессией, заданиями и удержанием внимания.'
      default:
        return 'Введите тему, и AI создаст контент для вашего проекта.'
    }
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-5 backdrop-blur-sm">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#4CAF50]/20 flex items-center justify-center flex-shrink-0">
          <FiInfo className="text-[#4CAF50] text-sm" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[#4CAF50] mb-1">
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

const ToneSelector = ({ tones, selectedTone, onToneChange }: { 
  tones: Tone[], 
  selectedTone: string, 
  onToneChange: (id: string) => void 
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-white/60 mb-3 tracking-[0.05em] uppercase">
        Тон общения
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {tones.map((t) => (
          <button
            key={t.id}
            onClick={() => onToneChange(t.id)}
            className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-150 cursor-pointer ${
              selectedTone === t.id
                ? 'bg-[#4CAF50]/20 border border-[#4CAF50]/30'
                : 'bg-white/5 border border-white/10 hover:border-white/20'
            }`}
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
              selectedTone === t.id ? 'bg-[#4CAF50]/30' : 'bg-white/5'
            }`}>
              <span className={selectedTone === t.id ? 'text-[#4CAF50]' : 'text-white/40'}>
                {t.icon}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${
                selectedTone === t.id ? 'text-white' : 'text-white/60'
              }`}>
                {t.label}
              </p>
              <p className="text-xs text-white/30 truncate">{t.desc}</p>
            </div>
          </button>
        ))}
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
      case 'post':
        return 'Например: как продвигать контент бесплатно'
      case 'ideas':
        return 'Например: блог про маркетинг и AI'
      case 'poll':
        return 'Например: отношение аудитории к рекламе'
      case 'series':
        return 'Например: серия про запуск блога с нуля'
      default:
        return 'Введите тему для генерации...'
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-white/60 mb-2 tracking-[0.05em] uppercase">
        О чём писать
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={getPlaceholder()}
        className="w-full h-36 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 resize-none focus:outline-none focus:border-[#4CAF50] focus:shadow-[0_0_12px_rgba(76,175,80,0.15)] transition-all duration-150"
        disabled={isGenerating}
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
      onClick={onClick}
      disabled={disabled || isGenerating}
      className="w-full bg-gradient-to-r from-[#1E3A1E] to-[#4CAF50] text-white rounded-xl px-6 py-4 font-medium hover:translate-y-[-2px] hover:shadow-[0_0_16px_rgba(76,175,80,0.4)] transition-all duration-150 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2 cursor-pointer"
    >
      {isGenerating ? (
        <>
          <span className="flex gap-1.5">
            <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </span>
          <span className="text-sm">Генерируем контент...</span>
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
  onCopy, 
  onRegenerate 
}: { 
  isGenerating: boolean, 
  generatedContent: GeneratedContent | null, 
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 border border-white/10 transition-all duration-150 cursor-pointer"
            >
              <FiCopy className="text-sm" />
              <span className="hidden sm:inline">Копировать</span>
            </button>
            <button
              onClick={onRegenerate}
              disabled={isGenerating}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 border border-white/10 transition-all duration-150 cursor-pointer"
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
      
      <h3 className="text-white/80 font-semibold mb-2 mt-6">
        Генерируем контент...
      </h3>
      
      <p className="text-white/30 text-sm max-w-sm mt-2">
        Это займёт около 10-15 секунд. AI анализирует тему и создаёт уникальный контент в выбранном тоне.
      </p>
      
      <div className="mt-6 flex items-center gap-4 text-white/15 text-xs">
        <div className="flex items-center gap-1.5">
          <FiPenTool className="text-sm" />
          <span>Анализ темы</span>
        </div>
        <div className="w-1 h-1 bg-white/20 rounded-full" />
        <div className="flex items-center gap-1.5">
          <FiTarget className="text-sm" />
          <span>Выбор тона</span>
        </div>
        <div className="w-1 h-1 bg-white/20 rounded-full" />
        <div className="flex items-center gap-1.5">
          <FiSend className="text-sm" />
          <span>Генерация</span>
        </div>
      </div>
    </div>
  )
}

const GeneratedResult = ({ content, activeTab }: { content: GeneratedContent, activeTab: string }) => {
  const getAdvice = () => {
    switch(activeTab) {
      case 'post':
        return 'Не публикуйте готовый пост как есть. Добавьте личный опыт, пример из практики или наблюдение. Это превращает шаблонный текст в уникальный контент.'
      case 'ideas':
        return 'Берите идею и адаптируйте под свой стиль. Одна хорошая тема может стать серией постов, опросом и другим форматом. Растягивайте контент.'
      case 'poll':
        return 'После опроса обязательно опубликуйте результаты и свои выводы. Это закрывает цикл вовлечения и мотивирует участвовать снова.'
      case 'series':
        return 'Публикуйте серию с интервалом в 1-2 дня. Напоминайте о предыдущей части и анонсируйте следующую. Это создаёт привычку возвращаться.'
      default:
        return 'Адаптируйте контент под свой стиль и аудиторию.'
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-white/5 border border-white/10 rounded-xl p-5 sm:p-6 backdrop-blur-sm">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#4CAF50]/20 flex items-center justify-center flex-shrink-0">
            <FiSend className="text-[#4CAF50] text-lg" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white mb-3 leading-relaxed">
              {content.title}
            </h3>
            <div className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
              {content.content}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-[#4CAF50]/5 border border-[#4CAF50]/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <FiSmile className="text-[#4CAF50] text-sm" />
            <h4 className="text-xs font-semibold text-[#4CAF50] uppercase tracking-[0.05em]">
              Тон
            </h4>
          </div>
          <p className="text-white/50 text-xs leading-relaxed">
            {content.toneNote}
          </p>
        </div>

        <div className="bg-[#FFA726]/5 border border-[#FFA726]/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <FiPenTool className="text-[#FFA726] text-sm" />
            <h4 className="text-xs font-semibold text-[#FFA726] uppercase tracking-[0.05em]">
              Структура
            </h4>
          </div>
          <p className="text-white/50 text-xs leading-relaxed">
            {content.structureNote}
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#4CAF50]/10 to-[#FFA726]/10 border border-[#4CAF50]/20 rounded-xl p-4 sm:p-5 backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4CAF50] to-[#FFA726] flex items-center justify-center flex-shrink-0">
            <FiZap className="text-white text-sm" />
          </div>
          <div>
            <h3 className="text-[#4CAF50] font-semibold mb-2 text-sm">
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
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/60 hover:text-[#4CAF50] hover:bg-[#4CAF50]/10 transition-all duration-150 cursor-pointer">
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
  const getIcon = () => {
    switch(activeTab) {
      case 'post': return <FiSend className="text-[#4CAF50] text-2xl" />
      case 'ideas': return <FiZap className="text-[#4CAF50] text-2xl" />
      case 'poll': return <FiMessageSquare className="text-[#4CAF50] text-2xl" />
      case 'series': return <FiLayers className="text-[#4CAF50] text-2xl" />
      default: return <FiSend className="text-[#4CAF50] text-2xl" />
    }
  }

  const getMessage = () => {
    switch(activeTab) {
      case 'post':
        return 'Введите тему, и AI создаст готовый пост. С эмодзи, структурой и призывом к действию.'
      case 'ideas':
        return 'Укажите тему, и AI предложит идеи для публикаций с обоснованием. Экономия часов на мозговом штурме.'
      case 'poll':
        return 'Назовите тему, и AI создаст опрос для вовлечения аудитории. С продуманными вариантами ответов.'
      case 'series':
        return 'Задайте тему, и AI разработает серию связанных постов. С прогрессией и удержанием внимания.'
      default:
        return 'Введите тему для генерации контента.'
    }
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-8 sm:p-12 backdrop-blur-sm flex flex-col items-center justify-center text-center min-h-[500px]">
      <div className="w-16 h-16 rounded-2xl bg-[#4CAF50]/10 flex items-center justify-center mb-5">
        {getIcon()}
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
          <span>~10 секунд</span>
        </div>
        <div className="flex items-center gap-1.5">
          <FiTarget className="text-sm" />
          <span>Адаптивный тон</span>
        </div>
        <div className="flex items-center gap-1.5">
          <FiSend className="text-sm" />
          <span>Готово к публикации</span>
        </div>
      </div>
    </div>
  )
}

export default ChannelContentService
