import { useState, type JSX } from 'react'
import { FiBookOpen, FiCloudLightning, FiStar, FiLayers, FiUsers, FiTarget, FiZap, FiCopy, FiRefreshCw, FiThumbsUp, FiArrowLeft, FiInfo } from 'react-icons/fi'
import type { EducationContentEnum, EducationLevelEnum } from '../../../../../../pkg/types/ai.text.types'
import apiAiService from '../../../pkg/api/api.ai.service'
import { SimpleLogoLoading } from '../../../components/Logo/LogoLoading'
import { useSelector } from 'react-redux'
import type { RootState } from '../../../store/store'
import { useGetData } from '../../../hooks/useGetData'

type Tab = {
  id: EducationContentEnum
  label: string
  icon: JSX.Element
  description: string
}

type Audience = {
  id: EducationLevelEnum
  label: string
  icon: JSX.Element
  description: string
}

type GeneratedContent = {
  title: string
  content: string
  toneNote: string
  structureNote: string
}

type Mode = 'new' | 'refine'

const SYSTEM_PROMPT = `Ты — опытный педагог и создатель образовательного контента. Твоя задача — объяснять сложные вещи просто, понятно и увлекательно.

Правила:
1. Начинай с вовлекающего вопроса или факта
2. Структурируй информацию логично
3. Используй понятные аналогии и примеры
4. Добавляй практические советы
5. Заканчивай выводом или заданием
6. Учитывай уровень подготовки аудитории
7. Пиши живым, человеческим языком
8. Избегай воды и общих фраз
9. Каждый пост должен давать пользу
10. Вдохновляй и мотивируй учиться дальше`

