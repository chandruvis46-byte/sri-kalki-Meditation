import { useData } from '../context/DataContext'

export default function Navbar() {
    const { data, searchQuery, setSearchQuery } = useData()

    return (
        <nav className="glass-nav">
            <div className="nav-container">
                <div className="logo">
                    <img src={data.siteSettings?.site_logo || "./Logo /Sri kalki Logo.svg"} alt="Sri Kalki Logo" />
                </div>

                <div className="search-bar">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                            stroke="#333240" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M21 21L16.65 16.65" stroke="#333240" strokeWidth="2" strokeLinecap="round"
                            strokeLinejoin="round" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <ul className="nav-links">
                    <li><a href="#" className="active">Wisdom</a></li>
                    <li><a href="#">Meditation</a></li>
                    <li><a href="#">Music</a></li>
                    <li><a href="#">Talk</a></li>
                </ul>

                <div className="auth-buttons">
                    <button className="btn-login">Login</button>
                    <button className="btn-signup">Sign Up</button>
                </div>
            </div>
        </nav>
    )
}
