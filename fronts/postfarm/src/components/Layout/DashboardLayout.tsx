import React, { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useTheme } from '../providers/ThemeProvider'
import Nav from '../Nav/Nav'
import { Logo } from '../Logo/Logo'

export const DashboardLayout: React.FC = () => {
  const { colors } = useTheme()
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" as ScrollBehavior })
  }, [pathname])


  return (
    <div 
      className="relative min-h-screen w-full font-inter flex flex-col lg:flex-row"
      style={{ 
        backgroundColor: colors.background,
        color: colors.text
      }}
    >
      <div className="flex-1 flex flex-col w-full lg:w-[calc(100%-300px)] relative">
        <div className="pt-[env(safe-area-inset-top)]" />
        <div className='py-[30px] w-screen flex justify-center items-center'>
          <Logo size='xl' />
        </div>
        <main className="flex-1">
          <div 
            className="min-w-fit px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-10"
            style={{
              paddingLeft: 'max(env(safe-area-inset-left, 16px), 1rem)',
              paddingRight: 'max(env(safe-area-inset-right, 16px), 1rem)'
            }}
          >
            <Outlet />
            <Nav />
            <div className='mb-[300px]' />
          </div>
        </main>
      </div>
    </div>
  )
}