export default function Footer() {
    return (
        <footer className="site-footer">
            <div className="footer-container">
                <div className="footer-brand">
                    <h1>SRI KALKI</h1>
                </div>

                <div className="footer-content">
                    <div className="footer-subscribe">
                        <p>Subscribe to get wisdom and updates directly to your inbox.</p>
                        <div className="subscribe-form">
                            <input type="email" placeholder="Your email address" />
                            <button type="button">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 12H19" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M12 5L19 12L12 19" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="footer-links-group">
                        <div className="link-column">
                            <a href="#">Help</a>
                            <a href="#">Blog</a>
                            <a href="#">Terms of Service</a>
                            <a href="#">Privacy Policy</a>
                        </div>
                        <div className="link-column">
                            <a href="#">Features</a>
                            <a href="#">Pricing</a>
                            <a href="#">Discover</a>
                            <a href="#">Jobs</a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <div className="footer-logo-small">
                        <img src="./Logo /Sri kalki Logo.svg" alt="Sri Kalki Logo Small" style={{ height: '30px' }} />
                        <span>© Sri Kalki, Inc.</span>
                    </div>
                    <div className="social-icons">
                        <a href="#">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M23 3C22.0424 3.67548 20.9821 4.19211 19.86 4.53C19.2577 3.83751 18.4573 3.34669 17.567 3.12392C16.6767 2.90115 15.7395 2.95719 14.8821 3.28445C14.0247 3.61171 13.2884 4.1944 12.773 4.95372C12.2575 5.71303 11.9877 6.61233 12 7.53V8.53C10.2426 8.57557 8.50127 8.18581 6.93101 7.39545C5.36074 6.60508 4.01032 5.43864 3 4C3 4 -1 13 8 17C5.94053 18.398 3.48716 19.0989 1 19C10 24 21 19 21 7.5C20.9991 7.22139 20.9723 6.94354 20.92 6.67C21.9406 5.66343 22.6608 4.39265 23 3Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </a>
                        <a href="#">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.54 6.42C22.4208 5.94535 22.1789 5.51052 21.8383 5.15937C21.4977 4.80822 21.0706 4.55312 20.59 4.42C18.88 4 12 4 12 4C12 4 5.12 4 3.41 4.42C2.92941 4.55312 2.50228 4.80822 2.16172 5.15937C1.82115 5.51052 1.57919 5.94535 1.46 6.42C1.24641 9.07929 1.24641 11.7607 1.46 14.42C1.57919 14.8946 1.82115 15.3295 2.16172 15.6806C2.50228 16.0318 2.92941 16.2869 3.41 16.42C5.12 16.84 12 16.84 12 16.84C12 16.84 18.88 16.84 20.59 16.42C21.0706 16.2869 21.4977 16.0318 21.8383 15.6806C22.1789 15.3295 22.4208 14.8946 22.54 14.42C22.7536 11.7607 22.7536 9.07929 22.54 6.42Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M9.75 13.5L15.25 10.42L9.75 7.33V13.5Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </a>
                        <a href="#">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16 4H8C5.79086 4 4 5.79086 4 8V16C4 18.2091 5.79086 20 8 20H16C18.2091 20 20 18.2091 20 16V8C20 5.79086 18.2091 4 16 4Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M16.5 7.5V7.51" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
