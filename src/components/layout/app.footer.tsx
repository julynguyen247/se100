import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

// --- INTERFACES (TypeScript) ---

interface FooterLinkProps {
  text: string;
  href?: string;
}

interface SocialIconProps {
  icon: React.ReactNode;
  href?: string;
}

interface ContactItemProps {
  icon: React.ReactNode;
  text: string;
  href?: string;
}

const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <div className="app-container site-footer__inner">
        <div className="site-footer__grid">
          <div className="site-footer__column">
            <div className="site-footer__logo">
              <div className="site-footer__logo-icon">C</div>
              <span className="site-footer__logo-text">Care</span>
            </div>

            <p className="site-footer__description">
              Our dental clinic services are dedicated to providing the most
              comfortable and efficient dental care possible.
            </p>

            <div className="site-footer__social">
              <SocialIcon icon={<FaFacebookF />} />
              <SocialIcon icon={<FaTwitter />} />
              <SocialIcon icon={<FaInstagram />} />
              <SocialIcon icon={<FaLinkedinIn />} />
            </div>
          </div>

          <div className="site-footer__column">
            <h3 className="site-footer__title">Company</h3>
            <ul className="site-footer__list">
              <FooterLink text="About" />
              <FooterLink text="Services" />
              <FooterLink text="Team" />
              <FooterLink text="Blog" />
            </ul>
          </div>

          <div className="site-footer__column">
            <h3 className="site-footer__title">Supports</h3>
            <ul className="site-footer__list">
              <FooterLink text="Privacy Policy" />
              <FooterLink text="Terms of Use" />
              <FooterLink text="FAQ's" />
              <FooterLink text="Appointment" />
            </ul>
          </div>

          <div className="site-footer__column">
            <h3 className="site-footer__title">Contact Us</h3>
            <ul className="site-footer__list">
              <ContactItem
                icon={<FaPhoneAlt />}
                text="(+01) 234 567 890"
                href="tel:+01234567890"
              />
              <ContactItem
                icon={<FaEnvelope />}
                text="info@support.com"
                href="mailto:info@support.com"
              />
              <ContactItem
                icon={<FaMapMarkerAlt />}
                text="New York, NY 10012, US"
              />
            </ul>
          </div>
        </div>

        <div className="site-footer__bottom">
          <p>© 2024 Care. All Rights Reserved.</p>

          <div className="site-footer__legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- HELPER COMPONENTS ---

// 1. Link Component
const FooterLink: React.FC<FooterLinkProps> = ({ text, href = "#" }) => {
  return (
    <li className="site-footer__list-item">
      <a href={href} className="site-footer__link">
        <span className="site-footer__link-dot">•</span>
        {text}
      </a>
    </li>
  );
};

// 2. Contact Item Component
const ContactItem: React.FC<ContactItemProps> = ({ icon, text, href }) => {
  const content = (
    <div className="site-footer__contact">
      <div className="site-footer__contact-icon">{icon}</div>
      <span>{text}</span>
    </div>
  );

  return <li>{href ? <a href={href}>{content}</a> : content}</li>;
};

// 3. Social Icon Component
const SocialIcon: React.FC<SocialIconProps> = ({ icon, href = "#" }) => {
  return (
    <a href={href} className="site-footer__social-icon">
      <span aria-hidden>{icon}</span>
    </a>
  );
};

export default Footer;