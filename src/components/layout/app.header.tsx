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
    <header className="w-full font-['Inter','Segoe_UI',system-ui,-apple-system,BlinkMacSystemFont,sans-serif] bg-white shadow-[0_2px_6px_rgba(15,23,42,0.06)]">
      {/* Top Bar */}
      <div className="hidden md:block bg-[#1e3a8a] text-white text-[0.85rem] py-2">
        <div className="w-[min(1200px,100%)] mx-auto px-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 ml-6 mr-6 text-[#ebf2ff] cursor-pointer transition-colors duration-200 hover:text-[#cddffe]">
              <FaPhoneAlt aria-hidden />
              <span>(+01) 234 567 890</span>
            </div>
            <div className="flex items-center gap-1.5 ml-6 mr-6 text-[#ebf2ff] cursor-pointer transition-colors duration-200 hover:text-[#cddffe]">
              <FaMapMarkerAlt aria-hidden />
              <span>New York, NY 10012, US</span>
            </div>
          </div>

          <div className="flex gap-3">
            <SocialIcon icon={<FaFacebookF />} />
            <SocialIcon icon={<FaTwitter />} />
            <SocialIcon icon={<FaInstagram />} />
            <SocialIcon icon={<FaLinkedinIn />} />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white shadow-[0_6px_20px_rgba(15,23,42,0.08)]">
        <div className="w-[min(1200px,100%)] mx-auto px-4 flex items-center justify-between py-3.5 gap-4">
          <div className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-[#2563eb] text-white font-bold text-[1.3rem] grid place-items-center shadow-[0_8px_18px_rgba(37,99,235,0.35)]">
              C
            </div>
            <span className="text-2xl font-bold text-[#0f172a] tracking-[-0.02em]">Care</span>
          </div>

          <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
            <NavItem text="Home" isActive />
            <NavItem text="Services" />
            <NavItem text="Dentist" />
            <NavItem text="Blog" />
            <NavItem text="About Us" />
            <NavItem text="Contact Us" />
          </ul>

          <div className="hidden md:block">
            <button className="border-none bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] text-white font-semibold py-2.5 px-8 rounded-[0.65rem] cursor-pointer shadow-[0_12px_24px_rgba(37,99,235,0.3)] transition-all duration-200 hover:shadow-[0_16px_32px_rgba(37,99,235,0.38)] active:scale-[0.98]">
              Book Now
            </button>
          </div>

          <div className="block md:hidden">
            <button
              onClick={toggleMenu}
              className="border border-[rgba(37,99,235,0.2)] bg-transparent text-[#2563eb] rounded-[10px] p-1.5 cursor-pointer transition-colors duration-200 hover:bg-[rgba(37,99,235,0.08)]"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`block md:hidden border-t border-[#e5e7eb] overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen
              ? "max-h-[420px] opacity-100"
              : "max-h-0 opacity-0"
          }`}
        >
          <ul className="list-none py-3 px-4 pb-6 m-0 flex flex-col gap-2">
            <NavItem text="Home" isMobile isActive onClick={toggleMenu} />
            <NavItem text="About" isMobile onClick={toggleMenu} />
            <NavItem text="Service" isMobile onClick={toggleMenu} />
            <NavItem text="Blog" isMobile onClick={toggleMenu} />
            <NavItem text="Contact" isMobile onClick={toggleMenu} />
            <div className="pt-2">
              <button className="w-full border-none bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] text-white font-semibold py-2.5 px-8 rounded-[0.65rem] cursor-pointer shadow-[0_12px_24px_rgba(37,99,235,0.3)] transition-all duration-200 hover:shadow-[0_16px_32px_rgba(37,99,235,0.38)] active:scale-[0.98]">
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
    "text-[#6b7280] font-medium no-underline transition-colors duration-200 inline-block",
    isActive && "text-[#2563eb] font-bold",
    "hover:text-[#2563eb]",
    isMobile && "w-full py-1.5",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <li className="list-none">
      <a href={href} onClick={onClick} className={classes}>
        {text}
      </a>
    </li>
  );
};

const SocialIcon: React.FC<SocialIconProps> = ({ icon, href = "#" }) => {
  return (
    <a
      href={href}
      className="w-7 h-7 text-2xl grid place-items-center rounded-full bg-[rgba(255,255,255,0.15)] text-white transition-all duration-200 hover:bg-white hover:text-[#1e3a8a]"
    >
      <span aria-hidden>{icon}</span>
    </a>
  );
};

export default Header;