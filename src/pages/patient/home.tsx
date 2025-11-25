import React from "react";
import {
  FaUser,
  FaPhoneAlt,
  FaCalendarAlt,
  FaClock,
  FaCheck,
  FaTooth,
  FaMicroscope,
  FaUserMd,
  FaCalendarCheck,
  FaUserFriends,
  FaFileMedical,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

// Interface cho Props (nếu sau này bạn muốn truyền dữ liệu động)
interface HeroProps {
  doctorImageSrc?: 'src/assets/imgs/anhbacsicuoi.jpg'; // Bạn sẽ truyền link ảnh bác sĩ vào đây
}

const HeroSection: React.FC<HeroProps> = ({
  doctorImageSrc = "src/assets/imgs/anhbacsicuoi.jpg",
}) => {
  return (
    <section className="home-hero">
      <div className="home-hero__pattern" aria-hidden />

      <div className="app-container home-hero__inner">
        <div className="home-hero__content">
          <span className="home-hero__badge">Dental Health Polyclinic</span>

          <h1 className="home-hero__title">
            Your <span>Perfect Smile</span> Starts Here
          </h1>

          <p className="home-hero__description">
            Get expert dental care in a comfortable setting. Healthy, bright
            smiles start with us — book your appointment today!
          </p>

          <button className="home-hero__button">Contact Us</button>
        </div>

        <div className="home-hero__media">
          <div className="home-hero__circle">
            <img
              src={doctorImageSrc}
              alt="Doctor"
              className="home-hero__image"
            />
          </div>
        </div>
      </div>

      <div className="home-booking">
        <div className="app-container">
          <div className="home-booking__card">
            <form className="home-booking__form">
              <FormInput
                icon={<FaUser />}
                label="Name"
                placeholder="Sofia Dark"
                type="text"
              />
              <FormInput
                icon={<FaPhoneAlt />}
                label="Phone Number"
                placeholder="Your Phone"
                type="tel"
              />
              <FormInput
                icon={<FaCalendarAlt />}
                label="Preferred Date"
                placeholder="dd/mm/yyyy"
                type="date"
              />
              <FormInput
                icon={<FaClock />}
                label="Preferred Time"
                placeholder="00:00"
                type="time"
              />

              <div className="home-booking__button">
                <button type="submit" className="home-hero__button">
                  Contact Us
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- HELPER COMPONENT: FORM INPUT ---
// Giúp code gọn hơn và tái sử dụng style input
interface FormInputProps {
  label: string;
  placeholder: string;
  type: string;
  icon: React.ReactNode;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  placeholder,
  type,
  icon,
}) => {
  return (
    <div className="home-form-field">
      <label className="home-form-field__label">{label}</label>
      <div className="home-form-field__control">
        <span className="home-form-field__icon">{icon}</span>
        <input
          type={type}
          placeholder={placeholder}
          className="home-form-field__input"
        />
      </div>
    </div>
  );
};
 
// --- ABOUT SECTION COMPONENT ---
interface AboutProps {
  imageSrc?: "src/assets/imgs/heathySmile.jpg";
}

const AboutSection: React.FC<AboutProps> = ({
  imageSrc = "src/assets/imgs/heathySmile.jpg",
}) => {
  const features = [
    "Premium Dental Services You Can Trust.",
    "Advanced Technology for Healthier Smiles.",
    "Expert Care, Personalized for You.",
  ];

  return (
    <section className="about-section">
      <div className="app-container">
        <div className="about-grid">
          <div className="about-image-col">
            <img
              src={imageSrc}
              alt="Doctor treating patient"
              className="about-image-style"
            />
            <div className="about-image-decor"></div>
          </div>

          <div className="about-content-col">
            <span className="about-subtitle">Dental Health Polyclinic</span>

            <h2 className="about-heading">
              We Are Here for Best <br className="about-heading-break" />
              <span className="about-highlight">Healthy Smiles!</span>
            </h2>

            <p className="about-description">
              At our clinic, we focus on your dental health with modern
              technology and an expert team. Achieve a healthy smile with
              personalized solutions—book your appointment today!
            </p>

            <ul className="about-list">
              {features.map((item, index) => (
                <li key={index} className="about-list-item">
                  <FaCheck className="about-check-icon" />
                  <span className="about-list-text">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- WHY CHOOSE US SECTION COMPONENT ---
interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

const WhyChooseUsSection: React.FC = () => {
  const features: FeatureItem[] = [
    {
      icon: <FaTooth />,
      title: "Quality Service",
      desc: "We aim to preserve and enhance your healthy smile, supporting you every step of the way.",
    },
    {
      icon: <FaMicroscope />,
      title: "Modern Technology",
      desc: "Using the latest technology, we detect issues early and provide effective treatment options.",
    },
    {
      icon: <FaUserMd />,
      title: "Experienced Experts",
      desc: "Our expert team offers personalized treatment plans and supports you every step of the way.",
    },
  ];

  return (
    <section className="why-choose-section">
      <div className="app-container">
        <div className="why-choose-grid">
          <div className="why-choose-content">
            <span className="why-choose-subtitle">Why Choose Us?</span>

            <h2 className="why-choose-heading">
              Hit the Road with Us for{" "}
              <br className="why-choose-heading-break" />
              <span className="why-choose-highlight">Healthy Smiles!</span>
            </h2>

            <p className="why-choose-description">
              Looking for a clinic that values healthy smiles? We offer modern,
              expert care for your oral health.
            </p>

            <div className="why-choose-features">
              {features.map((item, index) => (
                <div key={index} className="why-choose-feature-item">
                  <div className="why-choose-feature-icon">
                    {item.icon}
                  </div>
                  <div className="why-choose-feature-content">
                    <h3 className="why-choose-feature-title">{item.title}</h3>
                    <p className="why-choose-feature-desc">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="why-choose-image-col">
            <div className="why-choose-image-wrapper">
              <img
                src="src/assets/imgs/whychooseus.jpg"
                alt="Male Dentist Smiling"
                className="why-choose-image"
              />
              <div className="why-choose-image-overlay"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- OUR TEAM SECTION COMPONENT ---
interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
}

const OurTeamSection: React.FC = () => {
  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: "Dr. Thomas LucaLuca",
      role: "General Dentistry",
      image: "src/assets/imgs/bacsitocbac.jpg",
    },
    {
      id: 2,
      name: "Dr. James Hung",
      role: "Orthodontics",
      image: "src/assets/imgs/bacsichaua.jpg",  
    },
    {
      id: 3,
      name: "Dr. Sarah Williams",
      role: "Cosmetic Dentist",
      image: "src/assets/imgs/bacsidepgai.jpg",
    },
  ];

  return (
    <section className="our-team-section">
      <div className="app-container">
        <div className="our-team-header">
          <span className="our-team-subtitle">Our Team</span>
          <h2 className="our-team-heading">
            Our <span className="our-team-highlight">Professional</span> Team
          </h2>
          <p className="our-team-description">
            Lorem ipsum dolor sit amet consectetur. Nisi ultricies sed faucibus
            porttitor mus nullam adipiscing.
          </p>
        </div>

        <div className="our-team-grid">
          {teamMembers.map((member) => (
            <div key={member.id} className="our-team-card">
              <div className="our-team-image-wrapper">
                <img
                  src={member.image}
                  alt={member.name}
                  className="our-team-image"
                />
              </div>
              <div className="our-team-content">
                <h3 className="our-team-name">{member.name}</h3>
                <p className="our-team-role">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- HOW IT WORKS SECTION COMPONENT ---
interface StepItem {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

const HowItWorkSection: React.FC = () => {
  const steps: StepItem[] = [
    {
      icon: <FaCalendarCheck />,
      title: "Book Your Appointment",
      desc: "Get expert dental care and achieve your best smile.",
    },
    {
      icon: <FaUserFriends />,
      title: "Consultation & Examination",
      desc: "Get a thorough exam and start your path to a healthier smile.",
    },
    {
      icon: <FaFileMedical />,
      title: "Personalized Treatment Plan",
      desc: "Tailored care to achieve your healthiest, brightest smile.",
    },
    {
      icon: <FaTooth />,
      title: "Ongoing Care & Follow - Up",
      desc: "Continued support to maintain your healthy, beautiful smile.",
    },
  ];

  return (
    <section className="how-it-works-section">
      <div className="app-container">
        <div className="how-it-works-header">
          <span className="how-it-works-subtitle">How It Work</span>
          <h2 className="how-it-works-heading">
            Your Journey to the{" "}
            <span className="how-it-works-highlight">Perfect Smile</span>
          </h2>
          <p className="how-it-works-description">
            Achieve a healthier, brighter smile with expert care and
            personalized treatments. We're here to help every step of the way.
          </p>
        </div>

        <div className="how-it-works-grid">
          {steps.map((step, index) => (
            <div key={index} className="how-it-works-step">
              <div className="how-it-works-icon-wrapper">
                {step.icon}
              </div>
              <h3 className="how-it-works-step-title">{step.title}</h3>
              <p className="how-it-works-step-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- CONTACT US BOTTOM SECTION COMPONENT ---
const ContactUsBottomSection: React.FC = () => {
  return (
    <section className="contact-us-bottom-section">
      <div className="app-container">
        <div className="contact-us-bottom-grid">
          <div className="contact-us-bottom-image-col">
            <div className="contact-us-bottom-image-wrapper">
              <img
                src="src/assets/imgs/contactus.jpg"
                alt="Doctor consultation"
                className="contact-us-bottom-image"
              />
            </div>
          </div>

          <div className="contact-us-bottom-content">
            <span className="contact-us-bottom-subtitle">Contact Us</span>
            <h2 className="contact-us-bottom-heading">
              Start Your Journey to a{" "}
              <br className="contact-us-bottom-heading-break" />
              Healthy <span className="contact-us-bottom-highlight">Smile Today!</span>
            </h2>
            <p className="contact-us-bottom-description">
              Book your appointment now to take the first step towards a healthy
              smile! Our expert team is waiting for you. Take action now for a
              healthier mouth and teeth.
            </p>

            <div className="contact-us-bottom-list">
              <div className="contact-us-bottom-item">
                <div className="contact-us-bottom-item-icon">
                  <FaPhoneAlt />
                </div>
                <span className="contact-us-bottom-item-text">
                  (000) 000-0000
                </span>
              </div>

              <div className="contact-us-bottom-item">
                <div className="contact-us-bottom-item-icon">
                  <FaEnvelope />
                </div>
                <span className="contact-us-bottom-item-text">
                  adress@gmail.com
                </span>
              </div>

              <div className="contact-us-bottom-item">
                <div className="contact-us-bottom-item-icon">
                  <FaMapMarkerAlt />
                </div>
                <span className="contact-us-bottom-item-text">
                  Address will be added here
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- HOME PAGE COMPONENT (Combines all sections) ---
const HomePage: React.FC = () => {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <WhyChooseUsSection />
      <OurTeamSection />
      <HowItWorkSection />
      <ContactUsBottomSection />
    </>
  );
};

export default HomePage;