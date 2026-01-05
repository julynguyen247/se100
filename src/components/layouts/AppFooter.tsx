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
    <footer className="bg-white py-16 pb-10 border-t border-[#e5e7eb] font-['Inter','Segoe_UI',system-ui,-apple-system,BlinkMacSystemFont,sans-serif]">
      <div className="w-[min(1200px,100%)] mx-auto px-4 flex flex-col gap-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[10px] bg-[#2563eb] text-white grid place-items-center font-bold text-xl shadow-[0_8px_16px_rgba(37,99,235,0.28)]">
                C
              </div>
              <span className="text-2xl font-bold text-[#0f172a]">Care</span>
            </div>

            <p className="text-[0.95rem] text-[#6b7280] leading-[1.6] max-w-[320px]">
              Our dental clinic services are dedicated to providing the most
              comfortable and efficient dental care possible.
            </p>

            <div className="flex gap-3">
              <SocialIcon icon={<FaFacebookF />} />
              <SocialIcon icon={<FaTwitter />} />
              <SocialIcon icon={<FaInstagram />} />
              <SocialIcon icon={<FaLinkedinIn />} />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h3 className="text-[1.1rem] font-bold text-[#0f172a]">Company</h3>
            <ul className="list-none p-0 m-0 flex flex-col gap-3">
              <FooterLink text="About" />
              <FooterLink text="Services" />
              <FooterLink text="Team" />
              <FooterLink text="Blog" />
            </ul>
          </div>

          <div className="flex flex-col gap-6">
            <h3 className="text-[1.1rem] font-bold text-[#0f172a]">Supports</h3>
            <ul className="list-none p-0 m-0 flex flex-col gap-3">
              <FooterLink text="Privacy Policy" />
              <FooterLink text="Terms of Use" />
              <FooterLink text="FAQ's" />
              <FooterLink text="Appointment" />
            </ul>
          </div>

          <div className="flex flex-col gap-6">
            <h3 className="text-[1.1rem] font-bold text-[#0f172a]">Contact Us</h3>
            <ul className="list-none p-0 m-0 flex flex-col gap-3">
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

        <div className="border-t border-[#e5e7eb] pt-6 flex flex-col gap-4 text-sm text-[#6b7280] md:flex-row md:items-center md:justify-between">
          <p>© 2024 Care. All Rights Reserved.</p>

          <div className="flex gap-6">
            <a href="#" className="text-inherit no-underline transition-colors duration-200 hover:text-[#2563eb]">
              Privacy Policy
            </a>
            <a href="#" className="text-inherit no-underline transition-colors duration-200 hover:text-[#2563eb]">
              Terms & Conditions
            </a>
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
    <li>
      <a href={href} className="text-[0.95rem] text-[#6b7280] no-underline inline-flex items-center gap-1 transition-all duration-200 hover:text-[#2563eb] hover:gap-2 group">
        <span className="inline-block w-0 overflow-hidden text-[#2563eb] transition-[width] duration-200 group-hover:w-1.5">•</span>
        {text}
      </a>
    </li>
  );
};

// 2. Contact Item Component
const ContactItem: React.FC<ContactItemProps> = ({ icon, text, href }) => {
  const content = (
    <div className="flex gap-3 text-[#6b7280] items-start transition-all duration-200 group-hover:text-[#2563eb] group-hover:translate-x-0.5">
      <div className="text-[#2563eb] mt-0.5">{icon}</div>
      <span>{text}</span>
    </div>
  );

  return (
    <li>
      {href ? (
        <a href={href} className="block group">
          {content}
        </a>
      ) : (
        content
      )}
    </li>
  );
};

// 3. Social Icon Component
const SocialIcon: React.FC<SocialIconProps> = ({ icon, href = "#" }) => {
  return (
    <a href={href} className="w-[34px] h-[34px] rounded-full border border-[#e5e7eb] text-[#2563eb] grid place-items-center transition-all duration-200 hover:bg-[#2563eb] hover:text-white hover:border-[#2563eb]">
      <span aria-hidden>{icon}</span>
    </a>
  );
};

export default Footer;