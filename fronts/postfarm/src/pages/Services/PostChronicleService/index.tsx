import { useState } from 'react'
import { FiZap, FiCopy, FiRefreshCw, FiThumbsUp, FiInfo, FiArrowRight, FiClock, FiSend, FiPlus, FiFileText, FiPenTool, FiCheckCircle } from 'react-icons/fi'
import { FaHistory } from 'react-icons/fa'

const PostChronicleService = () => {
  const [historyPosts, setHistoryPosts] = useState('')
  const [generatedContent, setGeneratedContent] = useState<{title: string, content: string, styleAnalysis: string, continuityNote: string} | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState('continue')
  const [currentStep, setCurrentStep] = useState(1)

  const tabs = [
    { 
      id: 'continue', 
      label: 'Продолжение', 
      icon: <FiArrowRight className="text-sm" />,
      description: 'Логичное продолжение истории',
      example: 'Часть 3 → Часть 4 в том же стиле'
    },
    { 
      id: 'new-chapter', 
      label: 'Новая глава', 
      icon: <FiPlus className="text-sm" />,
      description: 'Новый поворот сюжета',
      example: 'Текущая линия → неожиданный поворот'
    },
    { 
      id: 'spin-off', 
      label: 'Спин-офф', 
      icon: <FiFileText className="text-sm" />,
      description: 'Ответвление от темы',
      example: 'Основная тема → смежная история'
    },
  ]

  const steps = [
    { number: 1, label: 'История', icon: <FaHistory className="text-sm" /> },
    { number: 2, label: 'Анализ', icon: <FiZap className="text-sm" /> },
    { number: 3, label: 'Результат', icon: <FiSend className="text-sm" /> },
  ]

  const handleGenerate = async () => {
    if (!historyPosts.trim()) return
    setIsGenerating(true)
    setCurrentStep(2)
    await new Promise(resolve => setTimeout(resolve, 3000))

    const contentByTab = {
      'continue': {
        title: '📖 Что было дальше: продолжение истории',
        content: 'И вот, когда казалось, что всё идёт по плану, случилось неожиданное. Алгоритмы Telegram снова изменились, и мой канал, который только начал набирать обороты, опять просел по охватам.\n\nНо я уже знал правило: не паниковать, а адаптироваться. Вспомнил совет из прошлого поста и решил действовать иначе.\n\nНа этот раз я не стал увеличивать количество публикаций. Вместо этого сделал ставку на качество и коллаборации.\n\nРезультат удивил даже меня. За первую неделю после изменений канал не только восстановил охваты, но и вырос на 15%. А всё потому, что я наконец понял главный принцип Telegram.\n\nВ следующем посте расскажу, какие именно коллаборации сработали и как найти партнёров, которые приносят реальных подписчиков. Остаёмся на связи 🔥',
        styleAnalysis: 'Стиль: дружелюбный, с элементами сторителлинга. Сохранены обращения к читателю, эмодзи и интрига.',
        continuityNote: 'Связь с предыдущими постами: прямое упоминание прошлого совета, развитие темы продвижения, логический мост к следующей части.'
      },
      'new-chapter': {
        title: '🔄 Неожиданный поворот: всё пошло не по плану',
        content: 'Помните, я рассказывал про идеальную стратегию продвижения? Забудьте.\n\nВсё изменилось в один день. Telegram ввёл новое правило, и все мои расчёты полетели в тартарары. Пришлось начинать с нуля.\n\nПервые 48 часов я был в панике. Старые методы не работали, новые было страшно пробовать. Но именно это заставило меня найти способ, который оказался в 3 раза эффективнее.\n\nСегодня расскажу о трёх неочевидных шагах, которые я предпринял, когда всё рухнуло. И о том, почему кризис — лучшее время для роста.\n\nСпойлер: иногда нужно всё сломать, чтобы построить что-то настоящее. Делитесь в комментариях — у вас бывало такое? 👇',
        styleAnalysis: 'Стиль: драматический сторителлинг с элементами уязвимости. Сохранена структура: завязка → конфликт → обещание решения.',
        continuityNote: 'Связь: отсылка к предыдущей стратегии, создание контраста между "тогда" и "сейчас", развитие персонажа автора.'
      },
      'spin-off': {
        title: '🔀 Ответвление: а что если применить это в другой нише?',
        content: 'Пока я экспериментировал с Telegram-каналом, мой друг решил проверить те же принципы на YouTube.\n\nИ знаете что? Они сработали ещё лучше.\n\nЕго канал вырос с 500 до 5000 подписчиков за месяц. Мы сравнили заметки и нашли закономерности, которые работают везде: в Telegram, YouTube, даже в LinkedIn.\n\nВ этом посте я разберу универсальные принципы роста, которые не зависят от платформы. И покажу, как адаптировать вашу текущую стратегию под любую соцсеть.\n\nСпойлер: дело не в алгоритмах. Дело в психологии аудитории. Сохраняйте пост — пригодится при масштабировании 📌',
        styleAnalysis: 'Стиль: экспертный с элементами социального доказательства. Сохранены цифры, конкретика и практическая ценность.',
        continuityNote: 'Связь: расширение темы с Telegram на другие платформы, использование личного опыта как доказательной базы, усиление экспертности.'
      }
    }

    setGeneratedContent(contentByTab[activeTab as keyof typeof contentByTab] || contentByTab['continue'])
    setIsGenerating(false)
    setCurrentStep(3)
  }

  const handleCopy = () => {
    if (!generatedContent) return
    navigator.clipboard.writeText(`${generatedContent.title}\n\n${generatedContent.content}`)
  }

  const handleRegenerate = () => {
    setGeneratedContent(null)
    setCurrentStep(1)
    handleGenerate()
  }

  return (
    <div className="min-h-screen bg-[#1E3A1E] text-white font-['Inter']">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
        
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <span className="inline-block px-3 py-1 bg-[#FFA726]/20 text-[#FFA726] text-xs font-medium rounded-full uppercase tracking-[0.05em] mb-3">
            Новое
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-[-0.02em] mb-2">
            Хроника постов
          </h1>
          <p className="text-white/40 text-sm sm:text-base max-w-2xl">
            3.2k генераций — Загрузите свои прошлые посты, и AI напишет продолжение в вашем стиле
          </p>
        </div>

        {/* Steps indicator */}
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

        {/* Tabs with descriptions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 sm:mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id)
                setGeneratedContent(null)
                setCurrentStep(1)
              }}
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

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          
          {/* Left column - Input */}
          <div className="lg:col-span-2 space-y-5">
            
            {/* How it works info */}
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
                    {activeTab === 'continue' && 'Скопируйте 2-5 своих предыдущих постов. AI проанализирует стиль, тон и логику повествования, затем создаст естественное продолжение.'}
                    {activeTab === 'new-chapter' && 'Загрузите историю постов, и AI придумает неожиданный поворот. Сохранит ваш стиль, но добавит новый конфликт или развитие темы.'}
                    {activeTab === 'spin-off' && 'AI возьмёт тему из ваших постов и создаст ответвление — смежную историю, которая расширит контент и привлечёт новую аудиторию.'}
                  </p>
                </div>
              </div>
            </div>

            {/* History input */}
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2 tracking-[0.05em] uppercase">
                Ваши предыдущие посты
              </label>
              <textarea
                value={historyPosts}
                onChange={(e) => setHistoryPosts(e.target.value)}
                placeholder="Скопируйте сюда 2-5 ваших последних постов...&#10;&#10;Пост 1:&#10;Привет, друзья! Сегодня расскажу о...&#10;&#10;Пост 2:&#10;Продолжаю тему. В прошлый раз мы...&#10;&#10;Пост 3:&#10;Получил много вопросов после..."
                className="w-full h-64 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 resize-none focus:outline-none focus:border-[#FFA726] focus:shadow-[0_0_12px_rgba(255,167,38,0.15)] transition-all duration-150"
              />
              <div className="flex items-center gap-2 mt-2 text-white/20 text-xs">
                <FiInfo className="text-sm" />
                <span>Минимум 2 поста для анализа. Чем больше примеров — тем точнее стиль.</span>
              </div>
            </div>

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={!historyPosts.trim() || isGenerating}
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
          </div>

          {/* Right column - Result */}
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
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 border border-white/10 transition-all duration-150"
                  >
                    <FiCopy className="text-sm" />
                    <span className="hidden sm:inline">Копировать</span>
                  </button>
                  <button
                    onClick={handleRegenerate}
                    disabled={isGenerating}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 border border-white/10 transition-all duration-150"
                  >
                    <FiRefreshCw className={`text-sm ${isGenerating ? 'animate-spin' : ''}`} />
                    <span className="hidden sm:inline">Перегенерировать</span>
                  </button>
                </div>
              )}
            </div>

            {generatedContent ? (
              <div className="space-y-4">
                {/* Main post card */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-5 sm:p-6 backdrop-blur-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#FFA726]/20 flex items-center justify-center flex-shrink-0">
                      <FiSend className="text-[#FFA726] text-lg" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-white mb-3 leading-relaxed">
                        {generatedContent.title}
                      </h3>
                      <div className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
                        {generatedContent.content}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Analysis cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Style analysis */}
                  <div className="bg-[#FFA726]/5 border border-[#FFA726]/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FiPenTool className="text-[#FFA726] text-sm" />
                      <h4 className="text-xs font-semibold text-[#FFA726] uppercase tracking-[0.05em]">
                        Анализ стиля
                      </h4>
                    </div>
                    <p className="text-white/50 text-xs leading-relaxed">
                      {generatedContent.styleAnalysis}
                    </p>
                  </div>

                  {/* Continuity note */}
                  <div className="bg-[#4CAF50]/5 border border-[#4CAF50]/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FiCheckCircle className="text-[#4CAF50] text-sm" />
                      <h4 className="text-xs font-semibold text-[#4CAF50] uppercase tracking-[0.05em]">
                        Связность
                      </h4>
                    </div>
                    <p className="text-white/50 text-xs leading-relaxed">
                      {generatedContent.continuityNote}
                    </p>
                  </div>
                </div>

                {/* Bottom insight */}
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
                        {activeTab === 'continue' && 'Не публикуйте AI-продолжение как есть. Добавьте актуальные детали из вашей ниши и личный комментарий. AI сохраняет стиль, но только вы знаете, что происходит прямо сейчас.'}
                        {activeTab === 'new-chapter' && 'Новый поворот должен удивлять, но не отрываться от реальности. Используйте этот пост как основу и добавьте конкретные примеры из своего опыта.'}
                        {activeTab === 'spin-off' && 'Спин-офф — отличный способ протестировать новую тему. Если аудитория отреагирует хорошо — развивайте направление дальше.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feedback */}
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
            ) : (
              /* Empty state */
              <div className="bg-white/5 border border-white/10 rounded-xl p-8 sm:p-12 backdrop-blur-sm flex flex-col items-center justify-center text-center min-h-[500px]">
                <div className="w-16 h-16 rounded-2xl bg-[#FFA726]/10 flex items-center justify-center mb-5">
                  <FaHistory className="text-[#FFA726] text-2xl" />
                </div>
                <h3 className="text-white/80 font-semibold mb-2">
                  Готово к созданию
                </h3>
                <p className="text-white/30 text-sm max-w-sm mb-6">
                  {activeTab === 'continue' && 'Вставьте 2-5 своих прошлых постов, и AI напишет логичное продолжение. Сохранит ваш стиль и тон.'}
                  {activeTab === 'new-chapter' && 'Загрузите историю постов, и AI придумает неожиданный поворот. Новый конфликт или развитие темы.'}
                  {activeTab === 'spin-off' && 'Дайте AI вашу серию постов, и он создаст ответвление — смежную историю для расширения контента.'}
                </p>
                <div className="flex items-center gap-4 text-white/15 text-xs">
                  <div className="flex items-center gap-1.5">
                    <FiClock className="text-sm" />
                    <span>~15 секунд</span>
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
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostChronicleService