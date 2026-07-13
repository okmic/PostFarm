import { useState, type JSX } from 'react'
import { FiSend, FiZap, FiCopy, FiRefreshCw, FiMessageSquare, FiLayers, FiInfo, FiTarget, FiSmile, FiPenTool, FiArrowLeft, FiThumbsUp } from 'react-icons/fi'
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
  apiType: PostChannelContentTypeEnum
}

type Tone = {
  id: string
  label: string
  icon: JSX.Element
  apiType: PostChannelContentToneEnum
}

type GeneratedContent = {
  title: string
  content: string
  toneNote: string
  structureNote: string
}

type Mode = 'new' | 'refine'

const SYSTEM_PROMPT = `Ты — профессиональный копирайтер и контент-стратег с 10-летним опытом. Твоя задача — создавать выдающийся контент, который вовлекает, продаёт и запоминается.

Критически оценивай каждый свой текст. Ты не просто генерируешь шаблонные ответы — ты создаёшь контент, который выделяется среди миллионов других публикаций.

Правила:
1. Пиши как лучший копирайтер в своей нише
2. Используй вовлекающие заголовки и сильные вступления
3. Добавляй ценность, а не просто воду
4. Структурируй текст для удобства чтения
5. Заканчивай чётким призывом к действию
6. Учитывай выбранный тон общения
7. Никогда не используй шаблонные фразы
8. Каждый текст должен быть уникальным и свежим
9. Добавляй конкретные примеры и жизненные ситуации
10. Пиши так, будто обращаешься к одному человеку`

