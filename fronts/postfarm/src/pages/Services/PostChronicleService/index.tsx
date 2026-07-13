import { useState, type JSX } from 'react'
import { FiCopy, FiRefreshCw, FiThumbsUp, FiInfo, FiArrowRight, FiPlus, FiFileText, FiArrowLeft } from 'react-icons/fi'
import { FaHistory } from 'react-icons/fa'
import apiAiService from '../../../pkg/api/api.ai.service'
import type { PostChronicleTypeEnum } from '../../../../../../pkg/types/ai.text.types'
import { SimpleLogoLoading } from '../../../components/Logo/LogoLoading'
import { MdStopScreenShare } from 'react-icons/md'
import { useSelector } from 'react-redux'
import type { RootState } from '../../../store/store'
import { useGetData } from '../../../hooks/useGetData'

type Tab = {
  id: string
  label: string
  icon: JSX.Element
  description: string
  apiType: PostChronicleTypeEnum
}

type GeneratedContent = {
  title: string
  content: string
  styleNote: string
}

type Mode = 'new' | 'refine'

const SYSTEM_PROMPT = `Ты — профессиональный писатель и контент-стратег, который умеет продолжать истории в любом стиле. Твоя задача — анализировать стиль автора и создавать логичное продолжение, которое звучит так, будто написано тем же человеком.

Правила:
1. Тщательно анализируй стиль, тон и лексику автора
2. Сохраняй уникальный голос автора
3. Развивай сюжет логично и увлекательно
4. Добавляй новые детали, но не ломай стиль
5. Создавай законченный текст, готовый к публикации
6. Если автор использует эмодзи — сохраняй их стиль
7. Учитывай длину и структуру оригинальных постов
8. Делай продолжение естественным и органичным
9. Добавляй ценность, а не просто воду
10. Пиши так, будто автор сам продолжает свою мысль`

