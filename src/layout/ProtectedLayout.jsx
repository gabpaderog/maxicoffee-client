
import { Navigate, Outlet } from 'react-router'

const isAuthenticated = () => {
  return localStorage.getItem('accessToken')
}

export default function ProtectedLayout() {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/signin" />
}
