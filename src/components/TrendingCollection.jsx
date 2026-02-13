import { useData } from '../context/DataContext'

export default function TrendingCollection() {
    const { data, searchQuery } = useData()

    const filteredCollections = data.collections.filter(collection =>
        collection.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (searchQuery && filteredCollections.length === 0) return null

    return (
        <section className="trending-section">
            <h2 className="section-title">Trending Collection</h2>



            <div className="trending-grid">
                {filteredCollections.map((collection) => (
                    <div key={collection.id} className="collection-card">
                        <img src={collection.image} alt={collection.title} className="card-image" />
                        <div className="card-content">
                            <h3>{collection.title}</h3>
                            <p>{collection.sessions} Sessions</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
