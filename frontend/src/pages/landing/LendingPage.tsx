import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import '../../assets/scss/components/footer.scss';
import '../../assets/scss/components/header.scss';
import { HeroSection } from '../../components/landing/HeroSection';
import { AboutSection } from '../../components/landing/AboutSection';
import { TeamSection } from '../../components/landing/TeamSection';
const LandingPage = () => {
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

export default LandingPage;