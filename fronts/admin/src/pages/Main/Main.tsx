import "./styles.css"

export default function MainPage() {
  return (
    <div className="flex flex-col items-center justify-start overflow-hidden">

      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 24px 24px, #4CAF50 2px, transparent 0)`,
            backgroundSize: '48px 48px'
          }}
        />
      </div>

      <div className="relative z-10 text-center max-w-3xl">
        <div className="flex items-center justify-center gap-3 mb-12">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 rounded-full bg-gradient-to-t from-[#4CAF50]/50 to-[#FFA726]/50 origin-bottom animate-grow"
              style={{
                animationDelay: `${i * 0.2}s`,
                height: `${56 + i * 20}px`
              }}
            />
          ))}
        </div>

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
    </div>
  )
}