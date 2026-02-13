import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { ShieldAlert, UserPlus, Lock, User, Save } from 'lucide-react'

// Sub-component for Super Admin controls
function SuperAdminSection() {
    const { createSubAdmin } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [accessType, setAccessType] = useState('admin')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    const handleCreateAdmin = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        try {
            const { error } = await createSubAdmin(email, password, accessType)
            if (error) {
                setMessage(`Error: ${error.message}`)
            } else {
                setMessage('Sub-admin created successfully!')
                setEmail('')
                setPassword('')
                setAccessType('admin')
            }
        } catch (err) {
            setMessage('An unexpected error occurred.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            marginTop: '2rem',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 0, fontSize: '1.25rem' }}>
                <ShieldAlert size={20} color="#dc2626" />
                Super Admin Controls
            </h2>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>Create new sub-admin accounts.</p>

            <form onSubmit={handleCreateAdmin} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>New Admin Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="admin@example.com"
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
                    />
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Min 6 characters"
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
                    />
                </div>
                <div style={{ flex: 1, minWidth: '150px' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Access Type</label>
                    <select
                        value={accessType}
                        onChange={(e) => setAccessType(e.target.value)}
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc', background: 'white' }}
                    >
                        <option value="admin">Admin</option>
                        <option value="super_admin">Super Admin</option>
                    </select>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="action-btn"
                    style={{ background: '#dc2626', color: 'white', border: 'none', height: '38px', cursor: 'pointer', padding: '0 1rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <UserPlus size={18} /> {loading ? 'Creating...' : 'Create Admin'}
                </button>
            </form>
            {message && <p style={{ marginTop: '1rem', color: message.startsWith('Error') ? '#dc2626' : '#16a34a', fontWeight: 500 }}>{message}</p>}
        </div>
    )
}

export default function Profile() {
    const { user, role } = useAuth()
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordMsg, setPasswordMsg] = useState('')
    const [loading, setLoading] = useState(false)

    const handlePasswordChange = async (e) => {
        e.preventDefault()
        if (newPassword !== confirmPassword) {
            setPasswordMsg('Error: Passwords do not match')
            return
        }
        if (newPassword.length < 6) {
            setPasswordMsg('Error: Password must be at least 6 characters')
            return
        }

        setLoading(true)
        setPasswordMsg('')

        try {
            const { error } = await supabase.auth.updateUser({ password: newPassword })
            if (error) throw error
            setPasswordMsg('Password updated successfully!')
            setNewPassword('')
            setConfirmPassword('')
        } catch (error) {
            setPasswordMsg(`Error: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="profile-page">
            <h1 style={{ marginBottom: '2rem' }}>Admin Profile</h1>

            {/* Profile Info Card */}
            <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                marginBottom: '2rem',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 0, fontSize: '1.25rem' }}>
                    <User size={20} /> User Information
                </h2>
                <div style={{ marginTop: '1rem', display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', color: '#666', marginBottom: '0.25rem' }}>Email</label>
                        <div style={{ fontWeight: 500 }}>{user?.email}</div>
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', color: '#666', marginBottom: '0.25rem' }}>Role</label>
                        <div style={{
                            display: 'inline-block',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '999px',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            background: role === 'super_admin' ? '#fee2e2' : '#dbeafe',
                            color: role === 'super_admin' ? '#dc2626' : '#2563eb'
                        }}>
                            {role === 'super_admin' ? 'Super Admin' : 'Admin'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Change Password Card */}
            <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 0, fontSize: '1.25rem' }}>
                    <Lock size={20} /> Change Password
                </h2>
                <form onSubmit={handlePasswordChange} style={{ maxWidth: '400px', marginTop: '1.5rem' }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
                        />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="action-btn"
                        style={{ background: 'var(--primary-color, #1a1a1a)', color: 'white', border: 'none', height: '38px', cursor: loading ? 'wait' : 'pointer', padding: '0 1.5rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <Save size={18} /> {loading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
                {passwordMsg && <p style={{ marginTop: '1rem', color: passwordMsg.startsWith('Error') ? '#dc2626' : '#16a34a', fontWeight: 500 }}>{passwordMsg}</p>}
            </div>

            {/* Super Admin Section (Only visible to super admins) */}
            {role === 'super_admin' && <SuperAdminSection />}
        </div>
    )
}
