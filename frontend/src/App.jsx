import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Feed from './pages/Feed'
import PrivateRoute from './components/PrivateRoute'
import Profile from './pages/Profile'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
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