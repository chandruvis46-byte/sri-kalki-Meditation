import { useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext'

export default function MeditationSection() {
    const { data, searchQuery } = useData()
    const navigate = useNavigate()

    const filteredMeditations = data.meditations.filter(meditation =>
        meditation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        meditation.description.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (searchQuery && filteredMeditations.length === 0) return null

    return (
        <section className="meditation-section">
            <div className="section-header">
                <h2 className="section-title">Meditation</h2>
                <a href="#" className="see-all">See all</a>
            </div>

            <div className="meditation-grid">
                {filteredMeditations.map((meditation) => (
                    <div
                        key={meditation.id}
                        className="meditation-card"
                        onClick={() => navigate(`/meditation/${meditation.id}`)}
                        style={{ cursor: 'pointer' }}
                    >
                        <img src={meditation.image} alt={meditation.title} className="meditation-image" />
                        <div className="meditation-content">
                            <h3>{meditation.title}</h3>
                            <p className="meditation-desc">{meditation.description}</p>

                            <div className="meditation-meta">
                                <span className="meta-tag">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                                            stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M12 6V12L16 14" stroke="#888" strokeWidth="2" strokeLinecap="round"
                                            strokeLinejoin="round" />
                                    </svg>
                                    Meditation
                                </span>
                                <span className="meta-time">{meditation.duration}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
