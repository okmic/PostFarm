import { useState } from 'react'
import { FiZap, FiCopy, FiRefreshCw, FiThumbsUp, FiBookOpen, FiLayers, FiCloudLightning, FiCheckCircle, FiInfo, FiStar, FiArrowRight, FiClock, FiSend, FiUsers, FiTarget, FiPenTool } from 'react-icons/fi'
import type { EducationContentEnum, EducationLevelEnum } from '../../../../../../pkg/types/ai.text.types'
import apiAiService from '../../../pkg/api/api.ai.service'
import { SimpleLogoLoading } from '../../../components/Logo/LogoLoading'

const EducationPostsService = () => {
  const [topic, setTopic] = useState('')
  const [audience, setAudience] = useState<EducationLevelEnum>('BEGINNER')
  const [generatedContent, setGeneratedContent] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState<EducationContentEnum>('GUIDE')
  const [currentStep, setCurrentStep] = useState(1)
  const [error, setError] = useState<string | null>(null)

  const tabs = [
    { 
      id: 'GUIDE' as EducationContentEnum, 
      label: 'Мини-гайд', 
      icon: <FiBookOpen className="text-sm" />,
      description: 'Пошаговая инструкция',
      example: 'Как настроить AI-бота → 5 шагов'
    },
    { 
      id: 'EXPLAIN' as EducationContentEnum, 
      label: 'Объяснение', 
      icon: <FiCloudLightning className="text-sm" />,
      description: 'Сложное простыми словами',
      example: 'Что такое нейросети → на примере пиццы'
    },
    { 
      id: 'FACTS' as EducationContentEnum, 
      label: 'Факты', 
      icon: <FiStar className="text-sm" />,
      description: 'Познавательные заметки',
      example: '5 фактов об AI, которые удивят'
    },
    { 
      id: 'COURSE' as EducationContentEnum, 
      label: 'Серия уроков', 
      icon: <FiLayers className="text-sm" />,
      description: 'Курс из связанных постов',
      example: 'AI для новичков → 5 уроков'
    },
  ]

  const audiences = [
    { id: 'BEGINNER' as EducationLevelEnum, label: 'Новичкам', icon: <FiUsers className="text-sm" />, description: 'Объясняю с нуля, без терминов' },
    { id: 'ADVANCED' as EducationLevelEnum, label: 'Продвинутым', icon: <FiTarget className="text-sm" />, description: 'Детали, нюансы, лучшие практики' },
    { id: 'EXPERT' as EducationLevelEnum, label: 'Экспертам', icon: <FiZap className="text-sm" />, description: 'Глубокий анализ, инсайты' },
  ]

  const steps = [
    { number: 1, label: 'Тема', icon: <FiBookOpen className="text-sm" /> },
    { number: 2, label: 'Генерация', icon: <FiZap className="text-sm" /> },
    { number: 3, label: 'Результат', icon: <FiSend className="text-sm" /> },
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
      const response = await apiAiService.educationPost({ 
        topic: topic.trim(), 
        type: activeTab, 
        level: audience 
      })

      if (response?.trim()) {
        setGeneratedContent(response)
        setCurrentStep(3)
      } else {
        throw new Error('Не удалось получить результат')
      }
    } catch (err) {
      console.error('API Error:', err)
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
    setGeneratedContent(null)
    setCurrentStep(1)
    handleGenerate()
  }

  return (
    <div className="min-h-screen bg-[#1E3A1E] text-white font-['Inter']">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
        
        <div className="mb-6 sm:mb-8">
          <span className="inline-block px-3 py-1 bg-[#8B5CF6]/20 text-[#8B5CF6] text-xs font-medium rounded-full uppercase tracking-[0.05em] mb-3">
            Обучение
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-[-0.02em] mb-2">
            Обучающие посты
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 mb-6 sm:mb-8">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center gap-2 sm:gap-4">
              <div className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl transition-all duration-300 ${
                currentStep >= step.number 
                  ? 'bg-[#8B5CF6]/20 border border-[#8B5CF6]/30' 
                  : 'bg-white/5 border border-white/10'
              }`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  currentStep >= step.number 
                    ? 'bg-[#8B5CF6] text-white' 
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
                  currentStep >= step.number ? 'text-[#8B5CF6]' : 'text-white/40'
                }`}>
                  {step.icon}
                </span>
              </div>
              {index < steps.length - 1 && (
                <FiArrowRight className={`text-sm flex-shrink-0 ${
                  currentStep > step.number ? 'text-[#8B5CF6]' : 'text-white/20'
                }`} />
              )}
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 text-sm flex items-center gap-2">
            <FiInfo className="text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6 sm:mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id)
                setGeneratedContent(null)
                setCurrentStep(1)
                setError(null)
              }}
              className={`text-left p-4 rounded-xl transition-all duration-150 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 shadow-[0_0_12px_rgba(139,92,246,0.15)]'
                  : 'bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/8'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={activeTab === tab.id ? 'text-[#8B5CF6]' : 'text-white/60'}>
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

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-5 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#8B5CF6]/20 flex items-center justify-center flex-shrink-0">
                  <FiInfo className="text-[#8B5CF6] text-sm" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#8B5CF6] mb-1">
                    Как это работает
                  </h3>
                  <p className="text-white/50 text-xs leading-relaxed">
                    {activeTab === 'GUIDE' && 'Введите тему, и AI создаст пошаговую инструкцию с чёткими этапами. Каждый шаг объяснён простым языком. Идеально для обучения подписчиков новым навыкам.'}
                    {activeTab === 'EXPLAIN' && 'Назовите сложную тему, и AI объяснит её на простых аналогиях. Без терминов, с примерами из жизни. Ваши читатели скажут «А, вот оно что!»'}
                    {activeTab === 'FACTS' && 'Укажите тему, и AI соберёт удивительные факты с цифрами и статистикой. Познавательный контент, которым хочется поделиться.'}
                    {activeTab === 'COURSE' && 'Задайте тему курса, и AI создаст урок с домашним заданием. С прогрессией сложности и удержанием внимания.'}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60 mb-3 tracking-[0.05em] uppercase">
                Для кого объясняем
              </label>
              <div className="grid grid-cols-1 gap-2">
                {audiences.map((aud) => (
                  <button
                    key={aud.id}
                    onClick={() => setAudience(aud.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-150 cursor-pointer ${
                      audience === aud.id
                        ? 'bg-[#8B5CF6]/20 border border-[#8B5CF6]/30'
                        : 'bg-white/5 border border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      audience === aud.id ? 'bg-[#8B5CF6]/30' : 'bg-white/5'
                    }`}>
                      <span className={audience === aud.id ? 'text-[#8B5CF6]' : 'text-white/40'}>
                        {aud.icon}
                      </span>
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${
                        audience === aud.id ? 'text-white' : 'text-white/60'
                      }`}>
                        {aud.label}
                      </p>
                      <p className="text-xs text-white/30">{aud.description}</p>
                    </div>
                    {audience === aud.id && (
                      <FiCheckCircle className="text-[#8B5CF6] text-sm ml-auto flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60 mb-2 tracking-[0.05em] uppercase">
                О чём рассказать
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder={
                  activeTab === 'GUIDE' ? 'Например: Как настроить автопостинг в Telegram за 5 шагов' :
                  activeTab === 'EXPLAIN' ? 'Например: Что такое блокчейн и как он работает' :
                  activeTab === 'FACTS' ? 'Например: Интересные факты об истории Telegram' :
                  'Например: Основы контент-маркетинга для новичков'
                }
                className="w-full h-36 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 resize-none focus:outline-none focus:border-[#8B5CF6] focus:shadow-[0_0_12px_rgba(139,92,246,0.15)] transition-all duration-150"
                disabled={isGenerating}
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={!topic.trim() || isGenerating}
              className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#4CAF50] text-white rounded-xl px-6 py-4 font-bold hover:translate-y-[-2px] hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all duration-150 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <span className="flex gap-1.5">
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                  <span className="text-sm">Создаю обучающий контент...</span>
                </>
              ) : (
                <>
                  <FiBookOpen className="text-lg group-hover:scale-110 transition-transform" />
                  <span>Сгенерировать пост</span>
                  <FiArrowRight className="text-sm opacity-60" />
                </>
              )}
            </button>
          </div>

          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-white/60 tracking-[0.05em] uppercase flex items-center gap-2">
                <FiSend className="text-sm" />
                Результат генерации
              </label>
              {generatedContent && (
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 border border-white/10 transition-all duration-150 cursor-pointer"
                  >
                    <FiCopy className="text-sm" />
                    <span className="hidden sm:inline">Копировать</span>
                  </button>
                  <button
                    onClick={handleRegenerate}
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
              <div className="bg-white/5 border border-white/10 rounded-xl p-8 sm:p-12 backdrop-blur-sm flex flex-col items-center justify-center text-center min-h-[500px]">
                <SimpleLogoLoading />
                <div className="mt-8 flex items-center gap-4 text-white/15 text-xs">
                  <div className="flex items-center gap-1.5">
                    <FiPenTool className="text-sm" />
                    <span>Анализ темы</span>
                  </div>
                  <div className="w-1 h-1 bg-white/20 rounded-full" />
                  <div className="flex items-center gap-1.5">
                    <FiBookOpen className="text-sm" />
                    <span>Подбор структуры</span>
                  </div>
                  <div className="w-1 h-1 bg-white/20 rounded-full" />
                  <div className="flex items-center gap-1.5">
                    <FiSend className="text-sm" />
                    <span>Генерация поста</span>
                  </div>
                </div>
              </div>
            ) : generatedContent ? (
              <div className="space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 sm:p-8 backdrop-blur-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/20 flex items-center justify-center flex-shrink-0">
                      <FiSend className="text-[#8B5CF6] text-lg" />
                    </div>
                    <div className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">
                      {generatedContent}
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-[#8B5CF6]/10 to-[#4CAF50]/10 border border-[#8B5CF6]/20 rounded-xl p-4 sm:p-5 backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#4CAF50] flex items-center justify-center flex-shrink-0">
                      <FiCloudLightning className="text-white text-sm" />
                    </div>
                    <div>
                      <h3 className="text-[#8B5CF6] font-semibold mb-2 text-sm">
                        Совет по использованию
                      </h3>
                      <p className="text-white/70 text-xs leading-relaxed">
                        Добавьте личный пример из практики — это повысит доверие. Один реальный кейс стоит десяти общих советов.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-white/40">Оценить:</span>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/60 hover:text-[#8B5CF6] hover:bg-[#8B5CF6]/10 transition-all duration-150 cursor-pointer">
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
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-xl p-8 sm:p-12 backdrop-blur-sm flex flex-col items-center justify-center text-center min-h-[500px]">
                <div className="w-16 h-16 rounded-2xl bg-[#8B5CF6]/10 flex items-center justify-center mb-5">
                  {activeTab === 'GUIDE' && <FiBookOpen className="text-[#8B5CF6] text-2xl" />}
                  {activeTab === 'EXPLAIN' && <FiCloudLightning className="text-[#8B5CF6] text-2xl" />}
                  {activeTab === 'FACTS' && <FiStar className="text-[#8B5CF6] text-2xl" />}
                  {activeTab === 'COURSE' && <FiLayers className="text-[#8B5CF6] text-2xl" />}
                </div>
                <h3 className="text-white/80 font-semibold mb-2">
                  Готово к созданию
                </h3>
                <p className="text-white/30 text-sm max-w-sm mb-6">
                  Введите тему, и AI создаст пост с учётом выбранного формата и уровня аудитории.
                </p>
                <div className="flex items-center gap-4 text-white/15 text-xs">
                  <div className="flex items-center gap-1.5">
                    <FiClock className="text-sm" />
                    <span>~10 секунд</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FiUsers className="text-sm" />
                    <span>Адаптивный уровень</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FiSend className="text-sm" />
                    <span>Готово к посту</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EducationPostsService
