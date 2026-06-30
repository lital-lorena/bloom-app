import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Feed from './pages/Feed'
import PrivateRoute from './components/PrivateRoute'
import Profile from './pages/Profile'
import Landing from './pages/Landing'
import SobreBloom from './pages/SobreBloom'
import PublicProfile from './pages/PublicProfile'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Landing />} />
      <Route path="/sobre-bloom" element={<SobreBloom />} />
      <Route path="/usuario/:id" element={<PublicProfile />} />
      <Route path="/feed" element={<PrivateRoute>
        <Feed />
      </PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute>
        <Profile />
      </PrivateRoute>} />
    </Routes>
  )
}

export default App