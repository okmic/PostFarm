import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import { FaStar } from "react-icons/fa"
import { FiX } from "react-icons/fi"
import type { RootState } from "../../store/store"
import { LiaLinkSolid, LiaUser } from "react-icons/lia"

const navItems = [
  { to: "/links", title: "Ссылки", Icon: LiaLinkSolid },
  { to: "/users", title: "Пользователи", Icon: LiaUser },
]

const favoriteServices = [
  { id: 'channel-content' as const, name: 'Контент', color: '#26A5E4' },
  { id: 'viral-headlines' as const, name: 'Заголовки', color: '#FF7043' },
  { id: 'education-posts' as const, name: 'Обучение', color: '#8B5CF6' },
  { id: 'post-chronicle' as const, name: 'Хроника', color: '#FFA726' },
]

export default function Nav() {
  const { pathname } = useLocation()
  const user = useSelector((state: RootState) => state.auth.user)
  const favorites = user?.featuredServices || []
  const [showFavorites, setShowFavorites] = useState(false)

  const filteredFavorites = favoriteServices.filter(s => favorites.includes(s.id))

  return (
    <>
      {showFavorites && filteredFavorites.length > 0 && (
        <div className="fixed inset-0 z-[99] bg-[#0F1A0F]/60 backdrop-blur-sm" onClick={() => setShowFavorites(false)} />
      )}

      {showFavorites && filteredFavorites.length > 0 && (
        <div className="fixed bottom-[68px] md:bottom-28 left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 z-[110] md:w-64">
          <div className="bg-[#1A2E1A] border border-white/10 rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.6)] p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <FaStar className="text-[#FFA726] text-[10px]" />
                <span className="text-[11px] font-medium text-white">Избранное</span>
              </div>
              <button onClick={() => setShowFavorites(false)} className="w-5 h-5 flex items-center justify-center rounded-md hover:bg-white/[0.06]">
                <FiX className="text-white/40 text-xs" />
              </button>
            </div>

            <div className="flex gap-2 md:flex-col md:gap-1">
              {filteredFavorites.map((service) => (
                <Link
                  key={service.id}
                  to={`/services/${service.id}`}
                  onClick={() => setShowFavorites(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/[0.06] transition-all flex-1 md:flex-none"
                >
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: service.color, boxShadow: `0 0 6px ${service.color}60` }}
                  />
                  <span className="text-[11px] text-white/60 font-light hover:text-white/90 transition-colors truncate">
                    {service.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 z-[100] pointer-events-none flex justify-center">
        <div className={`
          pointer-events-auto
          bg-[#1E3A1E]/95 backdrop-blur-2xl
          border border-white/10
          shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_0_1px_rgba(76,175,80,0.1)]
          transition-all duration-300 ease-out
          rounded-2xl md:rounded-[48px]
          mb-2 md:mb-6
          px-2 md:px-4 py-1.5 md:py-2
          flex items-center gap-1.5 md:gap-3
          w-auto
        `}>
          <div className="flex items-center gap-1 md:gap-2">
            {favorites.length > 0 && (
              <button
                onClick={() => setShowFavorites(!showFavorites)}
                className={`
                  flex items-center justify-center
                  rounded-xl transition-all duration-200
                  w-9 h-9 md:w-auto md:h-auto md:flex-col md:gap-1
                  md:px-4 md:py-2
                  cursor-pointer
                  ${showFavorites ? 'bg-[#FFA726]/15 border border-[#FFA726]/20' : 'border border-transparent hover:bg-white/[0.04]'}
                `}
              >
                <FaStar className={`
                  transition-all duration-200
                  text-lg md:text-lg
                  ${showFavorites ? 'text-[#FFA726] drop-shadow-[0_0_8px_rgba(255,167,38,0.4)]' : 'text-white/50 md:text-white/40'}
                `} />
                <span className={`
                  hidden md:block font-medium tracking-wide transition-all duration-200
                  text-[10px]
                  ${showFavorites ? 'text-[#FFA726] font-semibold' : 'text-white/40 md:text-white/30'}
                `}>
                  Избранное
                </span>
              </button>
            )}

            {navItems.map(({ to, title, Icon }) => {
              const isActive = pathname === to
              return (
                <Link
                  key={to}
                  to={to}
                  className={`
                    flex items-center justify-center md:flex-col md:gap-1
                    rounded-xl transition-all duration-200
                    w-9 h-9 md:w-auto md:h-auto
                    md:px-4 md:py-2
                    ${isActive ? 'bg-[#4CAF50]/15 border border-[#4CAF50]/20' : 'border border-transparent'}
                  `}
                >
                  <Icon className={`
                    transition-all duration-200
                    text-lg md:text-lg
                    ${isActive ? 'text-[#4CAF50] drop-shadow-[0_0_8px_rgba(76,175,80,0.4)]' : 'text-white/50 md:text-white/40'}
                  `} />
                  <span className={`
                    hidden md:block font-medium tracking-wide transition-all duration-200
                    text-[10px]
                    ${isActive ? 'text-[#4CAF50] font-semibold' : 'text-white/40 md:text-white/30'}
                  `}>
                    {title}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
