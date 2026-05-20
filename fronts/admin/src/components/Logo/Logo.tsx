import React from 'react'

interface MasterBotLogoProps {
  variant?: 'full' | 'icon' | 'wordmark'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeMap = {
  sm: { icon: 40, text: 'text-xl', subtitle: 'text-[8px]', gap: 'gap-2' },
  md: { icon: 56, text: 'text-2xl', subtitle: 'text-[10px]', gap: 'gap-3' },
  lg: { icon: 80, text: 'text-4xl', subtitle: 'text-[11px]', gap: 'gap-4' },
  xl: { icon: 112, text: 'text-6xl', subtitle: 'text-[13px]', gap: 'gap-5' },
}

const PureIcon: React.FC<{ size: number; className?: string }> = ({ size, className = '' }) => {
  const w = size
  const h = size * 0.85
  const strokeW = Math.max(1.5, w * 0.04)
  const eyeSize = w * 0.1
  const eyeY = h * 0.42

  return (
    <div className={className} style={{ width: w, height: h }}>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full h-full"
        style={{ display: 'block' }}
      >
        <polygon
          points={`0,${h * 0.35} ${w / 2},0 ${w / 2},${h} 0,${h * 0.65}`}
          fill="rgba(255,255,255,0.08)"
          stroke="#FFFFFF"
          strokeWidth={strokeW}
          strokeLinejoin="round"
        />
        
        <polygon
          points={`${w},${h * 0.35} ${w / 2},0 ${w / 2},${h} ${w},${h * 0.65}`}
          fill="rgba(255,255,255,0.18)"
          stroke="#FFFFFF"
          strokeWidth={strokeW}
          strokeLinejoin="round"
        />
        
        <line
          x1={w / 2}
          y1={0}
          x2={w / 2}
          y2={h}
          stroke="#FFFFFF"
          strokeWidth={strokeW}
          strokeLinecap="round"
        />

        <rect
          x={w * 0.28}
          y={eyeY}
          width={eyeSize}
          height={eyeSize * 0.9}
          rx={eyeSize * 0.2}
          fill="#FFFFFF"
        />
        
        <rect
          x={w * 0.62}
          y={eyeY}
          width={eyeSize}
          height={eyeSize * 0.9}
          rx={eyeSize * 0.2}
          fill="#FFFFFF"
        />
      </svg>
    </div>
  )
}

export const MasterBotIcon: React.FC<{ size?: 'sm' | 'md' | 'lg' | 'xl'; className?: string }> = ({ 
  size = 'xl', 
  className = '' 
}) => {
  const { icon } = sizeMap[size]
  return (
    <div className={`flex justify-center ${className}`}>
      <PureIcon size={icon} />
    </div>
  )
}

export const Logo: React.FC<MasterBotLogoProps> = ({
  variant = 'full',
  size = 'lg',
  className = '',
}) => {
  const { icon, text, subtitle, gap } = sizeMap[size]

  if (variant === 'icon') {
    return (
      <div className={`flex justify-center ${className}`}>
        <PureIcon size={icon} />
      </div>
    )
  }

  if (variant === 'wordmark') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        <span className={`font-black tracking-[-0.02em] text-white ${text} leading-none`}>
          MBOT
        </span>
        <span className={`font-mono tracking-[0.3em] text-white/40 ${subtitle} mt-1`}>
          CONSTRUCTOR
        </span>
      </div>
    )
  }

  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      <PureIcon size={icon} />
      <div className={`flex flex-col items-center mt-${gap.replace('gap-', '')}`}>
        <span className={`font-black tracking-tight text-white ${text} leading-none`}>
          M<span className="text-[#FFD700]">B</span>OT
        </span>
        <span className={`font-mono tracking-[0.3em] text-white/40 ${subtitle} mt-0.5`}>
          CONSTRUCTOR
        </span>
      </div>
    </div>
  )
}

export const LoadingLogo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'lg' }) => {
  const sizes = { sm: 48, md: 64, lg: 88 }
  const iconSize = sizes[size]

  return (
    <div className="relative flex flex-col items-center">
      <PureIcon size={iconSize} />
      <div className="flex gap-1 mt-4">
        <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" />
        <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:0.15s]" />
        <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:0.3s]" />
      </div>
    </div>
  )
}