import { Link } from "react-router-dom"
import { FiArrowRight, FiZap } from "react-icons/fi"
import "./styles.css"

export default function MainPage() {
    return (
        <div className="flex flex-col items-center justify-start overflow-hidden">

            <div className="relative z-10 text-center w-full max-w-3xl flex-1 flex flex-col justify-center px-4">

                <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-[-0.03em] leading-[1.1] sm:leading-tight">
                    <span className="text-white">Выращиваем </span>
                    <span className="text-[#4CAF50]">контент</span>
                    <span className="text-white">.</span>
                    <br />
                    <span className="text-[#FFA726]">Автоматически</span>
                    <span className="text-white">.</span>
                </h1>

                <p className="mt-6 sm:mt-8 text-sm text-white/20 font-light max-w-md mx-auto leading-relaxed px-2">
                    AI-инструменты для создания постов, заголовков и идей.
                    Генерируйте контент для Telegram-каналов за секунды.
                </p>

                <div className="mt-8 sm:mt-12 flex flex-col items-center gap-4">
                    <Link
                        to="/services"
                        className="group relative inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-[#4CAF50] to-[#FFA726] text-white font-semibold text-sm sm:text-base lg:text-lg transition-all duration-300 hover:shadow-[0_0_32px_rgba(76,175,80,0.3)] hover:-translate-y-0.5 active:scale-[0.98]"
                    >
                        <FiZap className="text-base sm:text-lg transition-transform duration-300 group-hover:rotate-12" />
                        <span>Начать создавать контент</span>
                        <FiArrowRight className="text-base sm:text-lg transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>

                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                        <div className="flex items-center gap-1.5">
                            <div className="flex -space-x-1.5">
                                <div className="w-5 h-5 rounded-full bg-[#4CAF50]/30 border border-[#1E3A1E] flex items-center justify-center">
                                    <span className="text-[8px] font-bold text-[#4CAF50]">K</span>
                                </div>
                                <div className="w-5 h-5 rounded-full bg-[#FFA726]/30 border border-[#1E3A1E] flex items-center justify-center">
                                    <span className="text-[8px] font-bold text-[#FFA726]">M</span>
                                </div>
                                <div className="w-5 h-5 rounded-full bg-white/10 border border-[#1E3A1E] flex items-center justify-center">
                                    <span className="text-[8px] font-bold text-white/40">+</span>
                                </div>
                            </div>
                            <span className="text-[11px] text-white/15 font-light">
                                Уже создают контент
                            </span>
                        </div>
                        
                        <span className="hidden sm:block w-1 h-1 rounded-full bg-white/10" />
                        
                        <span className="text-[11px] text-white/15 font-light">
                            Первый пост за минуту
                        </span>
                    </div>
                </div>

                <div className="mt-12 sm:mt-16 flex items-center justify-center gap-3">
                    <div className="w-10 sm:w-16 h-[1px] bg-gradient-to-r from-transparent to-white/10" />
                    <span className="text-[9px] sm:text-[10px] text-white/10 uppercase tracking-[0.2em] font-light whitespace-nowrap">AI-Powered</span>
                    <div className="w-10 sm:w-16 h-[1px] bg-gradient-to-l from-transparent to-white/10" />
                </div>
            </div>

            <div className="relative z-10 w-full pb-6 sm:pb-8 mt-10 sm:mt-[50px]">
                <div className="w-full max-w-[280px] sm:max-w-md mx-auto mb-4 sm:mb-6">
                    <div className="h-px bg-gradient-to-r from-transparent via-[#4CAF50]/40 to-transparent" />
                </div>

                <div className="text-center mt-4 sm:mt-5">
                    <a
                        className="group inline-flex items-center gap-2 text-xs sm:text-sm md:text-base font-medium transition-all duration-300"
                        target="_blank"
                        href="https://miconext.github.io/Mico/"
                    >
                        <span className="text-white/40 font-light tracking-wide">Создано</span>
                        <span className="text-white/60 font-bold tracking-tight bg-white/5 px-2 py-0.5 rounded-md group-hover:bg-white/10 transition-all">
                            M<span className="text-[#8b5cf6]">ico</span>
                        </span>
                    </a>

                    <div className="mt-4 sm:mt-5 w-full max-w-[280px] sm:max-w-md mx-auto mb-4 sm:mb-6">
                        <div className="h-px bg-gradient-to-r from-transparent via-[#4CAF50]/40 to-transparent" />
                    </div>
                </div>
            </div>
        </div>
    )
}
