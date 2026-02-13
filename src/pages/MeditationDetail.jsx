import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { X, Share2, Play, Video, Music, ChevronLeft } from 'lucide-react'

import MusicPlayer from '../components/MusicPlayer'

export default function MeditationDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { data } = useData()
    const [meditation, setMeditation] = useState(null)
    const [episodes, setEpisodes] = useState([])
    const [activeEpisode, setActiveEpisode] = useState(null)

    useEffect(() => {
        const med = data.meditations.find(m => m.id === parseInt(id))
        if (med) {
            setMeditation(med)
            const epiList = data.episodes.filter(e => e.meditation_id === parseInt(id))
            setEpisodes(epiList)
        }
    }, [id, data.meditations, data.episodes])

    const getImageUrl = (url) => {
        if (!url) return ''
        if (url.includes('drive.google.com')) {
            const idMatch = url.match(/[-\w]{25,}/)
            if (idMatch) {
                return `https://docs.google.com/uc?export=download&id=${idMatch[0]}`
            }
        }
        return url
    }

    if (!meditation) return <div className="loading">Loading...</div>

    return (
        <div className="meditation-detail-page">
            {/* Header Nav */}
            <div className="detail-header-nav">
                <button className="nav-btn" onClick={() => navigate('/')}>
                    <ChevronLeft size={24} color="white" />
                </button>
                <div className="nav-actions">
                    <button className="nav-btn">
                        <Share2 size={24} color="white" />
                    </button>
                </div>
            </div>

            {/* Hero Section */}
            <div className="detail-hero">
                <img src={getImageUrl(meditation.image)} alt={meditation.title} className="hero-bg" />
                <div className="hero-content">
                    <h1>{meditation.title}</h1>
                    <span className="episode-badge">{episodes.length} Episodes</span>
                </div>
            </div>

            {/* Episodes List Section */}
            <div className="episodes-container">
                <div className="episodes-header">
                    <h2>Total Episode ({episodes.length})</h2>
                </div>

                <div className="episodes-list">
                    {episodes.map((episode) => (
                        <div key={episode.id} className="episode-card" onClick={() => setActiveEpisode(episode)}>
                            <div className="episode-thumb-container">
                                <img src={getImageUrl(episode.image || meditation.image)} alt={episode.title} className="episode-thumb" />
                                <div className="play-overlay">
                                    <Play size={20} fill="white" />
                                </div>
                            </div>
                            <div className="episode-info">
                                <h3>{episode.title}</h3>
                                <p>{episode.description}</p>
                                <div className="episode-meta">
                                    <span className="type-badge">
                                        {episode.media_type === 'video' ? <Video size={14} /> : <Music size={14} />}
                                        {episode.media_type === 'video' ? 'Video' : 'Audio'}
                                    </span>
                                    <span style={{ marginLeft: '1rem', color: '#888', fontSize: '0.8rem' }}>{episode.duration}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Split Screen Player for Episodes */}
            <MusicPlayer
                isOpen={!!activeEpisode}
                onClose={() => setActiveEpisode(null)}
                song={activeEpisode}
                playlist={episodes}
                onSelectSong={(epi) => setActiveEpisode(epi)}
                headerTitle="Next Episodes"
                headerSubtitle={`Episodes for ${meditation.title}`}
            />

            <style>{`
                .meditation-detail-page {
                    min-height: 100vh;
                    background: #f8f9fa;
                    color: #1a1a1a;
                    padding-bottom: 2rem;
                }

                .detail-header-nav {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 10;
                    display: flex;
                    justify-content: space-between;
                    padding: 1rem;
                    background: linear-gradient(to bottom, rgba(0,0,0,0.5), transparent);
                }

                .nav-btn {
                    background: rgba(255,255,255,0.2);
                    border: none;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    backdrop-filter: blur(5px);
                }

                .detail-hero {
                    position: relative;
                    height: 50vh;
                    display: flex;
                    align-items: flex-end;
                    overflow: hidden;
                }

                .hero-bg {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .hero-content {
                    position: relative;
                    padding: 2rem;
                    width: 100%;
                    background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
                    color: white;
                }

                .hero-content h1 {
                    font-size: 2rem;
                    margin-bottom: 0.5rem;
                    font-family: 'Playfair Display', serif;
                }

                .episode-badge {
                    background: rgba(255,255,255,0.2);
                    padding: 0.4rem 1rem;
                    border-radius: 20px;
                    font-size: 0.9rem;
                    backdrop-filter: blur(5px);
                }

                .episodes-container {
                    padding: 2rem;
                    max-width: 800px;
                    margin: 0 auto;
                }

                .episodes-header h2 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin-bottom: 1.5rem;
                }

                .episodes-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .episode-card {
                    display: flex;
                    gap: 1.5rem;
                    padding: 1rem;
                    background: white;
                    border-radius: 16px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
                }

                .episode-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                }

                .episode-thumb-container {
                    position: relative;
                    width: 120px;
                    height: 120px;
                    border-radius: 12px;
                    overflow: hidden;
                    flex-shrink: 0;
                }

                .episode-thumb {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .play-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity 0.3s;
                }

                .episode-card:hover .play-overlay {
                    opacity: 1;
                }

                .episode-info {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }

                .episode-info h3 {
                    font-size: 1.1rem;
                    font-weight: 600;
                    margin-bottom: 0.4rem;
                }

                .episode-info p {
                    color: #666;
                    font-size: 0.9rem;
                    line-height: 1.4;
                    margin-bottom: 0.8rem;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .type-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.4rem;
                    padding: 0.3rem 0.8rem;
                    background: #f0f0f0;
                    border-radius: 6px;
                    font-size: 0.8rem;
                    color: #666;
                }

                .player-overlay-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.9);
                    z-index: 1000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                }

                .modal-content {
                    position: relative;
                    width: 100%;
                    max-width: 1000px;
                    aspect-ratio: 16/9;
                    background: black;
                    border-radius: 20px;
                    overflow: hidden;
                }

                .close-player {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    z-index: 11;
                    background: rgba(255,255,255,0.2);
                    border: none;
                    color: white;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                }

                .player-wrapper {
                    width: 100%;
                    height: 100%;
                }

                .audio-player-view {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    gap: 1.5rem;
                }

                .audio-player-view img {
                    width: 200px;
                    height: 200px;
                    border-radius: 20px;
                    object-fit: cover;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.5);
                }
            `}</style>
        </div>
    )
}
