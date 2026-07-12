import { useState, type JSX } from 'react'
import { FiZap, FiCopy, FiRefreshCw, FiThumbsUp, FiTarget, FiTrendingUp, FiVolume2, FiInfo, FiPenTool, FiArrowLeft } from 'react-icons/fi'
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
  apiType: HeadlineContentEnum
}

type GeneratedContent = {
  title: string
  content: string
  styleNote: string
  advice: string
}

type Mode = 'new' | 'refine'

const SYSTEM_PROMPT = `Ты — профессиональный копирайтер, специалист по созданию цепляющих заголовков и вирусного контента. Твоя задача — создавать заголовки, которые невозможно пропустить.

Правила:
1. Заголовок должен вызывать эмоцию: удивление, интерес, любопытство
2. Используй конкретные цифры и факты
3. Добавляй интригу, но не кликбейт
4. Учитывай выбранный стиль: вирусный, эмоциональный, провокационный или обучающий
5. Делай заголовок понятным и ёмким
6. Адаптируй под формат: пост, хук, CTA или вирусная механика
7. Проверяй, чтобы заголовок работал без контекста
8. Создавай варианты с разными триггерами
9. Каждый заголовок должен давать понятную пользу
10. Пиши так, чтобы хотелось нажать и прочитать`

const ViralHeadlinesService = () => {
  const [prompt, setPrompt] = useState('')
  const userId = useSelector((s: RootState) => s.auth!.user!._id!)
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState('headlines')
  const [style, setStyle] = useState<HeadlineStyleEnum>('VIRAL')
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<Mode>('new')
  const { refreshAll } = useGetData()

  const tabs: Tab[] = [
    { id: 'headlines', label: 'Заголовки', icon: <FiTrendingUp className="text-sm" />, description: 'Цепляющие названия', apiType: 'HEADLINES' },
    { id: 'hooks', label: 'Хуки', icon: <FiZap className="text-sm" />, description: 'Первые строки поста', apiType: 'HOOKS' },
    { id: 'cta', label: 'CTA', icon: <FiTarget className="text-sm" />, description: 'Призывы к действию', apiType: 'CTA' },
    { id: 'viral', label: 'Вирусные', icon: <FiVolume2 className="text-sm" />, description: 'Идеи для охватов', apiType: 'VIRAL' },
  ]

  const styles = [
    { id: 'VIRAL' as HeadlineStyleEnum, label: 'Вирусный', icon: <FiVolume2 className="text-sm" />, desc: 'Шок, интрига, срочность' },
    { id: 'EMOTIONAL' as HeadlineStyleEnum, label: 'Эмоциональный', icon: <FiZap className="text-sm" />, desc: 'Эмпатия, история, чувства' },
    { id: 'PROVOCATIVE' as HeadlineStyleEnum, label: 'Провокационный', icon: <FiTarget className="text-sm" />, desc: 'Спор, вызов, дискуссия' },
    { id: 'EDUCATIONAL' as HeadlineStyleEnum, label: 'Обучающий', icon: <FiPenTool className="text-sm" />, desc: 'Польза, цифры, факты' },
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
      return 'Напишите, что улучшить в заголовке...'
    }
    switch (activeTab) {
      case 'headlines': return 'Тема поста (например: как продвигать Telegram-канал)'
      case 'hooks': return 'Тема поста (например: ошибки новичков в маркетинге)'
      case 'cta': return 'Что нужно сделать читателю (например: подписаться)'
      case 'viral': return 'Тема для вируса (например: сравнение Telegram и WhatsApp)'
      default: return 'Введите тему'
    }
  }

  const getTitleByTab = (tabId: string): string => {
    switch (tabId) {
      case 'headlines': return 'Цепляющий заголовок'
      case 'hooks': return 'Хук для поста'
      case 'cta': return 'Призыв к действию'
      case 'viral': return 'Вирусная идея'
      default: return 'Результат'
    }
  }

  const getAdviceByTab = (tabId: string): string => {
    switch (tabId) {
      case 'headlines': return 'Сильные заголовки строятся на конкретике, интриге и обещании пользы. Тестируйте 2-3 варианта.'
      case 'hooks': return 'Хороший хук удерживает внимание в первые 3 секунды. Используйте личные истории или неожиданные факты.'
      case 'cta': return 'Без CTA даже вирусный пост не приносит результат. Одно конкретное действие работает лучше трёх.'
      case 'viral': return 'Вирусность — это формула: эмоция + простота репоста + актуальность. Спорные темы работают лучше всего.'
      default: return 'Используйте результат как основу и добавляйте свои детали.'
    }
  }

  const getStyleLabel = (styleId: HeadlineStyleEnum): string => {
    const labels: Record<HeadlineStyleEnum, string> = {
      VIRAL: 'Вирусный',
      EMOTIONAL: 'Эмоциональный',
      PROVOCATIVE: 'Провокационный',
      EDUCATIONAL: 'Обучающий'
    }
    return labels[styleId] || 'Вирусный'
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
        ? `Улучши этот заголовок:\n\n${generatedContent.content}`
        : prompt.trim()

      const response = await apiAiService.viralHeadlines({
        topic: userPrompt,
        type: activeTab as HeadlineContentEnum,
        style: style,
        userId,
        prompt: systemPrompt,
      })

      if (response && typeof response === 'string' && response.trim()) {
        setGeneratedContent({
          title: getTitleByTab(activeTab),
          content: response,
          styleNote: `Стиль: ${getStyleLabel(style)}`,
          advice: getAdviceByTab(activeTab)
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
              <label className="text-xs font-medium text-white/40 tracking-wider">Формат</label>
              <div className="grid grid-cols-2 gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); resetAll() }}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                      activeTab === tab.id
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
              <label className="text-xs font-medium text-white/40 tracking-wider block mb-2">Стиль</label>
              <div className="grid grid-cols-2 gap-2">
                {styles.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStyle(s.id)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                      style === s.id
                        ? 'border-[#FFA726] bg-[#FFA726]/10 text-white'
                        : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white/70'
                    }`}
                  >
                    <span className={style === s.id ? 'text-[#FFA726]' : 'text-white/30'}>
                      {s.icon}
                    </span>
                    <div className="flex-1">
                      <span className="text-xs font-medium">{s.label}</span>
                      <p className="text-[10px] text-white/30">{s.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-white/40 tracking-wider">
                  {mode === 'refine' ? 'Инструкция для улучшения' : 'О чём написать'}
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
                className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white placeholder-white/20 resize-none focus:outline-none focus:border-[#FFA726]/50 transition-all"
                disabled={isGenerating}
              />
              <div className="flex justify-end mt-1.5 text-[10px] text-white/20">
                ⌘ + Enter
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
                    setPrompt('Сделай заголовок более цепляющим, добавь интриги и конкретики')
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
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Цепляющие заголовки</h1>
      <p className="text-white/30 text-sm mt-0.5 hidden sm:block">Создайте заголовки, которые невозможно пропустить</p>
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
    <h3 className="text-white/60 font-medium mt-6">Генерация заголовка</h3>
    <p className="text-white/20 text-sm max-w-xs mt-2">Обычно занимает 8–10 секунд</p>
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

    <div className="flex-1 py-4 sm:py-5">
      <div className="bg-gradient-to-r from-[#FFA726]/10 to-[#4CAF50]/10 rounded-xl p-5 sm:p-6 border border-[#FFA726]/20">
        <p className="text-lg sm:text-xl text-white font-medium leading-relaxed">
          {content.content}
        </p>
      </div>
    </div>

    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-4 border-t border-white/10">
      <button
        onClick={onImprove}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFA726]/10 border border-[#FFA726]/20 text-[#FFA726] hover:bg-[#FFA726]/20 transition-all duration-200 cursor-pointer text-sm font-medium"
      >
        <FiThumbsUp className="text-sm" />
        <span>Улучшить</span>
        <span className="text-[10px] opacity-60 hidden sm:inline">(сделает ещё цепляющее)</span>
      </button>
      <div className="flex flex-wrap items-center gap-3 text-xs text-white/30">
        <span>{content.styleNote}</span>
        <span className="w-1 h-1 rounded-full bg-white/20" />
        <span className="text-white/20">{content.advice}</span>
      </div>
    </div>
  </div>
)

const EmptyState = ({ activeTab }: { activeTab: string }) => {
  const getIcon = () => {
    switch (activeTab) {
      case 'headlines': return <FiTrendingUp className="text-[#FFA726] text-2xl" />
      case 'hooks': return <FiZap className="text-[#FFA726] text-2xl" />
      case 'cta': return <FiTarget className="text-[#FFA726] text-2xl" />
      case 'viral': return <FiVolume2 className="text-[#FFA726] text-2xl" />
      default: return <FiTrendingUp className="text-[#FFA726] text-2xl" />
    }
  }

  const getMessage = () => {
    switch (activeTab) {
      case 'headlines': return 'Введите тему, и AI создаст цепляющий заголовок'
      case 'hooks': return 'Введите тему, и AI напишет хук для поста'
      case 'cta': return 'Опишите контекст, и AI предложит призыв к действию'
      case 'viral': return 'Назовите тему, и AI придумает вирусную механику'
      default: return 'Введите тему для генерации'
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-[400px] text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#FFA726]/10 flex items-center justify-center mb-4">
        {getIcon()}
      </div>
      <h3 className="text-white/40 font-medium text-sm mb-1">Готово к генерации</h3>
      <p className="text-white/15 text-sm max-w-xs">{getMessage()}</p>
    </div>
  )
}

export default ViralHeadlinesService
