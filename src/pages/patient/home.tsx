import React from "react";
import previewVideo from "../../assets/videos/4490548-uhd_3840_2160_25fps.mp4";
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
  doctorImageSrc?: 'src/assets/imgs/anhbacsicuoi.jpg';
   doctorImageSrcHover?:'src/assets/imgs/cuoidep.jpg'; // Bạn sẽ truyền link ảnh bác sĩ vào đây
}

const HeroSection: React.FC<HeroProps> = ({

}) => {
  return (
    <section className="relative h-screen w-full py-16 pb-24 font-['Inter','Segoe_UI',system-ui,-apple-system,BlinkMacSystemFont,sans-serif] overflow-hidden">
      <video autoPlay loop muted playsInline className="back-video" style={{filter: "brightness(0.8)"}}>
        <source src={previewVideo} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.12),transparent_60%)] opacity-60 pointer-events-none" aria-hidden />

      <div className="w-[min(1200px,100%)] mx-auto px-4 relative z-10 flex flex-col-reverse gap-10 lg:flex-row-reverse lg:items-center lg:justify-between lg:gap-12">
        <div className="peer w-full flex justify-center lg:justify-end">
          {/* <div className="group w-[min(80vw,450px)] aspect-square rounded-full bg-[#2563eb] relative overflow-hidden shadow-2xl transition-transform duration-700 group-hover:scale-105">
            <img
              src={doctorImageSrc}
              alt="Doctor Default"
              className="absolute bottom-0 left-1/2 w-full max-h-[110%] object-contain transition-all duration-700 ease-in-out -translate-x-1/2 opacity-100 group-hover:translate-x-1/2 group-hover:opacity-0"
            />
            <img
              src={doctorImageSrcHover}
              alt="Doctor Hover"
              className="absolute bottom-0 left-1/2 w-full max-h-[110%] object-contain transition-all duration-700 ease-in-out -translate-x-[150%] opacity-0 group-hover:-translate-x-1/2 group-hover:opacity-100"
            />
          </div> */}
        </div>

        <div className="w-full max-w-[520px] text-center mx-auto lg:text-left transition-all duration-700 ease-out peer-hover:-translate-y-4 lg:peer-hover:translate-y-0 lg:peer-hover:-translate-x-12  ">
          <span className="inline-block px-5 py-1.5 bg-[rgba(255,255,255,0.15)] text-[#2563eb] rounded-full text-xs font-bold tracking-[0.08em] mb-4 shadow-lg">
            Dental Health Polyclinic
          </span>
         
          <h1 className="text-[clamp(2.5rem,4vw,3.8rem)] font-bold text-white leading-[1.1] mb-4">
            Your <span className="text-[#2563eb]">Perfect Smile</span> Starts Here
          </h1>

          <p className="text-[#5e6b84] font-semibold text-base leading-[1.7] mb-8 text-white">
            Get expert dental care in a comfortable setting. Healthy, bright
            smiles start with us — book your appointment today!
          </p>
    
          <button className="border-none bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] text-white font-semibold py-3.5 px-10 rounded-xl cursor-pointer shadow-[0_20px_36px_rgba(37,99,235,0.35)] transition-all duration-200 w-full sm:w-auto hover:shadow-[0_25px_45px_rgba(37,99,235,0.4)] active:translate-y-[1px]">
            Contact Us
          </button>
        </div>
      </div>

      {/* Form section - Giữ nguyên, có thể thêm z-index cao hơn để không bị ảnh hưởng */}
      <div className="relative z-20 mt-12">
        <div className="w-[min(1200px,100%)] mx-auto px-4">
          <div
            className="rounded-2xl shadow-[0_25px_60px_rgba(15,23,42,0.12)] p-6 w-full mx-auto lg:w-fit lg:p-6 lg:px-4"
            style={{
              backgroundColor: "transparent", 
              backdropFilter: "blur(20px)",
              backgroundImage: "linear-gradient(120deg, rgba(255,255,255,0.3), rgba(37, 99, 235,0.2))",
              marginBottom: "50px",
              marginTop: "150px",
            }}
          >
            <form className="flex flex-col gap-6 items-stretch w-full lg:flex-row lg:flex-nowrap lg:items-center lg:w-fit lg:justify-center text-white">
                {/* Các input form của bạn giữ nguyên */}
                <FormInput icon={<FaUser />} label="Name" placeholder="Sofia Dark" type="text" />
                <FormInput icon={<FaPhoneAlt />} label="Phone" placeholder="Your Phone" type="tel" />
                <FormInput icon={<FaCalendarAlt />} label="Date" placeholder="dd/mm/yyyy" type="date" />
                <FormInput icon={<FaClock />} label="Time" placeholder="00:00" type="time" />

              <div className="w-full lg:flex-[0_0_auto] lg:w-auto lg:px-4">
                <button type="submit" className="border-none bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] text-white font-semibold py-3.5 px-10 rounded-xl cursor-pointer shadow-[0_20px_36px_rgba(37,99,235,0.35)] transition-all duration-200 w-full sm:w-auto hover:shadow-[0_25px_45px_rgba(37,99,235,0.4)] active:translate-y-[1px]">
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
    <div className="w-full border-b border-[#e5e7eb] pb-1.5 lg:flex-[0_1_auto] lg:w-auto lg:border-b-0 lg:border-r lg:border-[#e5e7eb] lg:px-4 lg:min-w-[180px] lg:last:border-r-0">
      <label className="text-[0.7rem] font-bold text-white tracking-[0.08em] mb-0.5 uppercase inline-block">{label}</label>
      <div className="flex items-center gap-2.5">
        <span className="text-white text-sm">{icon}</span>
        <input
          type={type}
          placeholder={placeholder}
          className="border-none bg-transparent text-sm font-semibold text-white w-full outline-none py-0.5 placeholder:text-white/70 placeholder:font-normal"
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
    <section className="w-full bg-white py-12 font-['Inter','Segoe_UI',system-ui,-apple-system,BlinkMacSystemFont,sans-serif] overflow-hidden lg:py-24">
      <div className="w-[min(1200px,100%)] mx-auto px-4">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:gap-20">
          <div className="w-full relative lg:w-1/2">
            <img
              src={imageSrc}
              alt="Doctor treating patient"
              className="w-full h-auto object-cover rounded-2xl shadow-[0_20px_40px_rgba(15,23,42,0.1)]"
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-[rgba(37,99,235,0.05)] rounded-full opacity-50 blur-[60px] -z-10 pointer-events-none"></div>
          </div>

          <div className="w-full flex flex-col lg:w-1/2">
            <span className="text-[#6b7280] text-sm font-medium uppercase tracking-[0.1em] mb-3">
              Dental Health Polyclinic
            </span>

            <h2 className="text-[clamp(1.875rem,3vw,2.625rem)] font-bold text-[#0f172a] leading-[1.2] mb-6">
              We Are Here for Best <br className="hidden lg:block" />
              <span className="text-[#2563eb]">Healthy Smiles!</span>
            </h2>

            <p className="text-[#6b7280] text-base leading-[1.7] mb-8 sm:text-lg">
              At our clinic, we focus on your dental health with modern
              technology and an expert team. Achieve a healthy smile with
              personalized solutions—book your appointment today!
            </p>

            <ul className="list-none p-0 m-0 flex flex-col gap-4">
              {features.map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <FaCheck className="text-[#2563eb] text-lg flex-shrink-0" />
                  <span className="text-[#6b7280] font-medium text-sm sm:text-base">{item}</span>
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
    <section className="w-full bg-white py-12 font-['Inter','Segoe_UI',system-ui,-apple-system,BlinkMacSystemFont,sans-serif] lg:py-24">
      <div className="w-[min(1200px,100%)] mx-auto px-4">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-20">
          <div className="w-full flex flex-col text-center items-center order-2 lg:w-1/2 lg:text-left lg:items-start lg:order-0">
            <span className="text-[#6b7280] text-sm font-medium uppercase tracking-[0.1em] mb-3 block text-center lg:text-left">
              Why Choose Us?
            </span>

            <h2 className="text-[clamp(1.875rem,3vw,2.625rem)] font-bold text-[#0f172a] leading-[1.2] mb-6 text-center lg:text-left">
              Hit the Road with Us for{" "}
              <br className="hidden sm:block" />
              <span className="text-[#2563eb]">Healthy Smiles!</span>
            </h2>

            <p className="text-[#6b7280] text-base leading-[1.7] mb-10 max-w-[32rem] mx-auto lg:mx-0">
              Looking for a clinic that values healthy smiles? We offer modern,
              expert care for your oral health.
            </p>

            <div className="flex flex-col gap-8 w-full items-center lg:items-start">
              {features.map((item, index) => (
                <div key={index} className="group flex flex-col items-center gap-4 transition-transform duration-200 w-full max-w-[28rem] hover:translate-x-1 lg:flex-row lg:items-start lg:max-w-none lg:gap-6">
                  <div className="w-12 h-12 text-2xl flex items-center justify-center rounded-full bg-[rgba(37,99,235,0.1)] text-[#2563eb] flex-shrink-0 transition-all duration-300 sm:w-16 sm:h-16 sm:text-4xl sm:rounded-xl group-hover:bg-[#2563eb] group-hover:text-white group-hover:scale-110">
                    {item.icon}
                  </div>
                  <div className="flex flex-col text-center flex-1 lg:text-left">
                    <h3 className="text-lg font-bold text-[#0f172a] mb-2 sm:text-xl">{item.title}</h3>
                    <p className="text-sm text-[#6b7280] leading-[1.7] sm:text-base">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full mt-8 mb-8 order-1 lg:w-1/2 lg:mt-0 lg:mb-0 lg:order-0">
            <div className="relative rounded-[2rem] overflow-hidden shadow-[0_25px_50px_rgba(37,99,235,0.15)] group">
              <img
                src="src/assets/imgs/whychooseus.jpg"
                alt="Male Dentist Smiling"
                className="w-full h-auto object-cover block transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
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
    <section className="w-full bg-[#f8fbff] py-12 font-['Inter','Segoe_UI',system-ui,-apple-system,BlinkMacSystemFont,sans-serif] lg:py-24">
      <div className="w-[min(1200px,100%)] mx-auto px-4">
        <div className="text-center max-w-[42rem] mx-auto mb-12 lg:mb-16">
          <span className="text-[#6b7280] text-sm font-medium uppercase tracking-[0.1em] mb-2 block">
            Our Team
          </span>
          <h2 className="text-[clamp(1.875rem,3vw,2.625rem)] font-bold text-[#0f172a] leading-[1.2] mb-4">
            Our <span className="text-[#2563eb]">Professional</span> Team
          </h2>
          <p className="text-[#6b7280] text-base leading-[1.7] px-4 sm:px-0">
            Lorem ipsum dolor sit amet consectetur. Nisi ultricies sed faucibus
            porttitor mus nullam adipiscing.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member) => (
            <div key={member.id} className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(15,23,42,0.06)] border border-[#e5e7eb] transition-all duration-300 hover:shadow-[0_8px_24px_rgba(15,23,42,0.12)] hover:-translate-y-1">
              <div className="w-full aspect-[400/450] overflow-hidden group">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6 text-left">
                <h3 className="text-xl font-bold text-[#0f172a] mb-1">{member.name}</h3>
                <p className="text-[#6b7280] text-sm font-medium">{member.role}</p>
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
    <section className="w-full bg-white py-12 font-['Inter','Segoe_UI',system-ui,-apple-system,BlinkMacSystemFont,sans-serif] lg:py-24">
      <div className="w-[min(1200px,100%)] mx-auto px-4">
        <div className="text-center max-w-[48rem] mx-auto mb-16 px-4">
          <span className="text-[#6b7280] text-sm font-medium uppercase tracking-[0.1em] mb-2 block">
            How It Work
          </span>
          <h2 className="text-[clamp(1.875rem,3vw,2.625rem)] font-bold text-[#0f172a] leading-[1.2] mb-4">
            Your Journey to the{" "}
            <span className="text-[#2563eb]">Perfect Smile</span>
          </h2>
          <p className="text-[#6b7280] text-base leading-[1.7] px-4 sm:px-0">
            Achieve a healthier, brighter smile with expert care and
            personalized treatments. We're here to help every step of the way.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center group">
              <div className="w-20 h-20 bg-[rgba(37,99,235,0.1)] rounded-full flex items-center justify-center text-[#2563eb] text-3xl mb-6 transition-all duration-300 sm:w-24 sm:h-24 sm:text-4xl group-hover:scale-110 group-hover:bg-[#2563eb] group-hover:text-white">
                {step.icon}
              </div>
              <h3 className="text-lg font-bold text-[#0f172a] mb-3 px-2">{step.title}</h3>
              <p className="text-[#6b7280] text-sm leading-[1.7] px-2">{step.desc}</p>
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
    <section className="w-full bg-white pb-12 font-['Inter','Segoe_UI',system-ui,-apple-system,BlinkMacSystemFont,sans-serif] lg:py-12">
      <div className="w-[min(1200px,100%)] mx-auto px-4">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-20">
          <div className="w-full lg:w-1/2">
            <div className="rounded-[2.5rem] overflow-hidden shadow-[0_20px_40px_rgba(15,23,42,0.1)] h-[18.75rem] sm:h-[25rem] lg:h-[31.25rem]">
              <img
                src="src/assets/imgs/contactus.jpg"
                alt="Doctor consultation"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="w-full flex flex-col lg:w-1/2">
            <span className="text-[#6b7280] text-sm font-medium uppercase tracking-[0.1em] mb-2 block">
              Contact Us
            </span>
            <h2 className="text-[clamp(1.875rem,3vw,2.625rem)] font-bold text-[#0f172a] leading-[1.2] mb-6">
              Start Your Journey to a{" "}
              <br className="hidden sm:block" />
              Healthy <span className="text-[#2563eb]">Smile Today!</span>
            </h2>
            <p className="text-[#6b7280] text-base leading-[1.7] mb-8">
              Book your appointment now to take the first step towards a healthy
              smile! Our expert team is waiting for you. Take action now for a
              healthier mouth and teeth.
            </p>

            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-4 cursor-pointer transition-transform duration-200 hover:translate-x-1 group">
                <div className="w-10 h-10 border border-[rgba(37,99,235,0.15)] rounded-full flex items-center justify-center text-[#2563eb] text-sm transition-all duration-300 flex-shrink-0 group-hover:bg-[#2563eb] group-hover:text-white group-hover:border-[#2563eb]">
                  <FaPhoneAlt />
                </div>
                <span className="text-[#6b7280] font-medium transition-colors duration-200 group-hover:text-[#2563eb]">
                  (000) 000-0000
                </span>
              </div>

              <div className="flex items-center gap-4 cursor-pointer transition-transform duration-200 hover:translate-x-1 group">
                <div className="w-10 h-10 border border-[rgba(37,99,235,0.15)] rounded-full flex items-center justify-center text-[#2563eb] text-sm transition-all duration-300 flex-shrink-0 group-hover:bg-[#2563eb] group-hover:text-white group-hover:border-[#2563eb]">
                  <FaEnvelope />
                </div>
                <span className="text-[#6b7280] font-medium transition-colors duration-200 group-hover:text-[#2563eb]">
                  adress@gmail.com
                </span>
              </div>

              <div className="flex items-center gap-4 cursor-pointer transition-transform duration-200 hover:translate-x-1 group">
                <div className="w-10 h-10 border border-[rgba(37,99,235,0.15)] rounded-full flex items-center justify-center text-[#2563eb] text-sm transition-all duration-300 flex-shrink-0 group-hover:bg-[#2563eb] group-hover:text-white group-hover:border-[#2563eb]">
                  <FaMapMarkerAlt />
                </div>
                <span className="text-[#6b7280] font-medium transition-colors duration-200 group-hover:text-[#2563eb]">
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