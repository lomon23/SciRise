import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

const Footer = () => {
    return (
        <footer className="footer-section">
            <div className="footer-content">
                
                <div className="footer-brand">
                    <h2>SciRise</h2>
                    <p>Where your teams and AI agents capture knowledge, find answers, and automate projects seamlessly.</p>
                </div>
                
                <div className="footer-links">
                    <h4>Product</h4>
                    <ul>
                        <li><Link to="#">Features</Link></li>
                        <li><Link to="#">Integrations</Link></li>
                        <li><Link to="#">Pricing</Link></li>
                        <li><Link to="#">Changelog</Link></li>
                    </ul>
                </div>
                
                <div className="footer-links">
                    <h4>Company</h4>
                    <ul>
                        <li><Link to="#">About Us</Link></li>
                        <li><Link to="#">Careers</Link></li>
                        <li><Link to="#">Contact</Link></li>
                    </ul>
                </div>

                <div className="footer-links">
                    <h4>Legal</h4>
                    <ul>
                        <li><Link to="#">Privacy Policy</Link></li>
                        <li><Link to="#">Terms of Service</Link></li>
                    </ul>
                </div>

            </div>
            
            <div className="footer-bottom">
                <p>© 2026 SciRise. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;