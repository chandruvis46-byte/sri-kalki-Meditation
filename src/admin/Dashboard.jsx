import { useData } from '../context/DataContext'
import { FolderOpen, Layers, MonitorPlay, Sparkles, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'


export default function Dashboard() {
    const { data } = useData()

    const stats = [
        { label: 'Categories', value: data.categories.length, icon: FolderOpen, color: '#4F46E5', bg: '#EEF2FF' },
        { label: 'Collections', value: data.collections.length, icon: Layers, color: '#0EA5E9', bg: '#E0F2FE' },
        { label: 'Meditations', value: data.meditations.length, icon: MonitorPlay, color: '#8B5CF6', bg: '#F3E8FF' },
        { label: 'Miracles', value: data.miracles.length, icon: Sparkles, color: '#F59E0B', bg: '#FEF3C7' }
    ]

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>Welcome to Sri Kalki Admin Panel</p>
                </div>
            </div>

            <div className="stats-grid">
                {stats.map(stat => {
                    const Icon = stat.icon
                    return (
                        <div key={stat.label} className="stat-card">
                            <div className="stat-info">
                                <h3>{stat.value}</h3>
                                <p>{stat.label}</p>
                            </div>
                            <div className="stat-icon" style={{ backgroundColor: stat.color, color: 'white' }}>
                                <Icon size={24} />
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="recent-activity">
                <h2>Quick Actions</h2>
                <div className="quick-actions">
                    <Link to="/admin/categories" className="action-btn">
                        <Plus size={18} /> Add Category
                    </Link>
                    <Link to="/admin/collections" className="action-btn">
                        <Plus size={18} /> Add Collection
                    </Link>
                    <Link to="/admin/meditations" className="action-btn">
                        <Plus size={18} /> Add Meditation
                    </Link>
                    <Link to="/admin/miracles" className="action-btn">
                        <Plus size={18} /> Add Miracle
                    </Link>
                </div>
            </div>

            <div className="overview-section">
                <h2>Content Overview</h2>
                <div className="overview-grid">
                    <div className="overview-card">
                        <h3>Recent Categories <FolderOpen size={18} /></h3>
                        <ul>
                            {data.categories.slice(0, 3).map(cat => (
                                <li key={cat.id}>{cat.name}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="overview-card">
                        <h3>Recent Collections <Layers size={18} /></h3>
                        <ul>
                            {data.collections.slice(0, 3).map(col => (
                                <li key={col.id}>{col.title} - {col.sessions} sessions</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
