import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <div className="footer-brand">
                        <Link to="/" className="footer-logo">
                            <span className="logo-icon">🔗</span>
                            HuskyBridge
                        </Link>
                        <p className="footer-description">
                            HuskyBridge is a peer-to-peer platform for the Northeastern University community, enabling students to borrow, lend, find housing, tutoring, and more. Connect with fellow Huskies and make campus life easier.
                        </p>
                    </div>
                </div>

                <div className="footer-section">
                    <h3>Get in Touch</h3>
                    <div className="contact-info">
                        <div className="contact-item">
                            <span className="contact-icon">📍</span>
                            Northeastern University,<br />Boston, MA
                        </div>
                        <div className="contact-item">
                            <span className="contact-icon">📧</span>
                            support@huskybridge.com
                        </div>
                        <div className="contact-item">
                            <span className="contact-icon">📞</span>
                            +1 (617) 555-1234
                        </div>
                    </div>
                </div>

                <div className="footer-section">
                    <h3>Explore</h3>
                    <ul className="footer-links">
                        <li><Link to="/my-team">My Team</Link></li>
                        <li><Link to="/posts/category/lend-borrow">Borrow/Lend</Link></li>
                        <li><Link to="/posts/category/housing">Housing</Link></li>
                        <li><Link to="/posts/category//tutoring">Tutoring</Link></li>
                        <li><Link to="/community">Community Listing</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3>Support</h3>
                    <ul className="footer-links">
                        <li><Link to="/faqs">FAQs</Link></li>
                        <li><Link to="/report-issue">Report an Issue</Link></li>
                        <li><Link to="/terms">Term of Service</Link></li>
                        <li><Link to="/privacy">Privacy Policy</Link></li>
                    </ul>
                </div>
            </div>
            
            <div className="footer-bottom">
                <p>© 2025 HuskyBridge. All rights reserved.</p>
            </div>
        </footer>
    );
} 