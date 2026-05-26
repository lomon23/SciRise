import './HeroSection.scss';

export const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-glow"></div>
      <div className="hero-content">
        <h1>SciRise</h1>
        <p>Інтелектуальна платформа для управління навчальними групами та проєктами. Синхронізуй знання в режимі реального часу без хаосу.</p>
        <button className="hero-btn">Розпочати роботу</button>
      </div>
    </section>
  );
};