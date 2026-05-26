import { useState } from 'react'
import { FiSend, FiZap, FiCopy, FiRefreshCw, FiThumbsUp, FiMessageSquare, FiLayers, FiInfo, FiArrowRight, FiClock, FiTarget, FiSmile, FiPenTool } from 'react-icons/fi'

const TelegramContentService = () => {
  const [prompt, setPrompt] = useState('')
  const [generatedContent, setGeneratedContent] = useState<{title: string, content: string, toneNote: string, structureNote: string} | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState('post')
  const [tone, setTone] = useState('friendly')
  const [currentStep, setCurrentStep] = useState(1)

  const tabs = [
    { 
      id: 'post', 
      label: 'Пост', 
      icon: <FiSend className="text-sm" />,
      description: 'Готовый текст для Telegram',
      example: 'Тема → структурированный пост с эмодзи и CTA'
    },
    { 
      id: 'ideas', 
      label: 'Идеи', 
      icon: <FiZap className="text-sm" />,
      description: 'Темы для новых публикаций',
      example: 'Ниша → 5 тем на неделю с рубриками'
    },
    { 
      id: 'poll', 
      label: 'Опрос', 
      icon: <FiMessageSquare className="text-sm" />,
      description: 'Вовлекающий интерактив',
      example: 'Тема → вопросы с вариантами ответов'
    },
    { 
      id: 'series', 
      label: 'Серия', 
      icon: <FiLayers className="text-sm" />,
      description: 'Связанные публикации',
      example: 'Идея → 5 постов от простого к сложному'
    },
  ]

  const tones = [
    { id: 'friendly', label: 'Дружелюбный', icon: <FiSmile className="text-sm" />, desc: 'Привет! Смотри, что я нашёл 🤩' },
    { id: 'expert', label: 'Экспертный', icon: <FiTarget className="text-sm" />, desc: 'Согласно исследованию, 73%...' },
    { id: 'casual', label: 'Повседневный', icon: <FiPenTool className="text-sm" />, desc: 'Короче, ребята, делюсь находкой' },
    { id: 'humor', label: 'С юмором', icon: <FiSmile className="text-sm" />, desc: 'Угадайте, что я натворил сегодня 😅' },
  ]

  const steps = [
    { number: 1, label: 'Тема', icon: <FiPenTool className="text-sm" /> },
    { number: 2, label: 'Генерация', icon: <FiZap className="text-sm" /> },
    { number: 3, label: 'Результат', icon: <FiSend className="text-sm" /> },
  ]

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setIsGenerating(true)
    setCurrentStep(2)
    await new Promise(resolve => setTimeout(resolve, 2000))

    const contentByTab = {
      post: {
        title: '🎯 Как быстро расти в Telegram в 2026',
        content: 'Привет, друзья! Заметил, что многие каналы буквально взрываются за пару месяцев. А другие — топчутся годами. В чем секрет?\n\n🔥 3 правила быстрого роста:\n\n1️⃣ Качество важнее количества\nОдин сильный пост в день > 5 посредственных. Алгоритмы Telegram это чувствуют.\n\n2️⃣ Вовлечение — новая валюта\nРеакции и комментарии сейчас важнее просмотров. Задавайте вопросы в каждом посте.\n\n3️⃣ Коллаборации рулят\nОдна взаимная рекомендация даёт больше, чем месяц рекламы.\n\n💡 Совет дня: начните с серии из 3 постов на одну тему. Это создаёт привычку у подписчиков.\n\nА какие стратегии используете вы? Делитесь в комментариях 👇',
        toneNote: 'Тон: дружелюбный. Приветствие, эмодзи, обращение к читателю, открытый вопрос.',
        structureNote: 'Структура: приветствие → интрига → правила с пояснениями → совет → вопрос.'
      },
      ideas: {
        title: '💡 5 идей для постов на эту неделю',
        content: '1. «Мой главный провал в Telegram и чему он меня научил»\nПочему сработает: люди любят честные истории о неудачах.\n\n2. «Разбор канала-конкурента: что они делают круто»\nПочему сработает: полезный анализ + элемент интриги.\n\n3. «3 инструмента, которые экономят мне 5 часов в неделю»\nПочему сработает: практическая ценность, которую можно применить сразу.\n\n4. «Опрос: какой контент вам заходит больше?»\nПочему сработает: вовлекает аудиторию и даёт обратную связь.\n\n5. «Прогноз: что изменится в Telegram к концу года»\nПочему сработает: экспертный контент, который хочется сохранить.',
        toneNote: 'Тон: экспертный с элементами дружелюбия. Конкретика, обоснования, практическая польза.',
        structureNote: 'Структура: список идей → обоснование каждой → готовый план на неделю.'
      },
      poll: {
        title: '📊 Какой контент вам интереснее?',
        content: 'Вопрос: какой формат постов вы читаете чаще всего?\n\n1️⃣ Практические гайды и инструкции\n2️⃣ Личные истории и опыт\n3️⃣ Новости и тренды индустрии\n4️⃣ Разборы ошибок и кейсы\n\nГолосуйте цифрой в комментариях! Самый популярный формат буду делать чаще.\n\nP.S. Если ваш вариант не вошёл в список — пишите свой. Интересно узнать, что вам заходит 👇',
        toneNote: 'Тон: вовлекающий. Вопрос, варианты с эмодзи, призыв к действию, открытость к обратной связи.',
        structureNote: 'Структура: вопрос → варианты → призыв → дополнительное вовлечение.'
      },
      series: {
        title: '📖 Серия: Telegram-канал с нуля (Часть 1/5)',
        content: 'Часть 1: Выбор ниши и позиционирование\n\nТри вопроса перед стартом:\n1. Кто ваша аудитория? (возраст, интересы, боли)\n2. Какую проблему решает ваш канал?\n3. Чем вы отличаетесь от конкурентов?\n\nЗадание: запишите ответы в одном абзаце. Это станет описанием вашего канала.\n\nВ следующей части: настройка канала и подготовка первого контента 🔜',
        toneNote: 'Тон: наставнический. Чёткие вопросы, домашнее задание, анонс продолжения.',
        structureNote: 'Структура: тема серии → ключевые вопросы → задание → анонс следующей части.'
      }
    }

    setGeneratedContent(contentByTab[activeTab as keyof typeof contentByTab] || contentByTab.post)
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
            Популярно
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-[-0.02em] mb-2">
            Telegram контент
          </h1>
          <p className="text-white/40 text-sm sm:text-base max-w-2xl">
            14.1k генераций — AI-инструмент для создания постов, идей и контента для Telegram-каналов
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
                    {activeTab === 'post' && 'Введите тему, и AI создаст готовый пост для Telegram. С правильной структурой, эмодзи, призывом к действию и вовлекающими элементами. Просто скопируйте и опубликуйте.'}
                    {activeTab === 'ideas' && 'Укажите нишу или направление, и AI предложит идеи для публикаций. Каждая идея с обоснованием — почему это сработает. Экономит часы мозгового штурма.'}
                    {activeTab === 'poll' && 'Назовите тему, и AI создаст опрос с продуманными вариантами ответов. Вовлекающий контент, который повышает активность и даёт обратную связь.'}
                    {activeTab === 'series' && 'Задайте тему серии, и AI разработает структуру из связанных постов. С прогрессией, домашними заданиями и удержанием внимания.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Tone selector */}
            <div>
              <label className="block text-sm font-medium text-white/60 mb-3 tracking-[0.05em] uppercase">
                Тон общения
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {tones.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTone(t.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-150 cursor-pointer ${
                      tone === t.id
                        ? 'bg-[#4CAF50]/20 border border-[#4CAF50]/30'
                        : 'bg-white/5 border border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      tone === t.id ? 'bg-[#4CAF50]/30' : 'bg-white/5'
                    }`}>
                      <span className={tone === t.id ? 'text-[#4CAF50]' : 'text-white/40'}>
                        {t.icon}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${
                        tone === t.id ? 'text-white' : 'text-white/60'
                      }`}>
                        {t.label}
                      </p>
                      <p className="text-xs text-white/30 truncate">{t.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Topic input */}
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2 tracking-[0.05em] uppercase">
                О чём писать
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={
                  activeTab === 'post' ? 'Например: как продвигать Telegram-канал бесплатно' :
                  activeTab === 'ideas' ? 'Например: канал про маркетинг и AI' :
                  activeTab === 'poll' ? 'Например: отношение аудитории к рекламе в каналах' :
                  'Например: серия про запуск канала с нуля'
                }
                className="w-full h-36 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 resize-none focus:outline-none focus:border-[#4CAF50] focus:shadow-[0_0_12px_rgba(76,175,80,0.15)] transition-all duration-150"
              />
            </div>

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="w-full bg-gradient-to-r from-[#1E3A1E] to-[#4CAF50] text-white rounded-xl px-6 py-4 font-medium hover:translate-y-[-2px] hover:shadow-[0_0_16px_rgba(76,175,80,0.4)] transition-all duration-150 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <span className="flex gap-1.5">
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                  <span className="text-sm">Выращиваем контент...</span>
                </>
              ) : (
                <>
                  <FiZap className="text-lg group-hover:scale-110 transition-transform" />
                  <span>Сгенерировать</span>
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
                  {/* Tone note */}
                  <div className="bg-[#4CAF50]/5 border border-[#4CAF50]/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FiSmile className="text-[#4CAF50] text-sm" />
                      <h4 className="text-xs font-semibold text-[#4CAF50] uppercase tracking-[0.05em]">
                        Тон
                      </h4>
                    </div>
                    <p className="text-white/50 text-xs leading-relaxed">
                      {generatedContent.toneNote}
                    </p>
                  </div>

                  {/* Structure note */}
                  <div className="bg-[#FFA726]/5 border border-[#FFA726]/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FiPenTool className="text-[#FFA726] text-sm" />
                      <h4 className="text-xs font-semibold text-[#FFA726] uppercase tracking-[0.05em]">
                        Структура
                      </h4>
                    </div>
                    <p className="text-white/50 text-xs leading-relaxed">
                      {generatedContent.structureNote}
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
                        {activeTab === 'post' && 'Не публикуйте AI-пост как есть. Добавьте личный опыт, пример из практики или наблюдение. Это превращает шаблонный текст в уникальный контент.'}
                        {activeTab === 'ideas' && 'Берите идею и адаптируйте под свой стиль. Одна хорошая тема может стать серией постов, опросом и рилсом. Растягивайте контент.'}
                        {activeTab === 'poll' && 'После опроса обязательно опубликуйте результаты и свои выводы. Это закрывает цикл вовлечения и мотивирует участвовать снова.'}
                        {activeTab === 'series' && 'Публикуйте серию с интервалом в 1-2 дня. Напоминайте о предыдущей части и анонсируйте следующую. Это создаёт привычку возвращаться.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feedback */}
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
            ) : (
              /* Empty state */
              <div className="bg-white/5 border border-white/10 rounded-xl p-8 sm:p-12 backdrop-blur-sm flex flex-col items-center justify-center text-center min-h-[500px]">
                <div className="w-16 h-16 rounded-2xl bg-[#4CAF50]/10 flex items-center justify-center mb-5">
                  {activeTab === 'post' && <FiSend className="text-[#4CAF50] text-2xl" />}
                  {activeTab === 'ideas' && <FiZap className="text-[#4CAF50] text-2xl" />}
                  {activeTab === 'poll' && <FiMessageSquare className="text-[#4CAF50] text-2xl" />}
                  {activeTab === 'series' && <FiLayers className="text-[#4CAF50] text-2xl" />}
                </div>
                <h3 className="text-white/80 font-semibold mb-2">
                  Готово к генерации
                </h3>
                <p className="text-white/30 text-sm max-w-sm mb-6">
                  {activeTab === 'post' && 'Введите тему, и AI создаст готовый пост для Telegram. С эмодзи, структурой и призывом к действию.'}
                  {activeTab === 'ideas' && 'Укажите нишу, и AI предложит идеи для публикаций с обоснованием. Экономия часов на мозговом штурме.'}
                  {activeTab === 'poll' && 'Назовите тему, и AI создаст опрос для вовлечения аудитории. С продуманными вариантами ответов.'}
                  {activeTab === 'series' && 'Задайте тему, и AI разработает серию связанных постов. С прогрессией и удержанием внимания.'}
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

export default TelegramContentService