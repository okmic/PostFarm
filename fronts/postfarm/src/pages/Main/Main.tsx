import "./styles.css"

export default function MainPage() {
    return (
        <div className="flex flex-col items-center justify-start overflow-hidden">

            <div className="relative z-10 text-center max-w-3xl flex-1 flex flex-col justify-center">


                <h1 className="text-4xl lg:text-6xl xl:text-7xl font-black tracking-[-0.03em] leading-tight">
                    <span className="text-white">Выращиваем </span>
                    <span className="text-[#4CAF50]">контент</span>
                    <span className="text-white">.</span>
                    <br />
                    <span className="text-[#FFA726]">Автоматически</span>
                    <span className="text-white">.</span>
                </h1>

                <div className="mt-10 flex items-center justify-center gap-3">
                    <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#4CAF50]/30" />
                    <div className="flex gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4CAF50]/50" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FFA726]/50" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4CAF50]/30" />
                    </div>
                    <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#FFA726]/30" />
                </div>
            </div>

            <div className="relative z-10 w-full pb-8 mt-[50px]">
                <div className="w-full max-w-md mx-auto mb-6">
                    <div className="h-px bg-gradient-to-r from-transparent via-[#4CAF50]/40 to-transparent" />
                </div>

                <div className="text-center mt-5">
                    <a
                        className="group inline-flex items-center gap-2 text-sm md:text-base font-medium transition-all duration-300"
                        target="_blank"
                        href="https://miconext.github.io/MicoNext/"
                    >
                        <span className="text-white font-semibold tracking-wide">сделано в</span>
                        <span className="text-[#fff] font-bold tracking-tight bg-white/5 px-2 py-0.5 rounded-md group-hover:bg-white/10 transition-all">
                            Mico<span className="text-[#8b5cf6]">Next</span>
                        </span>
                    </a>

                    <p className="text-[10px] md:text-xs text-white/25 mt-2 tracking-wide">
                        команда разработчиков сервисов для автоматического выращивания контента
                    </p>

                    <div className="mt-5 w-full max-w-md mx-auto mb-6">
                        <div className="h-px bg-gradient-to-r from-transparent via-[#4CAF50]/40 to-transparent" />
                    </div>
                </div>
            </div>
        </div>
    )
}