import { useData } from '../context/DataContext'

export default function MiraclesSection({ onCardClick }) {
    const { data, searchQuery } = useData()

    const filteredMiracles = data.miracles.filter(miracle =>
        miracle.quote?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        miracle.artist?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        miracle.title?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (searchQuery && filteredMiracles.length === 0) return null

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

    return (
        <section className="miracles-section">
            <div className="section-header">
                <h2 className="section-title">Miracles in life</h2>
                <a href="#" className="see-all">See all</a>
            </div>

            <div className="miracles-grid">
                {filteredMiracles.map((miracle) => (
                    <div
                        key={miracle.id}
                        className="miracle-card"
                        style={{ backgroundImage: `url('${getImageUrl(miracle.image)}')` }}
                        onClick={() => onCardClick({
                            title: miracle.title,
                            artist: miracle.artist,
                            image: miracle.image,
                            audio: miracle.audio,
                            youtubelink: miracle.youtubelink,
                            quote: miracle.quote
                        })}
                    >
                        <div className="miracle-overlay">
                            <p className="miracle-quote">{miracle.quote}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
