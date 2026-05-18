import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import '../../assets/scss/components/footer.scss';
import '../../assets/scss/components/header.scss';
const LandingPage = () => {
  return (
    <div>
      <Header />
      <main>
        <h1>SciRise - Платформа для навчання</h1>
        {/* Тут буде Hero секція */}
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;