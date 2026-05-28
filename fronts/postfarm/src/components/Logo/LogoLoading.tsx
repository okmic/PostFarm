import { useEffect, useState } from "react";
import { Logo } from "./Logo";

export const LogoLoading: React.FC<{ size?: 'sm' | 'md' | 'lg' | 'xl'; message?: string }> = ({ 
  size = 'lg', 
  message = 'Загрузка...' 
}) => {
  const [dots, setDots] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.')
    }, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-[#4CAF50]/20 via-[#FFA726]/20 to-[#4CAF50]/20 animate-pulse" />
        
        <div className="absolute -inset-2 rounded-full border-2 border-dashed border-[#FFA726]/30 animate-spin" />
        
        <div className="relative animate-pulse">
          <Logo variant="icon" size={size} />
        </div>
        
        <div className="absolute -inset-6">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#FFA726] rounded-full animate-bounce" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#4CAF50] rounded-full animate-bounce delay-150" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-[#FFA726] rounded-full animate-bounce delay-300" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-[#4CAF50] rounded-full animate-bounce delay-450" />
        </div>
      </div>
      
      <div className="flex flex-col items-center gap-2">
        <div className={`font-medium text-white/60`}>
          {message}
          <span className="inline-block w-6 text-left">{dots}</span>
        </div>
        
        <div className="w-32 h-0.5 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full w-full bg-gradient-to-r from-[#FFA726] to-[#4CAF50] rounded-full animate-[loading_1.5s_ease-in-out_infinite]" 
               style={{
                 animation: 'loading 1.5s ease-in-out infinite'
               }} 
          />
        </div>
      </div>

      <style>{`
        @keyframes loading {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  )
}

export const SimpleLogoLoading: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <div className="animate-spin rounded-full border-2 border-[#FFA726]/20 border-t-[#FFA726] w-12 h-12" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Logo variant="icon" size="sm" />
        </div>
      </div>
      <div className="flex gap-1">
        <div className="w-1.5 h-1.5 bg-[#FFA726] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-1.5 h-1.5 bg-[#4CAF50] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-1.5 h-1.5 bg-[#FFA726] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  )
}