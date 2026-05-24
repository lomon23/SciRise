import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { HeroSection } from '../../components/landing/HeroSection';
import { AboutSection } from '../../components/landing/AboutSection';
import { TeamSection } from '../../components/landing/TeamSection';
export const LandingPage = () => {
  return (
    <div>
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <TeamSection />
      </main>
      <Footer />
    </div>
  );
};