const EducationPostsService = () => {
  const [prompt, setPrompt] = useState('')
  const userId = useSelector((s: RootState) => s.auth.user!._id!)
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState<EducationContentEnum>('GUIDE')
  const [audience, setAudience] = useState<EducationLevelEnum>('BEGINNER')
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<Mode>('new')
  const { refreshAll } = useGetData()

  const tabs: Tab[] = [
    { id: 'GUIDE', label: 'Гайд', icon: <FiBookOpen className="text-sm" />, description: 'Пошаговая инструкция' },
    { id: 'EXPLAIN', label: 'Объяснение', icon: <FiCloudLightning className="text-sm" />, description: 'Сложное простыми словами' },
    { id: 'FACTS', label: 'Факты', icon: <FiStar className="text-sm" />, description: 'Познавательные заметки' },
    { id: 'COURSE', label: 'Курс', icon: <FiLayers className="text-sm" />, description: 'Серия связанных уроков' },
  ]

  const audiences: Audience[] = [
    { id: 'BEGINNER', label: 'Новичкам', icon: <FiUsers className="text-sm" />, description: 'Объясняю с нуля' },
    { id: 'ADVANCED', label: 'Продвинутым', icon: <FiTarget className="text-sm" />, description: 'Детали и нюансы' },
    { id: 'EXPERT', label: 'Экспертам', icon: <FiZap className="text-sm" />, description: 'Глубокий анализ' },
  ]

  const resetAll = () => {
    setGeneratedContent(null)
    setPrompt('')
    setMode('new')
    setError(null)
  }

  const goBack = () => {
    if (mode === 'refine' && generatedContent) {
      setMode('new')
      setPrompt('')
      setError(null)
      return
    }
    if (generatedContent) {
      resetAll()
      return
    }
    if (prompt.trim()) {
      setPrompt('')
      return
    }
  }

  const getPlaceholder = () => {
    if (mode === 'refine') {
      return 'Напишите, что улучшить...'
    }
    switch (activeTab) {
      case 'GUIDE': return 'Тема гайда (например: как настроить контекст)'
      case 'EXPLAIN': return 'Что объяснить (например: что такое RAG)'
      case 'FACTS': return 'Тема фактов (например: история AI)'
      case 'COURSE': return 'Тема курса (например: основы промптинга)'
      default: return 'Введите тему'
    }
  }

  const getTitleByTab = (tabId: EducationContentEnum): string => {
    switch (tabId) {
      case 'GUIDE': return 'Пошаговый гайд'
      case 'EXPLAIN': return 'Простое объяснение'
      case 'FACTS': return 'Познавательные факты'
      case 'COURSE': return 'Курс уроков'
      default: return 'Образовательный пост'
    }
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError(mode === 'refine' ? 'Укажите, что улучшить' : 'Введите тему')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      let systemPrompt = SYSTEM_PROMPT

      if (mode === 'refine' && generatedContent) {
        systemPrompt = `${systemPrompt}\n\nИнструкция по улучшению: ${prompt.trim()}`
      }

      const userPrompt = mode === 'refine' && generatedContent
        ? `Улучши этот контент:\n\n${generatedContent.content}`
        : prompt.trim()

      const response = await apiAiService.educationPost({
        topic: userPrompt,
        type: activeTab,
        level: audience,
        userId,
        prompt: systemPrompt,
      })

      if (response && typeof response === 'string' && response.trim()) {
        setGeneratedContent({
          title: getTitleByTab(activeTab),
          content: response,
          toneNote: `Уровень: ${audiences.find(a => a.id === audience)?.label || 'Новичкам'}`,
          structureNote: 'Структура: вступление → основная часть → вывод'
        })
        setMode('refine')
        setPrompt('')
        refreshAll()
      } else {
        throw new Error('Не удалось получить ответ')
      }
    } catch (err) {
      console.error('API Error:', err)
      setError(err instanceof Error ? err.message : 'Ошибка при генерации')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = () => {
    if (!generatedContent) return
    navigator.clipboard.writeText(`${generatedContent.title}\n\n${generatedContent.content}`)
  }

  return (
    <div className="min-h-screen text-white font-['Inter']">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Header onBack={goBack} canGoBack={!!prompt.trim() || !!generatedContent || mode === 'refine'} />
        {error && <ErrorMessage error={error} />}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mt-4">
          <div className="lg:col-span-4 space-y-5">
            <div className="space-y-3">
              <label className="text-xs font-medium text-white/40 tracking-wider">Формат</label>
              <div className="grid grid-cols-2 gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); resetAll() }}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                      activeTab === tab.id
                        ? 'border-[#8B5CF6] bg-[#8B5CF6]/10 text-white'
                        : 'border-white/10 text-white/50 hover:border-white/20 hover:text-white/80'
                    }`}
                  >
                    <span className={activeTab === tab.id ? 'text-[#8B5CF6]' : 'text-white/40'}>
                      {tab.icon}
                    </span>
                    <span className="text-xs font-medium">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-white/40 tracking-wider block mb-2">Уровень аудитории</label>
              <div className="grid grid-cols-1 gap-2">
                {audiences.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setAudience(a.id)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                      audience === a.id
                        ? 'border-[#8B5CF6] bg-[#8B5CF6]/10 text-white'
                        : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white/70'
                    }`}
                  >
                    <span className={audience === a.id ? 'text-[#8B5CF6]' : 'text-white/30'}>
                      {a.icon}
                    </span>
                    <div className="flex-1">
                      <span className="text-xs font-medium">{a.label}</span>
                      <p className="text-[10px] text-white/30">{a.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-white/40 tracking-wider">
                  {mode === 'refine' ? 'Инструкция для улучшения' : 'О чём рассказать'}
                </label>
                {mode === 'refine' && (
                  <span className="text-[10px] text-[#8B5CF6] bg-[#8B5CF6]/20 px-2 py-0.5 rounded-full">
                    Улучшение
                  </span>
                )}
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    handleGenerate()
                  }
                }}
                placeholder={getPlaceholder()}
                className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white placeholder-white/20 resize-none focus:outline-none focus:border-[#8B5CF6]/50 transition-all"
                disabled={isGenerating}
              />
              <div className="flex justify-end mt-1.5 text-[10px] text-white/20">
                ⌘ + Enter
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#4CAF50] hover:opacity-90 text-white rounded-xl px-4 py-3.5 font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {isGenerating ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="text-sm">{mode === 'refine' ? 'Улучшаем...' : 'Генерируем...'}</span>
                </span>
              ) : (
                <>
                  <FiZap className="text-base" />
                  <span className="text-sm">{mode === 'refine' ? 'Улучшить' : 'Сгенерировать'}</span>
                </>
              )}
            </button>

            {generatedContent && (
              <button
                onClick={resetAll}
                className="w-full text-white/30 hover:text-white/60 text-xs transition-colors duration-200 cursor-pointer py-2"
              >
                Начать сначала
              </button>
            )}
          </div>

          <div className="lg:col-span-8">
            <div className="bg-white/5 rounded-2xl border border-white/10 min-h-[500px] p-5 sm:p-6 relative">
              {isGenerating ? (
                <LoadingState />
              ) : generatedContent ? (
                <ResultContent
                  content={generatedContent}
                  onCopy={handleCopy}
                  onRegenerate={handleGenerate}
                  onReset={resetAll}
                  onImprove={() => {
                    setMode('refine')
                    setPrompt('Сделай контент более структурированным, добавь практические советы')
                  }}
                  isGenerating={isGenerating}
                />
              ) : (
                <EmptyState activeTab={activeTab} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const Header = ({ onBack, canGoBack }: { onBack: () => void; canGoBack: boolean }) => (
  <div className="flex items-center gap-3">
    {canGoBack && (
      <button
        onClick={onBack}
        className="p-2 rounded-xl hover:bg-white/5 transition-colors duration-200 text-white/40 hover:text-white/80 cursor-pointer"
      >
        <FiArrowLeft className="text-xl" />
      </button>
    )}
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Образовательные посты</h1>
      <p className="text-white/30 text-sm mt-0.5 hidden sm:block">Создайте обучающий контент с помощью AI</p>
    </div>
  </div>
)

const ErrorMessage = ({ error }: { error: string }) => (
  <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-sm flex items-center gap-2">
    <FiInfo className="text-red-400 flex-shrink-0" />
    <span>{error}</span>
  </div>
)

const LoadingState = () => (
  <div className="flex flex-col items-center justify-center h-[400px] text-center">
    <SimpleLogoLoading />
    <h3 className="text-white/60 font-medium mt-6">Генерация контента</h3>
    <p className="text-white/20 text-sm max-w-xs mt-2">Обычно занимает 10–15 секунд</p>
  </div>
)

const ResultContent = ({
  content,
  onCopy,
  onRegenerate,
  onReset,
  onImprove,
  isGenerating,
}: {
  content: GeneratedContent
  onCopy: () => void
  onRegenerate: () => void
  onReset: () => void
  onImprove: () => void
  isGenerating: boolean
}) => (
  <div className="flex flex-col h-full">
    <div className="flex items-center justify-between gap-3 pb-4 border-b border-white/10 flex-wrap">
      <h3 className="text-base font-semibold text-white/80">{content.title}</h3>
      <div className="flex items-center gap-1.5">
        <button
          onClick={onCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/50 hover:text-white hover:bg-white/5 transition-colors duration-200 cursor-pointer"
        >
          <FiCopy className="text-sm" />
          <span className="hidden sm:inline">Копировать</span>
        </button>
        <button
          onClick={onRegenerate}
          disabled={isGenerating}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/50 hover:text-white hover:bg-white/5 transition-colors duration-200 cursor-pointer disabled:opacity-40"
        >
          <FiRefreshCw className={`text-sm ${isGenerating ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Обновить</span>
        </button>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors duration-200 cursor-pointer"
        >
          <FiRefreshCw className="text-sm" />
          <span className="hidden sm:inline">Сброс</span>
        </button>
      </div>
    </div>

    <div className="flex-1 py-4 sm:py-5 text-sm sm:text-base text-white/70 leading-relaxed whitespace-pre-wrap break-words overflow-y-auto max-h-[500px] sm:max-h-[600px]">
      {content.content}
    </div>

    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-4 border-t border-white/10">
      <button
        onClick={onImprove}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[#8B5CF6] hover:bg-[#8B5CF6]/20 transition-all duration-200 cursor-pointer text-sm font-medium"
      >
        <FiThumbsUp className="text-sm" />
        <span>Улучшить</span>
        <span className="text-[10px] opacity-60 hidden sm:inline">(структура и практика)</span>
      </button>
      <div className="flex flex-wrap items-center gap-3 text-xs text-white/30">
        <span>{content.toneNote}</span>
        <span className="w-1 h-1 rounded-full bg-white/20" />
        <span>{content.structureNote}</span>
      </div>
    </div>
  </div>
)

const EmptyState = ({ activeTab }: { activeTab: EducationContentEnum }) => {
  const getIcon = () => {
    switch (activeTab) {
      case 'GUIDE': return <FiBookOpen className="text-[#8B5CF6] text-2xl" />
      case 'EXPLAIN': return <FiCloudLightning className="text-[#8B5CF6] text-2xl" />
      case 'FACTS': return <FiStar className="text-[#8B5CF6] text-2xl" />
      case 'COURSE': return <FiLayers className="text-[#8B5CF6] text-2xl" />
      default: return <FiBookOpen className="text-[#8B5CF6] text-2xl" />
    }
  }

  const getMessage = () => {
    switch (activeTab) {
      case 'GUIDE': return 'Введите тему, и AI создаст пошаговый гайд'
      case 'EXPLAIN': return 'Введите тему, и AI объяснит сложное простыми словами'
      case 'FACTS': return 'Введите тему, и AI соберёт интересные факты'
      case 'COURSE': return 'Введите тему, и AI разработает курс уроков'
      default: return 'Введите тему для генерации'
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-[400px] text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#8B5CF6]/10 flex items-center justify-center mb-4">
        {getIcon()}
      </div>
      <h3 className="text-white/40 font-medium text-sm mb-1">Готово к генерации</h3>
      <p className="text-white/15 text-sm max-w-xs">{getMessage()}</p>
    </div>
  )
}

export default EducationPostsService