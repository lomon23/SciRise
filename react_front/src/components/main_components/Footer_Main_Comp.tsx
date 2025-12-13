import React from 'react';

const FooterMainComp: React.FC = () => {
  return (
    <footer style={{ display: 'flex', justifyContent: 'space-between', padding: '40px 20px', borderTop: '1px solid #ccc' }}>
      <div className="footer-brand">
        <h3>SkiRise</h3>
        <div className="social-icons">
          <span>IG </span>
          <span>FB </span>
          <span>WA </span>
          <span>IN </span>
          <span>GH </span>
        </div>
        <br />
        <button>English (US)</button>
      </div>

      <div className="footer-links" style={{ display: 'flex', gap: '50px' }}>
        <div className="column">
          <h4>Company</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li>About us</li>
            <li>Careers</li>
            <li>Security</li>
            <li>Status</li>
            <li>Terms & privacy</li>
            <li>Your privacy rights</li>
          </ul>
        </div>

        <div className="column">
          <h4>Download</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li>Android</li>
            <li>Windows</li>
            <li>Calendar</li>
          </ul>
        </div>

        <div className="column">
          <h4>SkiRise for</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li>Admin</li>
            <li>Teacher</li>
            <li>Student</li>
          </ul>
          <br />
          <a href="#">Explore more →</a>
        </div>
      </div>
    </footer>
  );
};

export default FooterMainComp;