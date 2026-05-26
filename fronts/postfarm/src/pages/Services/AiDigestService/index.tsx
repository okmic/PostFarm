import { useState } from 'react'
import { FiZap, FiCopy, FiRefreshCw, FiThumbsUp, FiLink, FiFileText, FiLayers, FiCheckCircle, FiInfo, FiStar, FiGlobe, FiArrowRight, FiSearch, FiClock, FiSend, FiTarget } from 'react-icons/fi'

const AiDigestService = () => {
  const [sourceUrl, setSourceUrl] = useState('')
  const [sourceText, setSourceText] = useState('')
  const [generatedContent, setGeneratedContent] = useState<{title: string, content: string, contextNote: string, valueNote: string} | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState('news')
  const [inputMode, setInputMode] = useState<'url' | 'text'>('url')
  const [currentStep, setCurrentStep] = useState(1)

  const tabs = [
    { 
      id: 'news', 
      label: 'Новости', 
      icon: <FiGlobe className="text-sm" />,
      description: 'Превращаю новость в готовый пост',
      example: 'Ссылка на новость → пост для Telegram'
    },
    { 
      id: 'summary', 
      label: 'Краткий пересказ', 
      icon: <FiFileText className="text-sm" />,
      description: 'Сжимаю статью до главного',
      example: 'Длинная статья → 3 ключевых абзаца'
    },
    { 
      id: 'review', 
      label: 'Обзор', 
      icon: <FiLayers className="text-sm" />,
      description: 'Делаю глубокий разбор темы',
      example: 'Новая технология → анализ и перспективы'
    },
    { 
      id: 'conclusions', 
      label: 'Выводы', 
      icon: <FiCheckCircle className="text-sm" />,
      description: 'Извлекаю главные инсайты',
      example: 'Отчёт на 50 страниц → 3 совета'
    },
  ]

  const steps = [
    { number: 1, label: 'Источник', icon: <FiLink className="text-sm" /> },
    { number: 2, label: 'Генерация', icon: <FiZap className="text-sm" /> },
    { number: 3, label: 'Результат', icon: <FiSend className="text-sm" /> },
  ]

  const handleGenerate = async () => {
    const hasContent = inputMode === 'url' ? sourceUrl.trim() : sourceText.trim()
    if (!hasContent) return
    setIsGenerating(true)
    setCurrentStep(2)
    await new Promise(resolve => setTimeout(resolve, 2500))

    const contentByTab = {
      news: {
        title: '📰 Telegram запустил монетизацию для всех каналов от 500 подписчиков',
        content: 'С сегодняшнего дня Telegram открывает программу монетизации для каналов от 500 подписчиков. Доход от рекламы будет делиться 50/50.\n\nВладельцы каналов смогут выводить средства через Fragment — криптокошелёк экосистемы TON. Раньше порог был 1000 подписчиков, теперь планка снижена вдвое.\n\nЭто важный шаг для платформы. Небольшие каналы и нишевые эксперты теперь тоже могут зарабатывать. А учитывая, что Telegram уже обгоняет WhatsApp по времени использования (44 минуты против 38), это открывает окно возможностей.\n\nВывод: если вы думали о запуске канала — сейчас лучшее время. Пока конкуренция не выросла, а платформа активно привлекает авторов.',
        contextNote: 'Добавлен контекст: сравнение с прошлым порогом, связь с ростом платформы, практический вывод для читателя.',
        valueNote: 'Ценность для читателя: конкретный сигнал к действию + временной ориентир для принятия решения.'
      },
      summary: {
        title: '📝 Главное за минуту: что происходит с Telegram',
        content: 'Три ключевых события этой недели:\n\n1. Монетизация для каналов от 500 подписчиков — доход от рекламы делится 50/50. Вывод через Fragment.\n\n2. Telegram тестирует AI-ассистента для Premium: суммаризация чатов, перевод голосовых в текст, генерация ответов.\n\n3. По данным DataReportal, Telegram обогнал WhatsApp по времени использования — 44 минуты в день против 38. Рост за год — 27%.\n\nИтог: платформа активно развивается в сторону супер-приложения. Монетизация, AI, растущая аудитория. Для авторов контента это означает больше инструментов и больше возможностей для заработка.',
        contextNote: 'Сжат большой объём информации в 3 ключевых пункта. Сохранена логическая связь между событиями.',
        valueNote: 'Ценность: экономия времени читателя + объединение разрозненных новостей в единую картину.'
      },
      review: {
        title: '🔍 Telegram становится супер-приложением: полный разбор',
        content: 'Три новости этой недели складываются в одну картину: Telegram движется к модели WeChat.\n\nМонетизация с 500 подписчиков — это ставка на микросообщества. Платформа понимает: будущее за нишевыми экспертами, а не за гигантами.\n\nAI-ассистент — не просто фича. Это системная интеграция, которая повышает ценность Premium и удерживает пользователей в экосистеме.\n\nРост времени использования на 27% подтверждает: стратегия работает. Люди не просто сидят в мессенджере — они потребляют контент, общаются в каналах, используют Mini Apps.\n\nГлавное преимущество Telegram перед конкурентами — отсутствие алгоритмической ленты. Авторы сохраняют прямой доступ к подписчикам. А теперь ещё и получают инструменты для монетизации.\n\nПрогноз: в ближайшие 6 месяцев мы увидим взрывной рост авторских каналов и новую волну создателей контента.',
        contextNote: 'Глубокий анализ: связи между событиями, стратегический контекст, прогноз развития.',
        valueNote: 'Ценность: экспертный взгляд + прогноз, который помогает читателю принять стратегическое решение.'
      },
      conclusions: {
        title: '✅ 3 главных вывода про Telegram в 2026',
        content: 'Проанализировал последние новости и отчёты. Вот что действительно важно:\n\n1. Порог входа снизился. Монетизация с 500 подписчиков означает, что Telegram делает ставку на малые сообщества. Окно возможностей — 3-6 месяцев, пока конкуренция не выросла.\n\n2. AI становится инфраструктурой. Встроенный AI в Telegram — не хайп, а новое базовое ожидание. Авторы, освоившие AI-инструменты сейчас, получат фору в 2-3 месяца.\n\n3. Telegram — это актив. Каналы, Stories, платежи, Mini Apps, AI, монетизация. Это не мессенджер, а экосистема. Ваш канал сегодня — бизнес-актив завтра.\n\nПрактический совет: начните с малого. Создайте канал, опубликуйте 10 постов через AI, подключите монетизацию. Через месяц оцените результаты.',
        contextNote: 'Выделены только практические выводы. Убрана вода, оставлена суть и конкретные действия.',
        valueNote: 'Ценность: готовый план действий + временные ориентиры + измеримый результат.'
      }
    }

    setGeneratedContent(contentByTab[activeTab as keyof typeof contentByTab] || contentByTab.news)
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
          <span className="inline-block px-3 py-1 bg-[#4CAF50]/20 text-[#4CAF50] text-xs font-medium rounded-full uppercase tracking-[0.05em] mb-3">
            AI Новости
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-[-0.02em] mb-2">
            AI-дайджесты
          </h1>
          <p className="text-white/40 text-sm sm:text-base max-w-2xl">
            8.7k генераций — Превращайте ссылки и статьи в готовые Telegram-посты за 10 секунд
          </p>
        </div>

        {/* Steps indicator */}
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

        {/* Tabs with descriptions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6 sm:mb-8">
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

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          
          {/* Left column - Input */}
          <div className="lg:col-span-2 space-y-5">
            
            {/* How it works info */}
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
                    {activeTab === 'news' && 'Вставьте ссылку на новость или её текст. AI перепишет её как пост для Telegram: добавит структуру, контекст и практический вывод для читателя.'}
                    {activeTab === 'summary' && 'Загрузите длинную статью. AI выделит ключевые факты и упакует их в формат «прочитай за минуту». Идеально для занятой аудитории.'}
                    {activeTab === 'review' && 'Дайте AI тему или источник. Он проведёт глубокий анализ: связи, причины, перспективы. Формат для экспертного канала.'}
                    {activeTab === 'conclusions' && 'Загрузите информацию. AI извлечёт только практические выводы и actionable-советы. Максимум ценности без воды.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Input area */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-white/60 tracking-[0.05em] uppercase">
                  {inputMode === 'url' ? 'Вставьте ссылку' : 'Вставьте текст'}
                </label>
                <div className="flex gap-1 p-0.5 bg-white/5 rounded-lg border border-white/10">
                  <button
                    onClick={() => setInputMode('url')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 ${
                      inputMode === 'url'
                        ? 'bg-[#4CAF50] text-white shadow-[0_0_8px_rgba(76,175,80,0.2)]'
                        : 'text-white/40 hover:text-white'
                    }`}
                  >
                    <FiLink className="text-sm" />
                    Ссылка
                  </button>
                  <button
                    onClick={() => setInputMode('text')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 ${
                      inputMode === 'text'
                        ? 'bg-[#4CAF50] text-white shadow-[0_0_8px_rgba(76,175,80,0.2)]'
                        : 'text-white/40 hover:text-white'
                    }`}
                  >
                    <FiFileText className="text-sm" />
                    Текст
                  </button>
                </div>
              </div>

              {inputMode === 'url' ? (
                <div className="relative">
                  <FiLink className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 text-sm" />
                  <input
                    type="url"
                    value={sourceUrl}
                    onChange={(e) => setSourceUrl(e.target.value)}
                    placeholder="https://example.com/article..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-10 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-[#4CAF50] focus:shadow-[0_0_12px_rgba(76,175,80,0.15)] transition-all duration-150"
                  />
                </div>
              ) : (
                <div>
                  <textarea
                    value={sourceText}
                    onChange={(e) => setSourceText(e.target.value)}
                    placeholder="Вставьте текст статьи или новости...&#10;&#10;AI прочитает и превратит в готовый пост для Telegram."
                    className="w-full h-44 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 resize-none focus:outline-none focus:border-[#4CAF50] focus:shadow-[0_0_12px_rgba(76,175,80,0.15)] transition-all duration-150"
                  />
                  <div className="flex items-center gap-2 mt-2 text-white/20 text-xs">
                    <FiInfo className="text-sm" />
                    <span>Минимум 100 символов для качественной генерации</span>
                  </div>
                </div>
              )}
            </div>

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || (inputMode === 'url' ? !sourceUrl.trim() : !sourceText.trim())}
              className="w-full bg-gradient-to-r from-[#1E3A1E] to-[#4CAF50] text-white rounded-xl px-6 py-4 font-medium hover:translate-y-[-2px] hover:shadow-[0_0_16px_rgba(76,175,80,0.4)] transition-all duration-150 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2 group"
            >
              {isGenerating ? (
                <>
                  <span className="flex gap-1.5">
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                  <span className="text-sm">AI обрабатывает информацию...</span>
                </>
              ) : (
                <>
                  <FiZap className="text-lg group-hover:scale-110 transition-transform" />
                  <span>Сгенерировать дайджест</span>
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
                    <div className="w-10 h-10 rounded-xl bg-[#4CAF50]/20 flex items-center justify-center flex-shrink-0">
                      <FiSend className="text-[#4CAF50] text-lg" />
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
                  {/* Context note */}
                  <div className="bg-[#4CAF50]/5 border border-[#4CAF50]/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FiTarget className="text-[#4CAF50] text-sm" />
                      <h4 className="text-xs font-semibold text-[#4CAF50] uppercase tracking-[0.05em]">
                        Контекст
                      </h4>
                    </div>
                    <p className="text-white/50 text-xs leading-relaxed">
                      {generatedContent.contextNote}
                    </p>
                  </div>

                  {/* Value note */}
                  <div className="bg-[#FFA726]/5 border border-[#FFA726]/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FiStar className="text-[#FFA726] text-sm" />
                      <h4 className="text-xs font-semibold text-[#FFA726] uppercase tracking-[0.05em]">
                        Ценность
                      </h4>
                    </div>
                    <p className="text-white/50 text-xs leading-relaxed">
                      {generatedContent.valueNote}
                    </p>
                  </div>
                </div>

                {/* Bottom insight */}
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
                        {activeTab === 'news' && 'Не публикуйте новость как есть. Добавьте личное мнение или прогноз — это выделит ваш канал среди сотен новостных. Один авторский абзац повышает доверие в 3 раза.'}
                        {activeTab === 'summary' && 'Краткий пересказ хорошо работает утром. Аудитория ценит экономию времени. Добавьте ссылку на полную версию для тех, кто хочет углубиться.'}
                        {activeTab === 'review' && 'Обзоры — это контент на выходные. У людей больше времени на вдумчивое чтение. Сохраните пост в закрепе — к нему будут возвращаться.'}
                        {activeTab === 'conclusions' && 'Выводы отлично работают как лид-магнит. Пообещайте практические инсайты в следующем посте и соберите реакции для алгоритмов.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feedback */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-white/40">Оценить:</span>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/60 hover:text-[#4CAF50] hover:bg-[#4CAF50]/10 transition-all duration-150">
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
                <div className="w-16 h-16 rounded-2xl bg-[#4CAF50]/10 flex items-center justify-center mb-5">
                  {activeTab === 'news' && <FiGlobe className="text-[#4CAF50] text-2xl" />}
                  {activeTab === 'summary' && <FiFileText className="text-[#4CAF50] text-2xl" />}
                  {activeTab === 'review' && <FiLayers className="text-[#4CAF50] text-2xl" />}
                  {activeTab === 'conclusions' && <FiCheckCircle className="text-[#4CAF50] text-2xl" />}
                </div>
                <h3 className="text-white/80 font-semibold mb-2">
                  Готово к генерации
                </h3>
                <p className="text-white/30 text-sm max-w-sm mb-6">
                  {activeTab === 'news' && 'Вставьте ссылку на новость и получите готовый пост. AI добавит контекст и практический вывод.'}
                  {activeTab === 'summary' && 'Загрузите статью и получите краткий пересказ. Экономия времени для вас и вашей аудитории.'}
                  {activeTab === 'review' && 'Дайте тему и получите глубокий обзор. Экспертный контент для вашего канала.'}
                  {activeTab === 'conclusions' && 'Загрузите информацию и получите практические выводы. Максимум ценности в одном посте.'}
                </p>
                <div className="flex items-center gap-4 text-white/15 text-xs">
                  <div className="flex items-center gap-1.5">
                    <FiClock className="text-sm" />
                    <span>~10 секунд</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FiSearch className="text-sm" />
                    <span>AI-анализ</span>
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

export default AiDigestService