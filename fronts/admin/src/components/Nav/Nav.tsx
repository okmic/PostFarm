import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { FaUserCircle, FaChartLine } from "react-icons/fa"
import { ImStatsBars2 } from "react-icons/im"
import { MdOutlineSocialDistance, MdSettings } from "react-icons/md"
import { FiMenu, FiX } from "react-icons/fi"
import { Logo } from "../Logo/Logo"

const desktopLinkItems = [
  { to: "/settings", title: "Настройки", Icon: FaUserCircle },
  { to: "/stats", title: "Статистика", Icon: ImStatsBars2 },
  { to: "/services", title: "Сервисы", Icon: MdOutlineSocialDistance },
]

const mobileLinkItems = [
  { to: "/settings", title: "Настройки", Icon: MdSettings },
  { to: "/stats", title: "Статистика", Icon: FaChartLine },
  { to: "/services", title: "Сервисы", Icon: MdOutlineSocialDistance },
]

export default function Nav() {
  const [isActiveNav, setIsActiveNav] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768 && isActiveNav) {
        handleClose()
      }
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [isActiveNav])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsActiveNav(false)
      setIsClosing(false)
    }, 350)
  }

  const handleOpen = () => {
    setIsActiveNav(true)
  }

  useEffect(() => {
    if (isActiveNav && isMobile) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isActiveNav, isMobile])

  return (
    <>
      {isActiveNav && (
        <div 
          className="fixed inset-0 bg-slate-900/75 backdrop-blur-md z-50 animate-in fade-in duration-300"
          onClick={handleClose} 
        />
      )}
      {isActiveNav ? (
        isMobile ? (
          <MobileNav onCloseNav={handleClose} isClosing={isClosing} />
        ) : (
          <DesktopNav onCloseNav={handleClose} isClosing={isClosing} />
        )
      ) : (
        <ClosedNavTrigger onActiveNav={handleOpen} isMobile={isMobile} />
      )}
    </>
  )
}

const DesktopNav = ({ onCloseNav, isClosing }: { onCloseNav: () => void; isClosing: boolean }) => {
  const location = useLocation()

  return (
    <div className="fixed bottom-[5%] left-0 right-0 flex justify-center items-center z-[100] pointer-events-none">
      <div className={`
        pointer-events-auto
        bg-[#1E2A5E]/90 backdrop-blur-2xl
        border border-white/10 rounded-[48px]
        px-5 py-3
        shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_0_1px_rgba(45,156,219,0.15)]
        flex items-center gap-4
        ${isClosing ? 'animate-out fade-out slide-out-to-bottom duration-300' : 'animate-in fade-in slide-in-from-bottom-5 duration-500'}
      `}>
        <div className="pr-5 border-r border-white/10 mr-1">
          <Logo size="sm" />
        </div>
        
        <div className="flex gap-2">
          {desktopLinkItems.map((item, index) => {
            const isActive = location.pathname === item.to
            return (
              <Link
                key={index}
                to={item.to}
                onClick={onCloseNav}
                className={`
                  flex flex-col items-center justify-center gap-1.5
                  w-[90px] h-[70px] rounded-2xl
                  transition-all duration-200
                  ${isActive 
                    ? 'bg-[#2D9CDB]/15 backdrop-blur-sm border border-[#2D9CDB]/20' 
                    : 'hover:bg-white/5'
                  }
                `}
                style={{ animationDelay: `${index * 0.03}s` }}
              >
                <div className="relative">
                  <item.Icon className={`
                    text-2xl transition-colors duration-200
                    ${isActive 
                      ? 'text-white drop-shadow-[0_0_6px_rgba(45,156,219,0.5)]' 
                      : 'text-[#2D9CDB] group-hover:text-white'
                    }
                  `} />
                  {isActive && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#2D9CDB] rounded-full animate-pulse" />
                  )}
                </div>
                <span className={`
                  text-[11px] font-medium tracking-wide transition-colors duration-200
                  ${isActive 
                    ? 'text-white font-semibold' 
                    : 'text-white/60 hover:text-white'
                  }
                `}>
                  {item.title}
                </span>
              </Link>
            )
          })}
        </div>

        <button
          onClick={onCloseNav}
          className="
            flex items-center gap-2 px-5 py-3 ml-2
            bg-transparent border border-white/10 rounded-full
            transition-all duration-200
            hover:bg-white/5 hover:border-white/20
            active:scale-95
            group
          "
        >
          <FiX className="text-[#2D9CDB] text-xl transition-all duration-300 group-hover:text-white group-hover:rotate-90" />
          <span className="text-sm text-white/60 transition-colors duration-200 group-hover:text-white">
            Закрыть
          </span>
        </button>
      </div>
    </div>
  )
}

