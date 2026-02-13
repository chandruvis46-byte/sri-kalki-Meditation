import { useState, useEffect } from 'react'
import { useData } from '../context/DataContext'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Hero() {
    const { data } = useData()
    const { banners } = data
    const activeBanners = banners?.filter(b => b.is_active) || []

    // Default fallback if no banners are uploaded
    const defaultBanner = {
        id: 'default',
        image_url: './Banner/Group 5.png',
        title: 'Default Banner'
    }

    const displayBanners = activeBanners.length > 0 ? activeBanners : [defaultBanner]
    const [currentSlide, setCurrentSlide] = useState(0)

    useEffect(() => {
        if (displayBanners.length <= 1) return

        const interval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % displayBanners.length)
        }, 5000)

        return () => clearInterval(interval)
    }, [displayBanners.length])

    const nextSlide = () => {
        setCurrentSlide(prev => (prev + 1) % displayBanners.length)
    }

    const prevSlide = () => {
        setCurrentSlide(prev => (prev - 1 + displayBanners.length) % displayBanners.length)
    }

    const goToSlide = (index) => {
        setCurrentSlide(index)
    }

    return (
        <section className="hero-section" style={{ position: 'relative', overflow: 'hidden', aspectRatio: '21/9', minHeight: '400px' }}>
            <div className="banner-container" style={{ position: 'relative', height: '100%', width: '100%' }}>
                {displayBanners.map((banner, index) => (
                    <div
                        key={banner.id}
                        className="hero-slide"
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            opacity: index === currentSlide ? 1 : 0,
                            transition: 'opacity 0.8s ease-in-out',
                            zIndex: index === currentSlide ? 1 : 0
                        }}
                    >
                        <img
                            src={banner.image_url}
                            alt={banner.title || "Meditation Banner"}
                            className="hero-banner"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>
                ))}

                {/* Navigation Controls (only if more than 1 banner) */}
                {displayBanners.length > 1 && (
                    <>
                        <button
                            onClick={prevSlide}
                            className="hero-nav-btn prev"
                            style={{
                                position: 'absolute',
                                left: '20px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'rgba(255,255,255,0.3)',
                                border: 'none',
                                borderRadius: '50%',
                                padding: '10px',
                                cursor: 'pointer',
                                zIndex: 10,
                                color: '#fff',
                                backdropFilter: 'blur(5px)'
                            }}
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="hero-nav-btn next"
                            style={{
                                position: 'absolute',
                                right: '20px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'rgba(255,255,255,0.3)',
                                border: 'none',
                                borderRadius: '50%',
                                padding: '10px',
                                cursor: 'pointer',
                                zIndex: 10,
                                color: '#fff',
                                backdropFilter: 'blur(5px)'
                            }}
                        >
                            <ChevronRight size={24} />
                        </button>

                        <div
                            className="hero-dots"
                            style={{
                                position: 'absolute',
                                bottom: '20px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                display: 'flex',
                                gap: '10px',
                                zIndex: 10
                            }}
                        >
                            {displayBanners.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    style={{
                                        width: '10px',
                                        height: '10px',
                                        borderRadius: '50%',
                                        background: index === currentSlide ? '#fff' : 'rgba(255,255,255,0.5)',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: 0
                                    }}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </section>
    )
}
