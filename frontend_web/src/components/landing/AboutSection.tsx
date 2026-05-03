import React from 'react';
// Переконайся, що шлях до CSS правильний, якщо ти використовуєш спільний файл Landing.css
import './Landing.css'; 

const AboutSection = () => {
    return (
        <div className="about-section">
            <h2 className="about-title">Why choose SciRise?</h2>
            
            <div className="features-grid">
                <div className="feature-card">
                    <div className="feature-icon">✨</div>
                    <h3>AI-Powered Agents</h3>
                    <p>Automate repetitive tasks and let our intelligent agents handle the heavy lifting while you focus on creativity.</p>
                </div>
                
                <div className="feature-card">
                    <div className="feature-icon">📁</div>
                    <h3>Unified Knowledge</h3>
                    <p>Stop jumping between tabs. Keep all your documents, notes, and discussions organized in one central hub.</p>
                </div>
                
                <div className="feature-card">
                    <div className="feature-icon">🚀</div>
                    <h3>Seamless Collaboration</h3>
                    <p>Communicate with your team in real-time through integrated text and video channels without leaving your workspace.</p>
                </div>
            </div>
        </div>
    );
};

export default AboutSection;