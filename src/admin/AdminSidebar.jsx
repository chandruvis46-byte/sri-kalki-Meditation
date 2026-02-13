import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, FolderOpen, Layers, MonitorPlay, Sparkles, LogOut, ExternalLink, Settings } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function AdminSidebar() {
    const location = useLocation()
    const navigate = useNavigate()
    const { logout } = useAuth()

    const handleLogout = async () => {
        try {
            await logout()
            navigate('/login')
        } catch (error) {
            console.error('Failed to logout:', error)
        }
    }

    const menuItems = [
        { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/admin/categories', label: 'Categories', icon: FolderOpen },
        { path: '/admin/collections', label: 'Collections', icon: Layers },
        { path: '/admin/meditations', label: 'Meditations', icon: MonitorPlay },
        { path: '/admin/miracles', label: 'Miracles', icon: Sparkles },
        { path: '/admin/profile', label: 'Profile', icon: Settings }
    ]

    return (
        <div className="admin-sidebar">
            <div className="admin-logo">
                <img src="/Logo /Sri kalki Logo.svg" alt="Sri Kalki" />
                <h2>Admin Panel</h2>
            </div>

            <nav className="admin-nav">
                {menuItems.map(item => {
                    const Icon = item.icon
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            <span className="nav-icon"><Icon size={20} /></span>
                            <span className="nav-label">{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            <div className="admin-footer">
                <button onClick={handleLogout} className="logout-btn">
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    )
}