const PostChronicleService = () => {
  const [prompt, setPrompt] = useState('')
  const userId = useSelector((s: RootState) => s.auth!.user!._id!)
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState('continue')
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<Mode>('new')
  const { refreshAll } = useGetData()

  const tabs: Tab[] = [
    {
      id: 'continue',
      label: 'Продолжение',
      icon: <FiArrowRight className="text-sm" />,
      description: 'Логичное продолжение истории',
      apiType: 'CONTINUATION'
    },
    {
      id: 'new-chapter',
      label: 'Новый поворот',
      icon: <FiPlus className="text-sm" />,
      description: 'Неожиданное развитие сюжета',
      apiType: 'NEW_CHAPTER'
    },
    {
      id: 'spin-off',
      label: 'Спин-офф',
      icon: <FiFileText className="text-sm" />,
      description: 'Ответвление от основной темы',
      apiType: 'SPIN_OFF'
    },
    {
      id: 'the-end',
      label: 'Финал',
      icon: <MdStopScreenShare className="text-sm" />,
      description: 'Завершение истории',
      apiType: 'THE_END'
    }
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
      return 'Напишите, что улучшить в продолжении...'
    }
    return `Скопируйте 2-5 ваших предыдущих постов для анализа стиля...

Пример:
Пост 1:
Привет! Сегодня хочу поделиться мыслями о...

Пост 2:
Продолжая тему прошлого поста, я заметил...

Пост 3:
Многие спрашивали меня про...`
  }

  const getTitleByTab = (tabId: string): string => {
    switch (tabId) {
      case 'continue': return 'Продолжение истории'
      case 'new-chapter': return 'Новый поворот'
      case 'spin-off': return 'Спин-офф'
      case 'the-end': return 'Финал'
      default: return 'Хроника постов'
    }
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError(mode === 'refine' ? 'Укажите, что улучшить' : 'Введите текст предыдущих постов')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const currentTab = tabs.find(tab => tab.id === activeTab)
      const apiType = currentTab?.apiType || 'CONTINUATION'

      let systemPrompt = SYSTEM_PROMPT

      if (mode === 'refine' && generatedContent) {
        systemPrompt = `${systemPrompt}\n\nИнструкция по улучшению: ${prompt.trim()}`
      }

      const userPrompt = mode === 'refine' && generatedContent
        ? `Улучши это продолжение:\n\n${generatedContent.content}`
        : prompt.trim()

      const response = await apiAiService.postChronicle({
        type: apiType,
        text: userPrompt,
        userId,
        prompt: systemPrompt,
      })

      if (response && typeof response === 'string' && response.trim()) {
        setGeneratedContent({
          title: getTitleByTab(activeTab),
          content: response,
          styleNote: 'Стиль: сохранён. Продолжение органично вписывается.'
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
    navigator.clipboard.writeText(generatedContent.content)
  }

  return (
    <div className="min-h-screen text-white font-['Inter']">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Header onBack={goBack} canGoBack={!!prompt.trim() || !!generatedContent || mode === 'refine'} />
        {error && <ErrorMessage error={error} />}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mt-4">
          <div className="lg:col-span-4 space-y-5">
            <div className="space-y-3">
              <label className="text-xs font-medium text-white/40 tracking-wider">Режим</label>
              <div className="grid grid-cols-2 gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); resetAll() }}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${activeTab === tab.id
                        ? 'border-[#FFA726] bg-[#FFA726]/10 text-white'
                        : 'border-white/10 text-white/50 hover:border-white/20 hover:text-white/80'
                      }`}
                  >
                    <span className={activeTab === tab.id ? 'text-[#FFA726]' : 'text-white/40'}>
                      {tab.icon}
                    </span>
                    <span className="text-xs font-medium">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-white/40 tracking-wider">
                  {mode === 'refine' ? 'Инструкция для улучшения' : 'Ваши предыдущие посты'}
                </label>
                {mode === 'refine' && (
                  <span className="text-[10px] text-[#FFA726] bg-[#FFA726]/20 px-2 py-0.5 rounded-full">
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
                className="w-full h-64 bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white placeholder-white/20 resize-none focus:outline-none focus:border-[#FFA726]/50 transition-all"
                disabled={isGenerating}
              />
              <div className="flex justify-between mt-1.5 text-[10px] text-white/20">
                <span>Минимум 2 поста для анализа</span>
                <span>⌘ + Enter</span>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full bg-gradient-to-r from-[#FFA726] to-[#4CAF50] hover:opacity-90 text-[#1E3A1E] rounded-xl px-4 py-3.5 font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {isGenerating ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#1E3A1E]/30 border-t-[#1E3A1E] rounded-full animate-spin" />
                  <span className="text-sm">{mode === 'refine' ? 'Улучшаем...' : 'Анализируем стиль...'}</span>
                </span>
              ) : (
                <>
                  <FaHistory className="text-base" />
                  <span className="text-sm">{mode === 'refine' ? 'Улучшить продолжение' : 'Создать продолжение'}</span>
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
                    setPrompt('Сделай продолжение более живым, добавь яркие детали, усиль эмоциональную связь')
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
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Хроника постов</h1>
      <p className="text-white/30 text-sm mt-0.5 hidden sm:block">Продолжайте истории в своём стиле с помощью AI</p>
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
    <h3 className="text-white/60 font-medium mt-6">Анализируем стиль</h3>
    <p className="text-white/20 text-sm max-w-xs mt-2">Обычно занимает 15–20 секунд</p>
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

    <div className="flex-1 py-4 sm:py-5 overflow-y-auto max-h-[400px] sm:max-h-[600px]">
      <div className="text-sm sm:text-base text-white/70 leading-relaxed whitespace-pre-wrap break-words [word-break:break-word] [overflow-wrap:anywhere]">
        {content.content}
      </div>
    </div>

    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-4 border-t border-white/10">
      <button
        onClick={onImprove}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFA726]/10 border border-[#FFA726]/20 text-[#FFA726] hover:bg-[#FFA726]/20 transition-all duration-200 cursor-pointer text-sm font-medium"
      >
        <FiThumbsUp className="text-sm" />
        <span>Улучшить</span>
        <span className="text-[10px] opacity-60 hidden sm:inline">(добавит ярких деталей)</span>
      </button>
      <div className="flex flex-wrap items-center gap-3 text-xs text-white/30">
        <span>{content.styleNote}</span>
      </div>
    </div>
  </div>
)

const EmptyState = ({ activeTab }: { activeTab: string }) => {
  const getMessage = () => {
    switch (activeTab) {
      case 'continue': return 'Вставьте предыдущие посты, и AI напишет логичное продолжение'
      case 'new-chapter': return 'Загрузите историю, и AI придумает неожиданный поворот'
      case 'spin-off': return 'Дайте AI посты, и он создаст ответвление темы'
      case 'the-end': return 'Придумайте завершение вашей истории'
      default: return 'Вставьте предыдущие посты'
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-[400px] text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#FFA726]/10 flex items-center justify-center mb-4">
        <FaHistory className="text-[#FFA726] text-2xl" />
      </div>
      <h3 className="text-white/40 font-medium text-sm mb-1">Готово к созданию</h3>
      <p className="text-white/15 text-sm max-w-xs">{getMessage()}</p>
    </div>
  )
}

export default PostChronicleService