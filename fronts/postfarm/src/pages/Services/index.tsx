import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { 
  FaFire, 
  FaGraduationCap, 
  FaHistory, 
  FaStar, 
  FaRegStar,
  FaFileAlt,
  FaLightbulb,
  FaChartBar,
  FaLink,
  FaTrophy,
  FaBolt,
  FaBullseye,
  FaRocket,
  FaBookOpen,
  FaSearch,
  FaBrain,
  FaRedo,
  FaLeaf,
  FaComment,
} from 'react-icons/fa'
import { FiArrowRight, FiHexagon, FiInfo } from 'react-icons/fi'
import { MdContentPasteSearch } from 'react-icons/md'
import type { IconType } from 'react-icons'
import type { ServicesIdsType } from '../../pkg/types/user'
import type { RootState } from '../../store/store'
import apiUserService from '../../pkg/api/api.user.service'
import { updateStateUser } from '../../store/slices/auth.slice'

type Service = {
  id: ServicesIdsType
  name: string
  description: string
  about: {
    title: string
    text: string
    details: string[]
  }
  outputs: { label: string; icon: IconType }[]
  useCase: string
  color: string
}

const services: Service[] = [
  {
    id: 'channel-content',
    name: 'Контент канала',
    description: 'Готовые посты, идеи и серии за минуты',
    about: {
      title: 'AI-редактор',
      text: 'AI генерирует посты с эмодзи и структурой, придумывает идеи на неделю и создаёт опросы. Готовый контент-план за минуты.',
      details: [
        'Посты с tone of voice под ваш канал',
        'Идеи на неделю с учётом трендов',
        'Опросы которые собирают комментарии',
        'Серии постов для удержания аудитории'
      ]
    },
    outputs: [
      { label: 'Посты', icon: FaFileAlt },
      { label: 'Идеи', icon: FaLightbulb },
      { label: 'Опросы', icon: FaChartBar },
      { label: 'Серии', icon: FaLink }
    ],
    useCase: 'Каналы, SMM, блогеры',
    color: '#26A5E4'
  },
  {
    id: 'viral-headlines',
    name: 'Цепляющие заголовки',
    description: 'Заголовки и хуки с CTR на 40% выше',
    about: {
      title: 'Мастер крючков',
      text: 'AI создаёт заголовки с высоким CTR и вирусные механики. Каждый вариант проходит самооценку — вы получаете только лучшее.',
      details: [
        'Заголовки с цифрами и интригой',
        'Хуки которые останавливают скролл',
        'CTA с высокой конверсией',
        'Вирусные механики для репостов'
      ]
    },
    outputs: [
      { label: 'Заголовки', icon: FaTrophy },
      { label: 'Hooks', icon: FaBolt },
      { label: 'CTA', icon: FaBullseye },
      { label: 'Вирус', icon: FaRocket }
    ],
    useCase: 'Копирайтеры, маркетинг',
    color: '#FF7043'
  },
  {
    id: 'education-posts',
    name: 'Обучающие посты',
    description: 'Сложное — простыми словами',
    about: {
      title: 'Эксперт в кармане',
      text: 'AI превращает сложные темы в гайды и уроки. Находит аналогии которые поймёт даже новичок.',
      details: [
        'Пошаговые мини-гайды',
        'Объяснение на простых аналогиях',
        'Факты с цифрами и контекстом',
        'Серии уроков с прогрессией'
      ]
    },
    outputs: [
      { label: 'Гайды', icon: FaBookOpen },
      { label: 'Уроки', icon: FaGraduationCap },
      { label: 'Факты', icon: FaBrain },
      { label: 'Разборы', icon: FaSearch }
    ],
    useCase: 'Эксперты, коучи, обучение',
    color: '#8B5CF6'
  },
  {
    id: 'post-chronicle',
    name: 'Хроника постов',
    description: 'AI пишет продолжение в вашем стиле',
    about: {
      title: 'Цифровой соавтор',
      text: 'Вставьте 2-5 постов — AI изучит стиль и напишет продолжение. Новая глава, поворот или спин-офф.',
      details: [
        'Анализ стиля и манеры письма',
        'Сюжетная связность',
        'Сохранение tone of voice',
        'Продолжение, поворот, спин-офф'
      ]
    },
    outputs: [
      { label: 'Продолж.', icon: FaFileAlt },
      { label: 'Поворот', icon: FaRedo },
      { label: 'Спин-офф', icon: FaLeaf },
      { label: 'Финал', icon: FaComment }
    ],
    useCase: 'Авторы, блоги, storytelling',
    color: '#FFA726'
  }
]

