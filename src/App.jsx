import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { DataProvider, useData } from './context/DataContext'
import { AuthProvider } from './context/AuthContext'
import AdminRoute from './components/AdminRoute'

// Main site components
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Categories from './components/Categories'
import TrendingCollection from './components/TrendingCollection'
import MeditationSection from './components/MeditationSection'
import MiraclesSection from './components/MiraclesSection'
import Footer from './components/Footer'
import MusicPlayer from './components/MusicPlayer'

// Pages
import MeditationDetail from './pages/MeditationDetail'
import Login from './pages/Login'

// Admin components
import AdminLayout from './admin/AdminLayout'
import Dashboard from './admin/Dashboard'
import Profile from './admin/Profile' // New import
import CategoryManager from './admin/CategoryManager'
import CollectionManager from './admin/CollectionManager'
import MeditationManager from './admin/MeditationManager'
import MiracleManager from './admin/MiracleManager'
import SiteManager from './admin/SiteManager'

function MainSite() {
    const { data, searchQuery } = useData()
    const [isPlayerOpen, setIsPlayerOpen] = useState(false)
    const [currentSong, setCurrentSong] = useState(null)

    const openPlayer = (song) => {
        if (song) {
            setCurrentSong(song)
        }
        setIsPlayerOpen(true)
    }

    const closePlayer = () => {
        setIsPlayerOpen(false)
    }

    // Filter logic for "No results" check
    const hasResults =
        (data.collections?.some(c => c.title.toLowerCase().includes(searchQuery.toLowerCase())) ?? false) ||
        (data.meditations?.some(m =>
            m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.description.toLowerCase().includes(searchQuery.toLowerCase())
        ) ?? false) ||
        (data.miracles?.some(m =>
            m.quote?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.artist?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.title?.toLowerCase().includes(searchQuery.toLowerCase())
        ) ?? false)

    return (
        <>
            <Navbar />
            <main>
                <Hero />
                <Categories />

                {searchQuery && !hasResults ? (
                    <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#888' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No results found for "{searchQuery}"</h2>
                    </div>
                ) : (
                    <>
                        <TrendingCollection />
                        <MeditationSection />
                        <MiraclesSection onCardClick={openPlayer} />
                    </>
                )}
            </main>
            <Footer />
            <MusicPlayer
                isOpen={isPlayerOpen}
                onClose={closePlayer}
                song={currentSong}
                miracles={data.miracles}
                onSelectSong={openPlayer}
            />
        </>
    )
}

function App() {
    return (
        <AuthProvider>
            <DataProvider>
                <BrowserRouter>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<MainSite />} />
                        <Route path="/meditation/:id" element={<MeditationDetail />} />
                        <Route path="/login" element={<Login />} />

                        {/* Protected Admin Routes */}
                        <Route element={<AdminRoute />}>
                            <Route path="/admin" element={<AdminLayout />}>
                                <Route index element={<Dashboard />} />
                                <Route path="categories" element={<CategoryManager />} />
                                <Route path="collections" element={<CollectionManager />} />
                                <Route path="meditations" element={<MeditationManager />} />
                                <Route path="miracles" element={<MiracleManager />} />
                                <Route path="site-settings" element={<SiteManager />} />
                                <Route path="profile" element={<Profile />} />
                            </Route>
                        </Route>
                    </Routes>
                </BrowserRouter>
            </DataProvider>
        </AuthProvider>
    )
}

export default App
