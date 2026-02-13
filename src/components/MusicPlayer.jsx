import { useState, useEffect, useRef } from 'react'

export default function MusicPlayer({
    isOpen,
    onClose,
    song,
    playlist = [],
    onSelectSong,
    headerTitle = "More Miracles",
    headerSubtitle = "List of all miracles"
}) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [progress, setProgress] = useState(0)
    const [currentTime, setCurrentTime] = useState('00:00')
    const [duration, setDuration] = useState('00:00')
    const audioRef = useRef(null)

    // Convert Google Drive view link to direct image link
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

    // Convert Google Drive view link to download link
    const getAudioUrl = (url) => {
        if (!url) return ''
        // Check if it's a Google Drive link
        if (url.includes('drive.google.com')) {
            // Extract file ID
            const idMatch = url.match(/[-\w]{25,}/)
            if (idMatch) {
                return `https://docs.google.com/uc?export=download&id=${idMatch[0]}`
            }
        }
        return url
    }

    // Helper to format time (seconds -> MM:SS)
    const formatTime = (time) => {
        if (!time || isNaN(time)) return '00:00'
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    }

    // Extract YouTube ID from URL
    const getYouTubeId = (url) => {
        if (!url) return null
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
        const match = url.match(regExp)
        return (match && match[2].length === 11) ? match[2] : null
    }

    const videoId = getYouTubeId(song?.youtubelink || song?.media_url)
    const isVideo = !!videoId || song?.media_type === 'video'
    const isAudio = (!!song?.audio || (song?.media_type === 'audio' && !!song?.media_url)) && !getYouTubeId(song?.media_url || song?.youtubelink)

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
            if (isAudio && audioRef.current) {
                audioRef.current.play().catch(e => console.log('Autoplay prevented', e))
                setIsPlaying(true)
            }
        } else {
            document.body.style.overflow = ''
            setIsPlaying(false)
            if (audioRef.current) {
                audioRef.current.pause()
                audioRef.current.currentTime = 0
            }
        }
        setProgress(0)
        setCurrentTime('00:00')

        return () => {
            document.body.style.overflow = ''
        }
    }, [isOpen, song, isAudio])

    const handlePlayPause = () => {
        if (isAudio && audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause()
            } else {
                audioRef.current.play()
            }
            setIsPlaying(!isPlaying)
        }
    }

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            const current = audioRef.current.currentTime
            const total = audioRef.current.duration
            setProgress((current / total) * 100)
            setCurrentTime(formatTime(current))
            setDuration(formatTime(total))
        }
    }

    const handleProgressClick = (e) => {
        if (isAudio && audioRef.current) {
            const rect = e.currentTarget.getBoundingClientRect()
            const clickX = e.clientX - rect.left
            const percentage = (clickX / rect.width)
            audioRef.current.currentTime = percentage * audioRef.current.duration
        }
    }

    const handleBackgroundClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose()
        }
    }

    if (!isOpen || !song) return null

    return (
        <div className={`music-player-modal ${isOpen ? 'active' : ''}`} onClick={handleBackgroundClick}>
            <button className="player-close" onClick={onClose}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            <div className="player-split-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(350px, 400px)', height: '100vh', background: '#0a0a0a' }}>
                {/* Left Section: Player Content */}
                <div className="player-section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: isVideo ? '1rem' : '2rem', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
                    <div className="player-header" style={{ marginBottom: isVideo ? '1rem' : '2rem', textAlign: 'center' }}>
                        <span className="player-title" style={{ color: '#888', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem' }}>{isVideo ? 'Watching' : 'Now Playing'}</span>
                    </div>

                    <div className="player-content" style={{ width: '100%', maxWidth: isVideo ? '900px' : '500px' }}>
                        {isVideo ? (
                            <div className="video-container" style={{ width: '100%', aspectRatio: '16/9', borderRadius: '16px', overflow: 'hidden', marginBottom: isVideo ? '1rem' : '2rem', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${videoId || getYouTubeId(song.media_url)}?autoplay=1`}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        ) : (
                            <div className="album-art" style={{ width: '100%', aspectRatio: '1/1', borderRadius: '20px', overflow: 'hidden', marginBottom: '2rem', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
                                <img src={getImageUrl(song.image)} alt="Album Art" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                        )}

                        <div className="song-info" style={{ textAlign: 'center', marginBottom: isVideo ? '1rem' : '2rem' }}>
                            <h3 style={{ color: 'white', fontSize: isVideo ? '1.5rem' : '1.8rem', marginBottom: '0.5rem', fontWeight: '600' }}>{song.title}</h3>
                            <p style={{ color: '#888', fontSize: isVideo ? '1rem' : '1.1rem' }}>{song.artist || song.description}</p>
                        </div>

                        {/* Audio Controls (Only show if not video) */}
                        {isAudio && (
                            <>
                                <audio
                                    ref={audioRef}
                                    src={getAudioUrl(song.audio || song.media_url)}
                                    onTimeUpdate={handleTimeUpdate}
                                    onEnded={() => setIsPlaying(false)}
                                />
                                <div className="progress-section" style={{ marginBottom: '2rem' }}>
                                    <div className="progress-bar" onClick={handleProgressClick} style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', cursor: 'pointer', marginBottom: '1rem', position: 'relative' }}>
                                        <div className="progress-fill" style={{ width: `${progress}%`, height: '100%', background: 'white', borderRadius: '3px', transition: 'width 0.1s linear' }}></div>
                                    </div>
                                    <div className="time-labels" style={{ display: 'flex', justifyContent: 'space-between', color: '#888', fontSize: '0.9rem' }}>
                                        <span>{currentTime}</span>
                                        <span>{duration}</span>
                                    </div>
                                </div>

                                <div className="player-controls" style={{ display: 'flex', justifyContent: 'center' }}>
                                    <button className="control-btn play-btn" onClick={handlePlayPause} style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}>
                                        {!isPlaying ? (
                                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M6 4L20 12L6 20V4Z" fill="black" />
                                            </svg>
                                        ) : (
                                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M6 4H10V20H6V4Z" fill="black" />
                                                <path d="M14 4H18V20H14V4Z" fill="black" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Right Section: Items List */}
                <div className="miracles-section-player" style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', overflowY: 'auto' }}>
                    <div className="miracles-header" style={{ marginBottom: '2rem' }}>
                        <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>{headerTitle}</h2>
                        <p style={{ color: '#888', fontSize: '0.9rem' }}>{headerSubtitle}</p>
                    </div>
                    <div className="miracles-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {playlist.map((item) => (
                            <div
                                key={item.id}
                                className={`miracle-item ${item.id === song?.id ? 'active' : ''}`}
                                onClick={() => onSelectSong(item)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '1rem',
                                    borderRadius: '12px',
                                    background: item.id === song?.id ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    border: item.id === song?.id ? '1px solid rgba(255,255,255,0.2)' : '1px solid transparent'
                                }}
                            >
                                <img
                                    src={getImageUrl(item.image)}
                                    alt={item.title}
                                    style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }}
                                />
                                <div className="miracle-item-info" style={{ flex: 1 }}>
                                    <h4 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.2rem', fontWeight: '500' }}>{item.title}</h4>
                                    <p style={{ color: '#888', fontSize: '0.85rem' }}>{item.artist || item.duration}</p>
                                </div>
                                <div className="play-miracle-btn" style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6 4L20 12L6 20V4Z" fill="white" />
                                    </svg>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