const MobileNav = ({ onCloseNav, isClosing }: { onCloseNav: () => void; isClosing: boolean }) => {
  const location = useLocation()

  return (
    <div className="fixed bottom-[3%] left-0 right-0 flex justify-center items-center z-[100] pointer-events-none px-4">
      <div className={`
        pointer-events-auto w-full max-w-[400px]
        bg-[#1E2A5E]/95 backdrop-blur-2xl
        border border-white/10 rounded-3xl
        px-3 py-2
        shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_0_1px_rgba(45,156,219,0.1)]
        flex items-center justify-between gap-2
        ${isClosing 
          ? 'animate-out fade-out slide-out-to-bottom duration-300' 
          : 'animate-in fade-in slide-in-from-bottom-5 duration-500'
        }
      `}>
        <div className="flex items-center gap-1 flex-1 justify-around">
          {mobileLinkItems.map((item, index) => {
            const isActive = location.pathname === item.to
            return (
              <Link
                key={index}
                to={item.to}
                onClick={onCloseNav}
                className={`
                  flex flex-col items-center justify-center gap-1
                  flex-1 py-2 px-1 rounded-xl
                  transition-all duration-200
                  ${isActive 
                    ? 'bg-[#2D9CDB]/15 backdrop-blur-sm border border-[#2D9CDB]/20' 
                    : 'hover:bg-white/5'
                  }
                `}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <item.Icon className={`
                  text-xl transition-colors duration-200
                  ${isActive 
                    ? 'text-white drop-shadow-[0_0_6px_rgba(45,156,219,0.5)]' 
                    : 'text-[#2D9CDB]'
                  }
                `} />
                <span className={`
                  text-[10px] font-medium tracking-wide transition-colors duration-200
                  ${isActive 
                    ? 'text-white font-semibold' 
                    : 'text-white/60'
                  }
                `}>
                  {item.title}
                </span>
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#2D9CDB] rounded-full animate-pulse" />
                )}
              </Link>
            )
          })}
        </div>

        <button
          onClick={onCloseNav}
          className="
            flex items-center justify-center cursor-pointer
            w-10 h-10 min-w-[40px]
            bg-transparent border border-white/10 rounded-xl
            transition-all duration-200
            hover:bg-white/5 hover:border-white/20
            active:scale-95
            group
          "
        >
          <FiX className="text-[#2D9CDB] text-lg transition-all duration-300 group-hover:text-white group-hover:rotate-90" />
        </button>
      </div>
    </div>
  )
}

const ClosedNavTrigger = ({ onActiveNav, isMobile }: { onActiveNav: () => void; isMobile: boolean }) => {
  return (
    <button
      onClick={onActiveNav}
      className={`
        fixed z-[100] cursor-pointer bg-transparent border-none p-0
        ${isMobile ? 'bottom-5 right-5 left-auto' : 'bottom-[5%] left-[5%]'}
        animate-in fade-in slide-in-from-left-5 duration-500
      `}
    >
      <div className="relative w-14 h-14">
        <div className="absolute -inset-1 rounded-full bg-[#2D9CDB]/30 animate-ping" />
        <div className={`
          relative z-10 w-14 h-14
          flex items-center justify-center
          bg-[#1E2A5E]/95 backdrop-blur-xl
          border border-white/15 rounded-full
          transition-all duration-200
          shadow-lg
          hover:bg-[#1E2A5E] hover:border-[#2D9CDB] hover:shadow-[0_0_24px_rgba(45,156,219,0.4)]
          active:scale-95
        `}>
          <FiMenu className="text-[#2D9CDB] text-2xl transition-colors duration-200 hover:text-white" />
        </div>
      </div>
    </button>
  )
}