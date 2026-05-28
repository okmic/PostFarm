import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  FaFire,
  FaGraduationCap,
  FaRobot,
  FaCheckCircle,
  FaChevronDown,
  FaHistory,
} from 'react-icons/fa'

import { FiArrowRight, FiInfo } from 'react-icons/fi'
import { MdContentPasteSearch } from 'react-icons/md'

export default function ServicePage() {
  const navigate = useNavigate()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const services = [
    {
      id: 'channel-content',
      name: 'Контент Блога или Канала',
      icon: MdContentPasteSearch,
      color: '#26A5E4',
      badge: 'Популярно',
      badgeColor: 'text-[#26A5E4]',
      badgeBg: 'bg-[#26A5E4]/10 border border-[#26A5E4]/20',
      description: 'Создавайте готовые посты, идеи и контент для блогов и каналов',
      stats: '14.1k генераций',
      about: {
        title: 'Что делает этот инструмент',
        text: 'AI пишет посты, придумывает идеи, создаёт опросы и серии публикаций специально для блогов и каналов. Экономит 3 часа в день на создании контента.',
        details: [
          'Генерация готовых постов с эмодзи и структурой',
          'Создание идей для публикаций на неделю вперёд',
          'Вовлекающие опросы с вариантами ответов',
          'Серии связанных постов для удержания аудитории'
        ]
      },
      outputs: ['Посты', 'Идеи', 'Опросы', 'Серии'],
      useCase: 'Для владельцев блогов и каналов, SMM-менеджеров, блогеров'
    },
    {
      id: 'viral-headlines',
      name: 'Цепляющие заголовки',
      icon: FaFire,
      color: '#FF7043',
      badge: 'Вовлечение',
      badgeColor: 'text-[#FF7043]',
      badgeBg: 'bg-[#FF7043]/10 border border-[#FF7043]/20',
      description: 'Генерация заголовков, hooks и сильных начал для постов',
      stats: '12.4k генераций',
      about: {
        title: 'Что делает этот инструмент',
        text: 'AI создаёт заголовки с высоким CTR, цепляющие первые строки и вирусные механики. Увеличивает просмотры публикаций на 40%.',
        details: [
          'Заголовки с цифрами, интригой и обещанием пользы',
          'Цепляющие хуки для первых строк поста',
          'Призывы к действию с высокой конверсией',
          'Вирусные идеи для максимальных охватов'
        ]
      },
      outputs: ['Заголовки', 'Hooks', 'CTA', 'Вирусные'],
      useCase: 'Для копирайтеров, маркетологов, авторов каналов'
    },
    {
      id: 'ai-digest',
      name: 'AI-дайджесты',
      icon: FaRobot,
      color: '#4CAF50',
      badge: 'AI новости',
      badgeColor: 'text-[#4CAF50]',
      badgeBg: 'bg-[#4CAF50]/10 border border-[#4CAF50]/20',
      description: 'Превращайте новости и темы в готовые Telegram-посты',
      stats: '8.7k генераций',
      about: {
        title: 'Что делает этот инструмент',
        text: 'Вставьте ссылку или текст — AI сделает краткий пересказ, обзор или выделит главные выводы. Экономит 2 часа на анализе информации.',
        details: [
          'Превращение ссылок в адаптированные новости',
          'Краткий пересказ длинных статей за 30 секунд',
          'Глубокие обзоры с анализом и контекстом',
          'Извлечение практических выводов и инсайтов'
        ]
      },
      outputs: ['Новости', 'Summary', 'Обзоры', 'Выводы'],
      useCase: 'Для новостных каналов, аналитиков, tech-блогеров'
    },
    {
      id: 'education-posts',
      name: 'Обучающие посты',
      icon: FaGraduationCap,
      color: '#8B5CF6',
      badge: 'Обучение',
      badgeColor: 'text-[#8B5CF6]',
      badgeBg: 'bg-[#8B5CF6]/10 border border-[#8B5CF6]/20',
      description: 'Объясняйте сложные темы простым и понятным языком',
      stats: '4.3k генераций',
      about: {
        title: 'Что делает этот инструмент',
        text: 'AI создаёт гайды, объяснения и серии уроков. Адаптирует сложные темы под любой уровень подготовки читателя.',
        details: [
          'Пошаговые мини-гайды с чёткими инструкциями',
          'Объяснение сложных тем на простых аналогиях',
          'Познавательные факты с цифрами и контекстом',
          'Серии обучающих постов с прогрессией сложности'
        ]
      },
      outputs: ['Мини-гайды', 'Объяснения', 'Факты', 'Уроки'],
      useCase: 'Для образовательных каналов, экспертов, коучей'
    },
    {
      id: 'post-chronicle',
      name: 'Хроника постов',
      icon: FaHistory,
      color: '#FFA726',
      badge: 'Новое',
      badgeColor: 'text-[#FFA726]',
      badgeBg: 'bg-[#FFA726]/10 border border-[#FFA726]/20',
      description: 'Копируйте свои посты — AI проанализирует стиль и напишет продолжение',
      stats: '3.2k генераций',
      about: {
        title: 'Как это работает',
        text: 'Вы вставляете 2-5 своих предыдущих постов. AI изучает ваш стиль, тон, темы и создаёт новый пост, который звучит как естественное продолжение. Идеально для серийного контента и storytelling.',
        details: [
          'Анализ стиля: AI копирует вашу манеру письма',
          'Сюжетная связность: продолжает логику повествования',
          'Tone of voice: сохраняет ваш уникальный голос',
          'Форматы: продолжение, новая глава, спин-офф'
        ]
      },
      outputs: ['Продолжение', 'Новая глава', 'Спин-офф', 'Рефлексия'],
      useCase: 'Для авторов серий, блогов с историей, storytelling-каналов'
    }
  ]

  const handleCardClick = (id: string) => {
    navigate(`/services/${id}`)
  }

  const toggleExpand = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div className='min-h-screen overflow-hidden'>
      <div className='absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle,white_1px,transparent_1px)] [background-size:24px_24px]' />

      <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-14'>

        <div className='relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl p-8 lg:p-12 mb-10'>
          <div className='absolute inset-0 bg-gradient-to-r from-[#4CAF50]/10 via-transparent to-[#FFA726]/5' />

          <div className='relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8'>
            <div className='max-w-2xl'>
              <h1 className='text-4xl lg:text-5xl font-black tracking-[-0.04em] text-white leading-none mb-4'>
                Что будем
                <span className='bg-gradient-to-r from-[#4CAF50] to-[#FFA726] bg-clip-text text-transparent'>
                  {' '}публиковать?
                </span>
              </h1>

              <p className='text-base text-white/40 max-w-xl'>
                AI-инструменты для создания постов, заголовков, идей и контента
              </p>
            </div>

          </div>
        </div>

        <div className='flex items-center justify-between mb-6'>
          <div>
            <h2 className='text-2xl font-bold text-white tracking-[-0.03em] mb-1'>
              Инструменты контента
            </h2>
            <p className='text-sm text-white/40'>
              Выберите инструмент и начните создавать контент
            </p>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start'>
          {services.map((service) => {
            const Icon = service.icon
            const isExpanded = expandedId === service.id

            return (
              <div
                key={service.id}
                className={`
                  relative rounded-2xl
                  border border-white/10
                  bg-white/[0.04]
                  backdrop-blur-xl
                  transition-all duration-300
                  hover:border-white/20
                  hover:bg-white/[0.06]
                  hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]
                  ${isExpanded ? 'ring-1 ring-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)]' : ''}
                `}
              >
                <button
                  onClick={() => handleCardClick(service.id)}
                  className='w-full cursor-pointer text-left p-5'
                >
                  <div className='flex items-center justify-between mb-4'>
                    <div
                      className='w-11 h-11 rounded-xl flex items-center justify-center border border-white/5 flex-shrink-0'
                      style={{ backgroundColor: `${service.color}15` }}
                    >
                      <Icon
                        className='text-lg'
                        style={{ color: service.color }}
                      />
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-[10px] uppercase tracking-[0.1em] font-medium whitespace-nowrap ${service.badgeBg} ${service.badgeColor}`}>
                      {service.badge}
                    </span>
                  </div>

                  <h3 className='text-base font-bold tracking-[-0.02em] text-white mb-1.5'>
                    {service.name}
                  </h3>
                  <p className='text-xs leading-relaxed text-white/40 mb-4 line-clamp-2 min-h-[2.5rem]'>
                    {service.description}
                  </p>

                  <div className='grid grid-cols-2 gap-1.5 mb-4'>
                    {service.outputs.map((output) => (
                      <div
                        key={output}
                        className='rounded-lg border border-white/5 bg-white/[0.03] px-2.5 py-2'
                      >
                        <span className='text-xs text-white/60 truncate block'>{output}</span>
                      </div>
                    ))}
                  </div>

                  <div className='flex items-center justify-between pt-4 border-t border-white/5'>
                    <div>
                      <div className='text-[10px] uppercase tracking-[0.12em] text-white/25 mb-0.5'>
                        Активность
                      </div>
                      <div className='text-xs text-white/60'>{service.stats}</div>
                    </div>
                    <div
                      className='flex items-center gap-1.5 text-xs font-medium transition-all duration-200'
                      style={{ color: service.color }}
                    >
                      Открыть
                      <FiArrowRight className='text-xs' />
                    </div>
                  </div>
                </button>

                <button
                  onClick={(e) => toggleExpand(e, service.id)}
                  className={`
                    w-full flex items-center justify-center gap-2 px-5 py-2.5 cursor-pointer
                    border-t border-white/5
                    text-xs text-white/30 hover:text-white/50
                    transition-all duration-200
                    ${isExpanded ? 'bg-white/[0.02]' : 'hover:bg-white/[0.02]'}
                  `}
                >
                  <FiInfo className='text-xs' />
                  <span>{isExpanded ? 'Скрыть справку' : 'Что это за инструмент?'}</span>
                  <FaChevronDown
                    className={`text-[10px] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </button>

                <div
                  className={`
                    overflow-hidden transition-all duration-300 ease-in-out
                    ${isExpanded ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}
                  `}
                >
                  <div className='px-5 pb-5 pt-5 space-y-4'>
                    <div
                      className='rounded-xl p-4 border'
                      style={{
                        backgroundColor: `${service.color}08`,
                        borderColor: `${service.color}20`
                      }}
                    >
                      <h4
                        className='text-xs font-semibold mb-2'
                        style={{ color: service.color }}
                      >
                        {service.about.title}
                      </h4>
                      <p className='text-xs text-white/50 leading-relaxed mb-3'>
                        {service.about.text}
                      </p>
                      <ul className='space-y-2'>
                        {service.about.details.map((detail, i) => (
                          <li key={i} className='flex items-start gap-2 text-xs text-white/40'>
                            <span
                              className='w-1 h-1 rounded-full mt-1.5 flex-shrink-0'
                              style={{ backgroundColor: service.color }}
                            />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className='flex items-start gap-2 text-xs text-white/30'>
                      <FaCheckCircle
                        className='text-xs mt-0.5 flex-shrink-0'
                        style={{ color: service.color }}
                      />
                      <span>{service.useCase}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className='mt-8 flex items-center justify-center gap-2 text-xs text-white/15'>
          <FiInfo className='text-sm' />
          <span>Нажмите «Что это за инструмент?» чтобы узнать подробнее о каждом сервисе</span>
        </div>
      </div>
    </div>
  )
}