const serviceIcons: Record<string, IconType> = {
  'channel-content': MdContentPasteSearch,
  'viral-headlines': FaFire,
  'education-posts': FaGraduationCap,
  'post-chronicle': FaHistory
}

export default function ServicePage() {
  const navigate = useNavigate()
  const user = useSelector((state: RootState) => state.auth.user)
  const dispatch = useDispatch()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<ServicesIdsType[]>(user?.featuredServices || [])
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (user?.featuredServices) {
      setFavorites(user.featuredServices)
    }
  }, [user?.featuredServices])

  const toggleFavorite = async (e: React.MouseEvent, id: ServicesIdsType) => {
    e.stopPropagation()
    if (isUpdating) return

    const isCurrentlyFavorite = favorites.includes(id)
    const updatedFavorites = isCurrentlyFavorite
      ? favorites.filter(fav => fav !== id)
      : [...favorites, id]

    setFavorites(updatedFavorites)
    setIsUpdating(true)

    try {
      await apiUserService.updateUser({ featuredServices: updatedFavorites })
      dispatch(updateStateUser({ user: { featuredServices: updatedFavorites }}))
    } catch (error) {
      setFavorites(favorites)
      console.error('Failed to update favorites:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const toggleExpand = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div className='max-w-6xl mx-auto px-4 sm:px-6'>
      <Hero />
      
      <div className='flex items-center justify-between mb-8'>
        <div>
          <p className='text-[11px] text-white/25 uppercase tracking-[0.2em] mb-2'>сервисы</p>
          <h2 className='text-2xl font-light text-white tracking-[-0.02em]'>Инструменты</h2>
        </div>
        {favorites.length > 0 && (
          <div className='flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06]'>
            <FaStar className='text-[#FFA726] text-[10px]' />
            <span className='text-xs text-white/30 font-light'>{favorites.length} в избранном</span>
          </div>
        )}
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4'>
        {services.map((service) => (
          <Card
            key={service.id}
            service={service}
            Icon={serviceIcons[service.id]}
            isFavorite={favorites.includes(service.id)}
            isExpanded={expandedId === service.id}
            onNavigate={() => navigate(`/services/${service.id}`)}
            onToggleFavorite={(e) => toggleFavorite(e, service.id)}
            onToggleExpand={(e) => toggleExpand(e, service.id)}
          />
        ))}
      </div>

      <div className='mt-10 flex items-center justify-center gap-2 text-[10px] text-white/10 uppercase tracking-[0.2em]'>
        <FiHexagon className='text-[8px]' />
        <span>нажмите на значок подсказки чтобы узнать подробнее</span>
        <FiHexagon className='text-[8px]' />
      </div>
    </div>
  )
}

const Hero = () => (
  <div className='mb-14'>    
    <h1 className='text-5xl lg:text-7xl font-thin text-white tracking-[-0.03em] leading-[1.1] mb-6'>
      Что будем
      <br />
      <span className='font-light text-white/40'>публиковать</span>
      <span className='text-white/10'>?</span>
    </h1>
    
    <p className='text-sm text-white/25 max-w-md leading-relaxed font-light'>
      Выращивайте контент автоматически. Выберите инструмент — AI сделает остальное.
    </p>
  </div>
)

const Card = ({
  service,
  Icon,
  isFavorite,
  isExpanded,
  onNavigate,
  onToggleFavorite,
  onToggleExpand
}: {
  service: Service
  Icon: IconType
  isFavorite: boolean
  isExpanded: boolean
  onNavigate: () => void
  onToggleFavorite: (e: React.MouseEvent) => void
  onToggleExpand: (e: React.MouseEvent) => void
}) => (
  <div
    className={`
      group relative rounded-2xl border transition-all duration-500 ease-out
      ${isExpanded 
        ? 'border-white/[0.10] bg-white/[0.04]' 
        : 'border-white/[0.05] bg-white/[0.02] hover:border-white/[0.08] hover:bg-white/[0.03]'
      }
    `}
  >
    <div onClick={onNavigate} className='w-full text-left p-5 lg:p-6 cursor-pointer'>
      <div className='flex items-start justify-between mb-5'>
        <div 
          className='w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-105'
          style={{ backgroundColor: `${service.color}18` }}
        >
          <Icon className='text-xl' color={service.color} />
        </div>
        
        <div className='flex items-center gap-2'>
          <button onClick={onToggleFavorite} className='w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-300 hover:scale-110 active:scale-90 cursor-pointer hover:bg-white/[0.04]'>
            {isFavorite ? (
              <FaStar className='text-[#FFA726] text-sm' />
            ) : (
              <FaRegStar className='text-white/20 text-sm hover:text-white/40' />
            )}
          </button>
          
          <button 
            onClick={onToggleExpand} 
            className='w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-300 cursor-pointer hover:bg-white/[0.04]'
            title='Подробнее о сервисе'
          >
            <FiInfo className={`text-sm transition-all duration-300 ${isExpanded ? 'text-white/60' : 'text-white/25 hover:text-white/40'}`} />
          </button>
        </div>
      </div>

      <h3 className='text-lg font-medium text-white tracking-[-0.01em] mb-2'>
        {service.name}
      </h3>
      <p className='text-sm text-white/40 leading-relaxed font-light'>
        {service.description}
      </p>

      <div className='grid grid-cols-4 gap-2 mt-5'>
        {service.outputs.map((output) => {
          const OutputIcon = output.icon
          return (
            <div key={output.label} className='flex flex-col items-center gap-2 px-2 py-3 rounded-xl bg-white/[0.03] border border-white/[0.03] transition-all duration-300 hover:bg-white/[0.06] hover:border-white/[0.06]'>
              <OutputIcon className='text-base' color={service.color} />
              <span className='text-[11px] text-white/40 font-light tracking-[0.01em]'>{output.label}</span>
            </div>
          )
        })}
      </div>

      <div className='flex items-center gap-2 mt-5 pt-4 border-t border-white/[0.04]'>
        <span className='text-xs font-light' style={{ color: service.color }}>Открыть инструмент</span>
        <FiArrowRight className='text-xs transition-transform duration-300 group-hover:translate-x-1' color={service.color} />
      </div>
    </div>

    <div
      className={`
        overflow-hidden transition-all duration-500 ease-out
        ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
      `}
    >
      <div className='px-5 lg:px-6 pb-6 border-t border-white/[0.04]'>
        <div className='pt-5 space-y-5'>
          <div className='flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]'>
            <div className='w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0' style={{ backgroundColor: `${service.color}15` }}>
              <FiInfo className='text-sm' color={service.color} />
            </div>
            <div>
              <p className='text-xs font-medium text-white/60 mb-1'>{service.about.title}</p>
              <p className='text-sm text-white/35 leading-relaxed font-light'>{service.about.text}</p>
            </div>
          </div>
          
          <div className='space-y-2'>
            {service.about.details.map((detail, i) => (
              <div key={i} className='flex items-center gap-3 px-2 py-1.5'>
                <span className='w-1.5 h-1.5 rounded-full flex-shrink-0' style={{ backgroundColor: service.color, boxShadow: `0 0 6px ${service.color}60` }} />
                <span className='text-sm text-white/35 font-light'>{detail}</span>
              </div>
            ))}
          </div>
          
          <div className='flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.03]'>
            <span className='text-[11px] text-white/20 font-light'>Подходит: </span>
            <span className='text-[11px] text-white/35 font-light'>{service.useCase}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
)
