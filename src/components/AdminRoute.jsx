import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminRoute() {
    const { user, loading } = useAuth()

    if (loading) {
        return <div style={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>Loading...</div>
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return <Outlet />
}