const ChannelContentService = () => {
  const [prompt, setPrompt] = useState('')
  const userId = useSelector((s: RootState) => s.auth.user!._id!)
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState('post')
  const [tone, setTone] = useState('friendly')
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<Mode>('new')
  const { refreshAll } = useGetData()

  const tabs: Tab[] = [
    { id: 'post', label: 'Пост', icon: <FiSend className="text-sm" />, description: 'Готовый текст для публикации', apiType: 'POST' },
    { id: 'ideas', label: 'Идеи', icon: <FiZap className="text-sm" />, description: 'Темы и концепции', apiType: 'IDEA' },
    { id: 'poll', label: 'Опрос', icon: <FiMessageSquare className="text-sm" />, description: 'Вовлекающий интерактив', apiType: 'POLL' },
    { id: 'series', label: 'Серия', icon: <FiLayers className="text-sm" />, description: 'Цепочка публикаций', apiType: 'SERIES' },
  ]

  const tones: Tone[] = [
    { id: 'friendly', label: 'Дружелюбный', icon: <FiSmile className="text-sm" />, apiType: 'FRIENDLY' },
    { id: 'expert', label: 'Экспертный', icon: <FiTarget className="text-sm" />, apiType: 'EXPERT' },
    { id: 'casual', label: 'Разговорный', icon: <FiPenTool className="text-sm" />, apiType: 'СASUAL' },
    { id: 'humor', label: 'С юмором', icon: <FiSmile className="text-sm" />, apiType: 'HUMOROUS' },
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
      case 'post': return 'Тема поста (например: как продвигать контент)'
      case 'ideas': return 'Ниша или тема (например: блог про маркетинг)'
      case 'poll': return 'Тема опроса (например: отношение к рекламе)'
      case 'series': return 'Тема серии (например: запуск блога с нуля)'
      default: return 'Введите тему для генерации'
    }
  }

  const getTitleByTab = (tabId: string): string => {
    switch (tabId) {
      case 'post': return 'Готовый пост'
      case 'ideas': return 'Идеи'
      case 'poll': return 'Опрос'
      case 'series': return 'Серия постов'
      default: return 'Контент'
    }
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError(mode === 'refine' ? 'Укажите, что улучшить' : 'Введите тему для генерации')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const currentTab = tabs.find(tab => tab.id === activeTab)
      const currentTone = tones.find(t => t.id === tone)
      const apiType = currentTab?.apiType || 'POST'
      const apiTone = currentTone?.apiType || 'FRIENDLY'

      let systemPrompt = SYSTEM_PROMPT

      if (mode === 'refine' && generatedContent) {
        systemPrompt = `${systemPrompt}\n\nИнструкция по улучшению: ${prompt.trim()}`
      }

      const userPrompt = mode === 'refine' && generatedContent
        ? `Улучши этот контент:\n\n${generatedContent.content}`
        : prompt.trim()

      const response = await apiAiService.chanelContent({
        text: userPrompt,
        type: apiType,
        tone: apiTone,
        userId,
        prompt: systemPrompt,
      })

      if (response && typeof response === 'string' && response.trim()) {
        setGeneratedContent({
          title: getTitleByTab(activeTab),
          content: response,
          toneNote: `Тон: ${currentTone?.label || 'Дружелюбный'}`,
          structureNote: 'Структура: заголовок → вступление → основная часть → призыв к действию'
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
              <label className="text-xs font-medium text-white/40 tracking-wider">Тип контента</label>
              <div className="grid grid-cols-2 gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); resetAll() }}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                      activeTab === tab.id
                        ? 'border-[#4CAF50] bg-[#4CAF50]/10 text-white'
                        : 'border-white/10 text-white/50 hover:border-white/20 hover:text-white/80'
                    }`}
                  >
                    <span className={activeTab === tab.id ? 'text-[#4CAF50]' : 'text-white/40'}>
                      {tab.icon}
                    </span>
                    <span className="text-xs font-medium">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-white/40 tracking-wider block mb-2">Тон общения</label>
              <div className="grid grid-cols-2 gap-2">
                {tones.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTone(t.id)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                      tone === t.id
                        ? 'border-[#4CAF50] bg-[#4CAF50]/10 text-white'
                        : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white/70'
                    }`}
                  >
                    <span className={tone === t.id ? 'text-[#4CAF50]' : 'text-white/30'}>
                      {t.icon}
                    </span>
                    <span className="text-xs">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-white/40 tracking-wider">
                  {mode === 'refine' ? 'Инструкция для улучшения' : 'О чём писать'}
                </label>
                {mode === 'refine' && (
                  <span className="text-[10px] text-[#4CAF50] bg-[#4CAF50]/20 px-2 py-0.5 rounded-full">
                    Режим улучшения
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
                className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white placeholder-white/20 resize-none focus:outline-none focus:border-[#4CAF50]/50 transition-all"
                disabled={isGenerating}
              />
              <div className="flex justify-end mt-1.5 text-[10px] text-white/20">
                ⌘ + Enter
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full bg-[#4CAF50] hover:bg-[#4CAF50]/90 text-white rounded-xl px-4 py-3.5 font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {isGenerating ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="text-sm">{mode === 'refine' ? 'Улучшаем...' : 'Генерируем...'}</span>
                </span>
              ) : (
                <>
                  <FiZap className="text-base" />
                  <span className="text-sm">{mode === 'refine' ? 'Улучшить контент' : 'Сгенерировать контент'}</span>
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
                    setPrompt('Сделай контент более вовлекающим, добавь живые примеры')
                  }}
                  mode={mode}
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
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Контент для блога</h1>
      <p className="text-white/30 text-sm mt-0.5 hidden sm:block">Создайте контент с помощью AI за 10 секунд</p>
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
  mode: Mode
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

    <div className="flex-1 py-4 sm:py-5 overflow-y-auto max-h-[400px] sm:max-h-[600px]">
      <div className="text-sm sm:text-base text-white/70 leading-relaxed break-words [word-break:break-word] [overflow-wrap:anywhere] whitespace-pre-wrap">
        {content.content}
      </div>
    </div>

    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-4 border-t border-white/10">
      <button
        onClick={onImprove}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4CAF50]/10 border border-[#4CAF50]/20 text-[#4CAF50] hover:bg-[#4CAF50]/20 transition-all duration-200 cursor-pointer text-sm font-medium"
      >
        <FiThumbsUp className="text-sm" />
        <span>Улучшить</span>
        <span className="text-[10px] opacity-60 hidden sm:inline">(добавит примеры и эмоции)</span>
      </button>
      <div className="flex flex-wrap items-center gap-3 text-xs text-white/30">
        <span>{content.toneNote}</span>
        <span className="w-1 h-1 rounded-full bg-white/20" />
        <span>{content.structureNote}</span>
      </div>
    </div>
  </div>
)

const EmptyState = ({ activeTab }: { activeTab: string }) => {
  const getMessage = () => {
    switch (activeTab) {
      case 'post':
        return 'Введите тему, и AI создаст готовый пост'
      case 'ideas':
        return 'Укажите тему, и AI предложит идеи'
      case 'poll':
        return 'Назовите тему, и AI создаст опрос'
      case 'series':
        return 'Задайте тему, и AI разработает серию'
      default:
        return 'Введите тему для генерации'
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-[400px] text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#4CAF50]/10 flex items-center justify-center mb-4">
        <FiZap className="text-[#4CAF50] text-2xl" />
      </div>
      <h3 className="text-white/40 font-medium text-sm mb-1">Готово к генерации</h3>
      <p className="text-white/15 text-sm max-w-xs">{getMessage()}</p>
    </div>
  )
}

export default ChannelContentService