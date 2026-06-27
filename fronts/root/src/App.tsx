import { useSelector } from "react-redux"
import { useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import type { RootState } from "./store/store"
import { ThemeProvider } from "./components/providers/ThemeProvider"
import { DashboardLayout } from "./components/Layout/DashboardLayout"
import { useInitializeApp } from "./hooks/useInitializeApp"
import { Toaster } from "react-hot-toast"
import LoadingSpinner from "./components/UI/LoadingSpinner"
import { SignInPage } from "./pages/Signin"
import NotFound from "./pages/NotFound"
import MainPage from "./pages/Main/Main"
import UsersPage from "./pages/Users"
import ReferralLinksPage from "./pages/ReferralLink"

function MainApp() {
  const auth = useSelector((s: RootState) => s.auth)
  const {
    isCheckingAuth,
    initialized,
    error,
  } = useInitializeApp()

  useEffect(() => {
    if (error && initialized) {
      console.error("Initialization error:", error)
    }
  }, [error, initialized])

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B1A33]">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <ThemeProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
        }}
      />
      <div className="min-h-screen transition-all duration-300">
        <Routes>
          {(auth.authStatus === "auth") && auth.user ? (
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<MainPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/referral-links" element={<ReferralLinksPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          ) : (
            <>
              <Route path="/signin" element={<SignInPage />} />
              <Route path="*" element={<Navigate to="/signin" replace />} />
            </>
          )}
        </Routes>
      </div>
    </ThemeProvider>
  )
}

export default function App() {
  return (
    <Router>
      <MainApp />
    </Router>
  )
}
