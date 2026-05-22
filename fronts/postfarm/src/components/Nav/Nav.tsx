import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { FaUserCircle, FaChartLine } from "react-icons/fa"
import { MdOutlineSocialDistance } from "react-icons/md"
import { Logo } from "../Logo/Logo"

const navItems = [
  { to: "/services", title: "Сервисы", Icon: MdOutlineSocialDistance },
  { to: "/stats", title: "Статистика", Icon: FaChartLine },
  { to: "/settings", title: "Настройки", Icon: FaUserCircle },
]

const BREAKPOINT = 900

export default function Nav() {
  const [isWide, setIsWide] = useState(window.innerWidth >= BREAKPOINT)

  useEffect(() => {
    const handleResize = () => setIsWide(window.innerWidth >= BREAKPOINT)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const { pathname } = useLocation()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] pointer-events-none">
      <div className={`
        mx-auto pointer-events-auto
        bg-[#1E3A1E]/95 backdrop-blur-2xl
        border border-white/10
        shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_0_1px_rgba(76,175,80,0.1)]
        transition-all duration-300 ease-out
        ${isWide 
          ? 'max-w-[500px] rounded-[48px] mb-4 px-5 py-3 flex items-center gap-4' 
          : 'max-w-full rounded-t-3xl rounded-b-none px-3 py-2 pb-[env(safe-area-inset-bottom,12px)] flex items-center justify-around'
        }
      `}>
        {isWide && (
          <div className="flex items-center gap-4 pr-5 border-r border-white/10 shrink-0">
            <Logo size="sm" />
          </div>
        )}

        <div className={`
          flex items-center
          ${isWide ? 'gap-2 flex-1 justify-center' : 'w-full justify-around'}
        `}>
          {navItems.map(({ to, title, Icon }) => {
            const isActive = pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={`
                  flex flex-col items-center justify-center gap-1
                  rounded-xl transition-colors duration-200
                  ${isWide ? 'w-[90px] h-[68px]' : 'flex-1 py-2 px-1'}
                  ${isActive ? 'bg-[#4CAF50]/15 border border-[#4CAF50]/20' : 'border border-transparent'}
                `}
              >
                <Icon className={`
                  transition-colors duration-200
                  ${isWide ? 'text-2xl' : 'text-xl'}
                  ${isActive ? 'text-white drop-shadow-[0_0_6px_rgba(76,175,80,0.5)]' : 'text-[#4CAF50]'}
                `} />
                <span className={`
                  font-medium tracking-wide transition-colors duration-200
                  ${isWide ? 'text-[11px]' : 'text-[10px]'}
                  ${isActive ? 'text-white font-semibold' : 'text-white/60'}
                `}>
                  {title}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}