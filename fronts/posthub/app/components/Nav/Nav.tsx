"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FaUserCircle, FaChartLine } from "react-icons/fa";
import { MdOutlineSocialDistance } from "react-icons/md";
import { Logo } from "../Logo/Logo";

const navItems = [
  { href: "/services", title: "Сервисы", Icon: MdOutlineSocialDistance },
  { href: "/stats", title: "Статистика", Icon: FaChartLine },
  { href: "/settings", title: "Настройки", Icon: FaUserCircle },
];

const BREAKPOINT = 900;

export default function Nav() {
  const [isWide, setIsWide] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
    const handleResize = () => setIsWide(window.innerWidth >= BREAKPOINT);
    
    handleResize();
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isMounted) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-[100] flex justify-center pointer-events-none">
        <div className="pointer-events-auto bg-[#1E3A1E]/95 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_0_1px_rgba(76,175,80,0.1)] transition-all duration-300 ease-out max-w-[500px] rounded-[48px] mb-4 px-5 py-3 flex items-center gap-4">

          <div className="flex items-center gap-2 flex-1 justify-center">
            <div className="w-[90px] h-[68px]" />
            <div className="w-[90px] h-[68px]" />
            <div className="w-[90px] h-[68px]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] flex justify-center pointer-events-none px-8 md:px-12 lg:px-16">
      <div
        className={`
          pointer-events-auto
          bg-[#1E3A1E]/95 backdrop-blur-2xl
          border border-white/10
          shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_0_1px_rgba(76,175,80,0.1)]
          transition-all duration-300 ease-out
          ${isWide 
            ? 'max-w-[500px] rounded-[48px] mb-4 px-5 py-3 flex items-center gap-4' 
            : 'w-full max-w-full rounded-t-3xl rounded-b-none px-3 py-2 pb-[env(safe-area-inset-bottom,12px)] flex items-center justify-around'
          }
        `}
      >
        <div
          className={`
            flex items-center
            ${isWide ? 'gap-2 flex-1 justify-center' : 'w-full justify-around'}
          `}
        >
          {navItems.map(({ href, title, Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`
                  flex flex-col items-center justify-center gap-1
                  rounded-xl transition-all duration-200
                  ${isWide ? 'w-[90px] h-[68px]' : 'flex-1 py-2 px-1'}
                  ${isActive 
                    ? 'bg-[#4CAF50]/15 border border-[#4CAF50]/20' 
                    : 'border border-transparent hover:bg-[#4CAF50]/10 hover:border-[#4CAF50]/10'
                  }
                `}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon
                  className={`
                    transition-all duration-200
                    ${isWide ? 'text-2xl' : 'text-xl'}
                    ${isActive 
                      ? 'text-white drop-shadow-[0_0_6px_rgba(76,175,80,0.5)]' 
                      : 'text-[#4CAF50]'
                    }
                  `}
                />
                <span
                  className={`
                    font-medium tracking-wide transition-all duration-200
                    ${isWide ? 'text-[11px]' : 'text-[10px]'}
                    ${isActive 
                      ? 'text-white font-semibold' 
                      : 'text-white/60'
                    }
                  `}
                >
                  {title}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}