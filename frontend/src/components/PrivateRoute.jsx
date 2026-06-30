import { useUser } from '../context/UserContext'
import { Navigate } from 'react-router-dom'

function PrivateRoute({ children }) {
  const { token } = useUser()

  if (!token) {
    return <Navigate to="/login" />
  }

  return children
}

export default PrivateRoute

