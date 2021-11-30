import React from 'react';

import Container from 'components/Container';

const Footer = () => {
  return (
    <footer>
      <Container>
        <div className="footer-container">
          <p>&copy; {new Date().getFullYear()} PayMongo</p>
          <ul>
            <li><a href="https://paymongo.help/en/">Help Center</a></li>
            <li><a href="https://www.paymongo.com/terms">Terms of use</a></li>
            <li><a href="https://www.paymongo.com/privacy">Privacy policy</a></li>
          </ul>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;