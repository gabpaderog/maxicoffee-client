import { Navigate, Outlet } from 'react-router'

const isAuthenticated = () => {
  return localStorage.getItem('accessToken')
}

export default function PublicLayout() {
  return isAuthenticated() ? <Navigate to="/" /> : <Outlet />
}
