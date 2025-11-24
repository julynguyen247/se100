import React, { useState } from "react";
import {
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaBars,
  FaTimes,
} from "react-icons/fa";

// --- TYPES & INTERFACES ---
// Định nghĩa kiểu dữ liệu cho các Props để đảm bảo Type Safety

interface NavItemProps {
  text: string;
  href?: string;
  isActive?: boolean;
  isMobile?: boolean;
  onClick?: () => void; // Thêm onClick để đóng menu khi chọn trên mobile
}

interface SocialIconProps {
  icon: React.ReactNode;
  href?: string;
}

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const toggleMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <header className="app-header">
      <div className="app-header__top-bar">
        <div className="app-container app-header__top-bar-inner">
          <div className="app-header__contact">
            <div className="app-header__contact-item">
              <FaPhoneAlt aria-hidden />
              <span>(+01) 234 567 890</span>
            </div>
            <div className="app-header__contact-item">
              <FaMapMarkerAlt aria-hidden />
              <span>New York, NY 10012, US</span>
            </div>
          </div>

          <div className="app-header__social">
            <SocialIcon icon={<FaFacebookF />} />
            <SocialIcon icon={<FaTwitter />} />
            <SocialIcon icon={<FaInstagram />} />
            <SocialIcon icon={<FaLinkedinIn />} />
          </div>
        </div>
      </div>

      <nav className="app-header__nav">
        <div className="app-container app-header__nav-inner">
          <div className="app-header__logo">
            <div className="app-header__logo-icon">C</div>
            <span className="app-header__logo-text">Care</span>
          </div>

          <ul className="app-header__nav-list">
            <NavItem text="Home" isActive />
            <NavItem text="Services" />
            <NavItem text="Dentist" />
            <NavItem text="Blog" />
            <NavItem text="About Us" />
            <NavItem text="Contact Us" />
          </ul>

          <div className="app-header__cta">
            <button className="app-header__cta-btn">Book Now</button>
          </div>

          <div className="app-header__toggle">
            <button
              onClick={toggleMenu}
              className="app-header__toggle-btn"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>

        <div
          className={`app-header__mobile-menu ${
            isMobileMenuOpen ? "open" : ""
          }`}
        >
          <ul className="app-header__mobile-list">
            <NavItem text="Home" isMobile isActive onClick={toggleMenu} />
            <NavItem text="About" isMobile onClick={toggleMenu} />
            <NavItem text="Service" isMobile onClick={toggleMenu} />
            <NavItem text="Blog" isMobile onClick={toggleMenu} />
            <NavItem text="Contact" isMobile onClick={toggleMenu} />
            <div className="app-header__mobile-cta">
              <button className="app-header__cta-btn app-header__cta-btn--full">
                Appointment
              </button>
            </div>
          </ul>
        </div>
      </nav>
    </header>
  );
};

// --- HELPER COMPONENTS (Typed) ---

const NavItem: React.FC<NavItemProps> = ({
  text,
  href = `#${text.toLowerCase()}`,
  isActive = false,
  isMobile = false,
  onClick,
}) => {
  const classes = [
    "app-header__link",
    isMobile ? "app-header__link--mobile" : "",
    isActive ? "app-header__link--active" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <li className="app-header__nav-item">
      <a href={href} onClick={onClick} className={classes}>
        {text}
      </a>
    </li>
  );
};

const SocialIcon: React.FC<SocialIconProps> = ({ icon, href = "#" }) => {
  return (
    <a href={href} className="app-header__social-icon">
      <span aria-hidden>{icon}</span>
    </a>
  );
};

export default Header;