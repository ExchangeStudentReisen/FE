import { Routes, Route, Navigate } from 'react-router-dom'
import { WelcomePage } from './features/onboarding/WelcomePage'
import { FeedPage } from './features/feed/FeedPage'
import { SearchPage } from './features/search/SearchPage'
import { PostDetailPage } from './features/post/PostDetailPage'
import { PostCreatePage } from './features/post/PostCreatePage'
import { ProfilePage } from './features/profile/ProfilePage'
import { SchoolEmailVerifyPage} from './features/auth/SchoolEmailVerifyPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/feed" element={<FeedPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/post/new" element={<PostCreatePage />} />
      <Route path="/post/:id" element={<PostDetailPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/onboarding/school" element={<SchoolEmailVerifyPage />} />
    </Routes>
  )
}

export default App
