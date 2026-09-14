import { Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import { RequireAuth } from './components/RequireAuth'
import { WelcomePage } from './features/onboarding/WelcomePage'
import { FeedPage } from './features/feed/FeedPage'
import { PostDetailPage } from './features/post/PostDetailPage'
import { PostCreatePage } from './features/post/PostCreatePage'
import { ProfilePage } from './features/profile/ProfilePage'
import { SchoolEmailVerifyPage} from './features/auth/SchoolEmailVerifyPage'
import { AuthRedirectPage } from './features/auth/AuthRedirectPage'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/verifyEmail" element={<SchoolEmailVerifyPage />} />
        <Route path="/auth/callback/naver" element={<AuthRedirectPage />} />

        <Route element={<RequireAuth />}>
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/post/new" element={<PostCreatePage />} />
          <Route path="/post/:postId" element={<PostDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
