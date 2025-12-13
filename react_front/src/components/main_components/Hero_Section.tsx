import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section style={{ textAlign: 'center', padding: '50px 20px' }}>
      <div className="hero-image-placeholder" style={{ marginBottom: '20px' }}>
        <div style={{ width: '300px', height: '200px', backgroundColor: '#e0e0e0', margin: '0 auto' }}>
          Placeholder for Purple Illustration
        </div>
      </div>

      <h1>One workspace. Zero busywork.</h1>
      
      <p style={{ maxWidth: '600px', margin: '20px auto' }}>
        SkiRise is where your teams and AI agents capture knowledge, find answers, and automate projects. Now a team of 7 feels like 70.
      </p>

      <div className="hero-buttons" style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
        <button>Get SkiRise free</button>
        <button>Request a demo</button>
      </div>
    </section>
  );
};

export default HeroSection;