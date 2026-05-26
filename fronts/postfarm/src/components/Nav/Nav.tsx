import { Link, useLocation } from "react-router-dom"
import { FaUserCircle, FaChartLine } from "react-icons/fa"
import { MdOutlineSocialDistance } from "react-icons/md"
import { PostHubLogo } from "../Logo/Logo"
import appconfig from "../../appconfig"

const navItems = [
  { to: "/services", title: "Сервисы", Icon: MdOutlineSocialDistance },
  { to: "/stats", title: "Статистика", Icon: FaChartLine },
  { to: "/settings", title: "Настройки", Icon: FaUserCircle },
]

export default function Nav() {
  const { pathname } = useLocation()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] pointer-events-none flex justify-center">
      <div className="
        pointer-events-auto
        bg-[#1E3A1E]/95 backdrop-blur-2xl
        border border-white/10
        shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_0_1px_rgba(76,175,80,0.1)]
        transition-all duration-300 ease-out
        rounded-2xl md:rounded-[48px]
        mb-2 md:mb-6
        px-3 md:px-4 py-2
        flex items-center gap-2 md:gap-3
        w-auto
      ">
        <a
          href={appconfig.postHubUri}
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer hover:opacity-80 transition-opacity shrink-0 hidden md:block"
        >
          <PostHubLogo variant="wordmark" size="sm" />
        </a>

        <a
          href={appconfig.postHubUri}
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer hover:opacity-80 transition-opacity shrink-0 block md:hidden"
        >
          <PostHubLogo variant="wordmark" size="sm" />
        </a>

        <div className="flex items-center gap-1 md:gap-2">
          {navItems.map(({ to, title, Icon }) => {
            const isActive = pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={`
                  flex flex-col items-center justify-center gap-0.5 md:gap-1
                  rounded-xl transition-all duration-200
                  px-3 md:px-4 py-1 md:py-2
                  ${isActive ? 'bg-[#4CAF50]/15 border border-[#4CAF50]/20' : 'border border-transparent'}
                `}
              >
                <Icon className={`
                  transition-all duration-200
                  text-xl md:text-lg
                  ${isActive ? 'text-[#4CAF50] drop-shadow-[0_0_8px_rgba(76,175,80,0.4)]' : 'text-white/50 md:text-white/40'}
                `} />
                <span className={`
                  font-medium tracking-wide transition-all duration-200
                  text-[9px] md:text-[10px]
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
  )
}