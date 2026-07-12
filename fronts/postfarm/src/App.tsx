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
import { SignUpPage } from "./pages/Signup"
import UserSettingsPage from "./pages/Settings"
import ServicePage from "./pages/Services"
import MainPage from "./pages/Main/Main"
import ViralHeadlinesService from "./pages/Services/ViralHeadlinesService"
import EducationPostsService from "./pages/Services/EducationPostsService"
import PostChronicleService from "./pages/Services/PostChronicleService"
import ChannelContentService from "./pages/Services/ChannelContentService"
import StatsPage from "./pages/Stats"
import AILimitIsOverPage from "./pages/AILimitIsOver"
import { SignUpVerify } from "./pages/SignupVerify"

function MainApp() {
  const auth = useSelector((s: RootState) => s.auth)
  const aiLimitIsOver = useSelector((s: RootState) => s.tenantStore.aiLimitIsOver)
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
      <div className="min-h-screen flex items-center justify-center">
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

              {auth.user.role === "admin" && (
                <>

                </>
              )}

              {auth.user.role === "user" && (
                <>
                </>
              )}

              <Route path="/" element={<MainPage />} />
              <Route path="/services" element={<ServicePage />} />
              {
                aiLimitIsOver
                  ? <>
                    <Route path="/services/channel-content" element={<AILimitIsOverPage />} />
                    <Route path="/services/viral-headlines" element={<AILimitIsOverPage />} />
                    <Route path="/services/education-posts" element={<AILimitIsOverPage />} />
                    <Route path="/services/post-chronicle" element={<AILimitIsOverPage />} />
                  </>
                  : <>
                    <Route path="/services/channel-content" element={<ChannelContentService />} />
                    <Route path="/services/viral-headlines" element={<ViralHeadlinesService />} />
                    <Route path="/services/education-posts" element={<EducationPostsService />} />
                    <Route path="/services/post-chronicle" element={<PostChronicleService />} />
                  </>
              }
              <Route path="/settings" element={<UserSettingsPage />} />
              <Route path="/stats" element={<StatsPage />} />
              <Route path="/ai-limit" element={<AILimitIsOverPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          ) : (
            <>
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/signup/:refCode" element={<SignUpPage />} />
              <Route path="/signup/verify/:code" element={<SignUpVerify />} />
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
