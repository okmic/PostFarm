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
import NotFound from "./pages/NotFound"
import ServicePage from "./pages/Services"
import MainPage from "./pages/Main/Main"
import ViralHeadlinesService from "./pages/Services/ViralHeadlinesService"
import EducationPostsService from "./pages/Services/EducationPostsService"
import PostChronicleService from "./pages/Services/PostChronicleService"
import ChannelContentService from "./pages/Services/ChannelContentService"

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
          {auth.authStatus === "auth" && auth.user ? (
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
              <Route path="/services/channel-content" element={<ChannelContentService />} />
              <Route path="/services/viral-headlines" element={<ViralHeadlinesService />} />
              <Route path="/services/education-posts" element={<EducationPostsService />} />
              <Route path="/services/post-chronicle" element={<PostChronicleService />} />
              <Route path="/settings" element={<UserSettingsPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          ) : (
            <>
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/signup" element={<SignUpPage />} />
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
