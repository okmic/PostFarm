"use client";

import Nav from './components/Nav/Nav';
import { ThemeProvider, useTheme } from './components/providers/ThemeProvider';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();

  return (
    <div
      className="relative min-h-screen w-full font-inter"
      style={{
        backgroundColor: colors.background,
        color: colors.text
      }}
    >
      <div className="flex-1 flex flex-col">
        <div className="pt-[env(safe-area-inset-top)]" />
        <main className="flex-1">
          <div
            className="min-w-fit px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-10"
            style={{
              paddingLeft: 'max(env(safe-area-inset-left, 16px), 1rem)',
              paddingRight: 'max(env(safe-area-inset-right, 16px), 1rem)'
            }}
          >
            {children}
            {/* Отступ под навбар - зависит от ширины экрана */}
            <div className="h-[72px] md:h-20 lg:h-24" />
          </div>
        </main>
      </div>

      <Nav />
    </div>
  );
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <LayoutContent>{children}</LayoutContent>
    </ThemeProvider>
  );
}