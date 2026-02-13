import { useData } from '../context/DataContext'

export default function Categories() {
    const { data } = useData()

    return (
        <section className="categories-section">
            <div className="categories-grid">
                {data.categories.map((category) => (
                    <div key={category.id} className="category-item">
                        <div className="category-card">
                            <img src={category.icon} alt={category.name} />
                        </div>
                        <h3>{category.name}</h3>
                    </div>
                ))}
            </div>
        </section>
    )
}
