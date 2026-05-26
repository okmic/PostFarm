import { useState } from 'react'
import { FiZap, FiCopy, FiRefreshCw, FiThumbsUp, FiTarget, FiTrendingUp, FiVolume2, FiInfo, FiStar, FiArrowRight, FiClock, FiSend, FiPenTool } from 'react-icons/fi'

const ViralHeadlinesService = () => {
  const [topic, setTopic] = useState('')
  const [generatedContent, setGeneratedContent] = useState<Array<{title: string, description: string, tip: string}>>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState('headlines')
  const [style, setStyle] = useState('viral')
  const [currentStep, setCurrentStep] = useState(1)

  const tabs = [
    { 
      id: 'headlines', 
      label: 'Заголовки', 
      icon: <FiTrendingUp className="text-sm" />,
      description: 'Названия, которые заставляют нажать',
      example: 'Тема → 3 варианта с разной механикой'
    },
    { 
      id: 'hooks', 
      label: 'Hooks', 
      icon: <FiZap className="text-sm" />,
      description: 'Первые цепляющие строки поста',
      example: 'Ниша → 3 хука с разными эмоциями'
    },
    { 
      id: 'cta', 
      label: 'CTA', 
      icon: <FiTarget className="text-sm" />,
      description: 'Призывы к действию с конверсией',
      example: 'Тип поста → 3 CTA с разной целью'
    },
    { 
      id: 'viral', 
      label: 'Вирусные', 
      icon: <FiVolume2 className="text-sm" />,
      description: 'Идеи под максимальные охваты',
      example: 'Тема → 3 вирусные механики'
    },
  ]

  const styles = [
    { id: 'viral', label: 'Вирусный', icon: <FiVolume2 className="text-sm" />, desc: 'Шок, интрига, срочность' },
    { id: 'emotional', label: 'Эмоциональный', icon: <FiZap className="text-sm" />, desc: 'Эмпатия, история, чувства' },
    { id: 'provocative', label: 'Провокационный', icon: <FiTarget className="text-sm" />, desc: 'Спор, вызов, дискуссия' },
    { id: 'educational', label: 'Обучающий', icon: <FiPenTool className="text-sm" />, desc: 'Польза, цифры, факты' },
  ]

  const steps = [
    { number: 1, label: 'Тема', icon: <FiPenTool className="text-sm" /> },
    { number: 2, label: 'Стиль', icon: <FiZap className="text-sm" /> },
    { number: 3, label: 'Результат', icon: <FiTrendingUp className="text-sm" /> },
  ]

  const handleGenerate = async () => {
    if (!topic.trim()) return
    setIsGenerating(true)
    setCurrentStep(2)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setCurrentStep(3)

    const contentByTab = {
      headlines: [
        {
          title: '🎯 Как удвоить охваты за 7 дней без рекламы',
          description: 'Почему 90% каналов буксуют, а ваш может взлететь. Конкретная стратегия с цифрами и примерами из практики.',
          tip: 'Заголовки с цифрами собирают на 40% больше кликов'
        },
        {
          title: '🔥 Я проанализировал 1000 постов — вот что реально работает',
          description: 'Разбор реальных данных: время публикации, длина текста, частота. Никакой воды — только цифры и выводы.',
          tip: 'Исследования и данные вызывают доверие и репосты'
        },
        {
          title: '💡 Секретный инструмент, о котором молчат топ-авторы',
          description: 'Бесплатный способ, который используют каналы-миллионники. Вы удивитесь, насколько это просто и доступно.',
          tip: 'Эксклюзивность + интрига = максимальный CTR'
        }
      ],
      hooks: [
        {
          title: '⏱ Остановитесь на минуту. Это изменит ваш подход',
          description: 'То, что я сейчас скажу, перевернёт ваше представление о контенте. 90% авторов теряют аудиторию незаметно для себя. Проверьте, не входите ли вы в их число.',
          tip: 'Остановка внимания + обещание инсайта = дочитываемость'
        },
        {
          title: '🤫 Знаете, что общего у всех успешных каналов?',
          description: 'Это не дорогая реклама, не связи и не удача. Это одна простая привычка, которую можно внедрить завтра. И она не требует ни копейки.',
          tip: 'Вопрос + разрыв шаблона + простота = удержание'
        },
        {
          title: '📉 Вчера я потерял 200 подписчиков. Рассказываю',
          description: 'Прозрачный разбор глупой ошибки, которая чуть не убила мой канал. Как избежать и вырасти на чужих граблях за один вечер.',
          tip: 'Личная история + уязвимость = эмпатия и доверие'
        }
      ],
      cta: [
        {
          title: '💬 Какой пункт зацепил больше? Пишите цифру',
          description: 'Автор самого развёрнутого комментария получит бесплатный разбор канала. Условия простые: пишите честно, я читаю всё.',
          tip: 'Вопрос + награда = лавина комментариев за час'
        },
        {
          title: '📌 Сохраните этот пост прямо сейчас',
          description: 'Завтра он исчезнет из ленты, а советы останутся актуальными на месяцы. Не дайте алгоритмам украсть вашу пользу.',
          tip: 'Срочность + практическая ценность = сохранения'
        },
        {
          title: '🔄 Перешлите тому, кто ведёт канал',
          description: 'За 30 секунд вы поможете другу вырасти. А взаимная поддержка — основа быстрого роста в Telegram.',
          tip: 'Социальное доказательство + виральность = охваты'
        }
      ],
      viral: [
        {
          title: '🕵️ Разоблачение: как устроены каналы-миллионники',
          description: 'Показываю закулисье крупнейших Telegram-проектов. Схемы, реальные бюджеты, команды. Всё, о чём молчат их владельцы.',
          tip: 'Закулисье + секреты + цифры = взрывной интерес'
        },
        {
          title: '⚡ Челлендж: 7 дней — 7 форматов. Результаты',
          description: 'Документирую в реальном времени. День 1: провал. День 3: неожиданный рост. День 7: итоги, которые меня удивили.',
          tip: 'Серийность удерживает внимание всю неделю'
        },
        {
          title: '💣 Спорное мнение: не надо постить каждый день',
          description: 'Почему количество убивает качество, и как один сильный пост в неделю приносит больше, чем ежедневный спам.',
          tip: 'Провокация = комментарии = алгоритмические охваты'
        }
      ]
    }

    setGeneratedContent(contentByTab[activeTab as keyof typeof contentByTab] || contentByTab.headlines)
    setIsGenerating(false)
  }

  const handleCopy = () => {
    const text = generatedContent.map((item, i) =>
      `${i + 1}. ${item.title}\n${item.description}\n💡 ${item.tip}\n`
    ).join('\n')
    navigator.clipboard.writeText(text)
  }

  const getStyleGradient = (styleId: string) => {
    const gradients: Record<string, string> = {
      viral: 'from-[#FFA726] to-[#E57373]',
      emotional: 'from-[#E57373] to-[#FFA726]',
      provocative: 'from-[#FFA726] to-[#4CAF50]',
      educational: 'from-[#4CAF50] to-[#FFA726]',
    }
    return gradients[styleId] || gradients.viral
  }

  return (
    <div className="min-h-screen bg-[#1E3A1E] text-white font-['Inter']">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
        
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <span className="inline-block px-3 py-1 bg-[#FFA726]/20 text-[#FFA726] text-xs font-medium rounded-full uppercase tracking-[0.05em] mb-3">
            Вовлечение
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-[-0.02em] mb-2">
            Цепляющие заголовки
          </h1>
          <p className="text-white/40 text-sm sm:text-base max-w-2xl">
            12.4k генераций — Создавайте заголовки, hooks и CTA, которые увеличивают просмотры и клики
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6 sm:mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id)
                setGeneratedContent([])
                setCurrentStep(1)
              }}
              className={`text-left p-4 rounded-xl transition-all duration-150 cursor-pointer ${
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
                    {activeTab === 'headlines' && 'Введите тему, и AI создаст 3 варианта цепляющих заголовков. Каждый использует разную механику: цифры, интригу, эксклюзивность. Выбирайте лучший или комбинируйте.'}
                    {activeTab === 'hooks' && 'Укажите тему поста, и AI напишет 3 первых предложения. Они удержат читателя и заставят дочитать до конца. Хороший хук = 80% успеха поста.'}
                    {activeTab === 'cta' && 'Опишите контекст, и AI предложит 3 призыва к действию. От вопросов для комментариев до призывов сохранить или переслать пост.'}
                    {activeTab === 'viral' && 'Назовите нишу, и AI придумает 3 вирусные механики. Эмоции, споры, инсайты — контент, который расшаривают и обсуждают.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Style selector */}
            <div>
              <label className="block text-sm font-medium text-white/60 mb-3 tracking-[0.05em] uppercase">
                Стиль
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {styles.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStyle(s.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-150 cursor-pointer ${
                      style === s.id
                        ? 'bg-[#FFA726]/20 border border-[#FFA726]/30'
                        : 'bg-white/5 border border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      style === s.id ? 'bg-[#FFA726]/30' : 'bg-white/5'
                    }`}>
                      <span className={style === s.id ? 'text-[#FFA726]' : 'text-white/40'}>
                        {s.icon}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${
                        style === s.id ? 'text-white' : 'text-white/60'
                      }`}>
                        {s.label}
                      </p>
                      <p className="text-xs text-white/30 truncate">{s.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Topic input */}
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2 tracking-[0.05em] uppercase">
                Тема или ниша
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder={
                  activeTab === 'headlines' ? 'Например: как продвигать Telegram-канал бесплатно' :
                  activeTab === 'hooks' ? 'Например: пост про ошибки новичков в маркетинге' :
                  activeTab === 'cta' ? 'Например: обучающий пост про AI-инструменты' :
                  'Например: сравнение Telegram и WhatsApp для бизнеса'
                }
                className="w-full h-36 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 resize-none focus:outline-none focus:border-[#FFA726] focus:shadow-[0_0_12px_rgba(255,167,38,0.15)] transition-all duration-150"
              />
            </div>

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={!topic.trim() || isGenerating}
              className="w-full bg-gradient-to-r from-[#FFA726] to-[#4CAF50] text-[#1E3A1E] rounded-xl px-6 py-4 font-bold hover:translate-y-[-2px] hover:shadow-[0_0_20px_rgba(255,167,38,0.4)] transition-all duration-150 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <span className="flex gap-1.5">
                    <span className="w-2 h-2 bg-[#1E3A1E] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-[#1E3A1E] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-[#1E3A1E] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                  <span className="text-sm">Придумываем заголовки...</span>
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

          {/* Right column - Results */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-white/60 tracking-[0.05em] uppercase flex items-center gap-2">
                <FiTrendingUp className="text-sm" />
                Результат генерации
              </label>
              {generatedContent.length > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 border border-white/10 transition-all duration-150 cursor-pointer"
                  >
                    <FiCopy className="text-sm" />
                    <span className="hidden sm:inline">Копировать всё</span>
                  </button>
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 border border-white/10 transition-all duration-150 cursor-pointer"
                  >
                    <FiRefreshCw className={`text-sm ${isGenerating ? 'animate-spin' : ''}`} />
                    <span className="hidden sm:inline">Обновить</span>
                  </button>
                </div>
              )}
            </div>

            {generatedContent.length > 0 ? (
              <div className="space-y-4">
                {generatedContent.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-5 backdrop-blur-sm hover:border-[#FFA726]/20 transition-all duration-300"
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="flex flex-col items-center gap-2">
                        <span className={`w-8 h-8 rounded-lg bg-gradient-to-r ${getStyleGradient(style)} flex items-center justify-center text-[#1E3A1E] font-bold text-sm flex-shrink-0`}>
                          {index + 1}
                        </span>
                        {index < generatedContent.length - 1 && (
                          <div className="w-px h-4 bg-gradient-to-b from-[#FFA726]/30 to-transparent" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold mb-2 leading-relaxed text-sm sm:text-base">
                          {item.title}
                        </h3>
                        <p className="text-white/60 text-xs sm:text-sm leading-relaxed mb-3">
                          {item.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#FFA726]/10 rounded-lg">
                            <FiStar className="text-[#FFA726] text-xs" />
                            <span className="text-[#FFA726] text-xs font-medium">
                              {item.tip}
                            </span>
                          </div>
                          <button
                            onClick={() => navigator.clipboard.writeText(`${item.title}\n${item.description}`)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-white/30 hover:text-white/60 hover:bg-white/5 transition-all duration-150 cursor-pointer"
                          >
                            <FiCopy className="text-xs" />
                            Копировать
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Bottom insight card */}
                <div className="bg-gradient-to-r from-[#FFA726]/10 to-[#4CAF50]/10 border border-[#FFA726]/20 rounded-xl p-4 sm:p-5 backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FFA726] to-[#4CAF50] flex items-center justify-center flex-shrink-0">
                      <FiZap className="text-white text-sm" />
                    </div>
                    <div>
                      <h3 className="text-[#FFA726] font-semibold mb-2 text-sm sm:text-base">
                        Ключевой принцип
                      </h3>
                      <p className="text-white/70 text-xs sm:text-sm leading-relaxed">
                        {activeTab === 'headlines' && 'Сильные заголовки строятся на трёх китах: конкретика, интрига, обещание. Чем точнее вы попадаете в боль аудитории — тем выше отклик. Тестируйте 2-3 варианта на один пост и анализируйте статистику.'}
                        {activeTab === 'hooks' && 'Хороший хук удерживает внимание в первые 3 секунды. Используйте личные истории, неожиданные факты или вопросы. Главное правило: пообещали интригу — раскройте её в тексте.'}
                        {activeTab === 'cta' && 'Без CTA даже вирусный пост не приносит подписчиков. Одно конкретное действие работает лучше, чем три. Чем проще действие — тем выше конверсия в отклик.'}
                        {activeTab === 'viral' && 'Вирусность — это формула: сильная эмоция + простота репоста + актуальность. Спорные темы работают лучше всего, но сохраняйте уважение к аудитории.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feedback */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-white/40">Оценить:</span>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/60 hover:text-[#FFA726] hover:bg-[#FFA726]/10 transition-all duration-150 cursor-pointer">
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
              <div className="bg-white/5 border border-white/10 rounded-xl p-8 sm:p-12 backdrop-blur-sm flex flex-col items-center justify-center text-center min-h-[400px]">
                <div className="w-16 h-16 rounded-2xl bg-[#FFA726]/10 flex items-center justify-center mb-5">
                  {activeTab === 'headlines' && <FiTrendingUp className="text-[#FFA726] text-2xl" />}
                  {activeTab === 'hooks' && <FiZap className="text-[#FFA726] text-2xl" />}
                  {activeTab === 'cta' && <FiTarget className="text-[#FFA726] text-2xl" />}
                  {activeTab === 'viral' && <FiVolume2 className="text-[#FFA726] text-2xl" />}
                </div>
                <h3 className="text-white/80 font-semibold mb-2">
                  Готово к генерации
                </h3>
                <p className="text-white/30 text-sm max-w-sm">
                  {activeTab === 'headlines' && 'Введите тему, и AI создаст 3 варианта заголовков. С разной механикой: цифры, интрига, эксклюзивность.'}
                  {activeTab === 'hooks' && 'Укажите тему, и AI напишет 3 цепляющих первых предложения. Которые удержат читателя.'}
                  {activeTab === 'cta' && 'Опишите контекст, и AI предложит 3 призыва к действию. Для комментариев, сохранений и репостов.'}
                  {activeTab === 'viral' && 'Назовите нишу, и AI придумает 3 вирусные механики. Контент для максимальных охватов.'}
                </p>
                <div className="flex items-center gap-4 mt-6 text-white/15 text-xs">
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
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViralHeadlinesService