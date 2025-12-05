import { Link } from "react-router-dom";
import {FaUsers,FaGraduationCap, FaPhone, FaEnvelope, 
  FaMapMarkerAlt, FaChartLine, FaHandshake, FaRocket } from "react-icons/fa";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="fixed w-full bg-white/95 backdrop-blur-md z-50 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-14 h-14 rounded-full">
              <img src='udass.jpg' alt='UDASS logo' className='w-full h-full rounded-full'/>
            </div>
            <span className="text-xl font-bold text-primary-700">UDASS</span>
          </div>
          <div className="hidden md:flex space-x-6">
            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium transition duration-300 hover:scale-105">
              Join Us
            </Link>
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium transition duration-300 hover:scale-105">
              Login
            </Link>
            <a href="#footer" className="text-primary-600 hover:text-primary-700 font-medium transition duration-300 hover:scale-105">
              Contact Us
            </a>
          </div>
        </div>
      </nav>

      <section className="relative bg-gradient-to-br from-primary-600 via-primary-650 to-primary-700 text-white pt-24 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-10 w-32 h-32 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 right-20 w-24 h-24 bg-white rounded-full animate-bounce delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-20 h-20 bg-white rounded-full animate-pulse delay-500"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 py-24 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-left">
              <div className="inline-flex items-center space-x-3 bg-white/20 backdrop-blur rounded-full px-6 py-3 mb-8 border border-white/30">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-lg font-medium">University of Dodoma</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                UDASS
                <span className="block text-3xl md:text-4xl font-light mt-4 opacity-95 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  Actuarial Excellence
                </span>
              </h1>
              
              <p className="text-xl mb-8 opacity-95 leading-relaxed font-light">
                Shaping the future of actuarial science through innovation, exposure, and professional development.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link 
                  to="/register" 
                  className="bg-white text-primary-600 hover:bg-gray-50 font-bold py-4 px-10 rounded-xl transition-all duration-300 transform hover:scale-105 text-lg text-center shadow-2xl hover:shadow-3xl"
                >
                  Become a Member
                </Link>
                <Link
                  to="/login"
                  className="border-2 border-white/60 hover:border-white bg-white/10 backdrop-blur text-white font-bold py-4 px-10 rounded-xl transition-all duration-300 text-lg text-center hover:bg-white/20"
                >
                  Member Login
                </Link>
              </div>

           
              <div className="flex flex-wrap gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">500+</div>
                  <div className="text-white/80">Members</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">50+</div>
                  <div className="text-white/80">Industry Partners</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">100+</div>
                  <div className="text-white/80">Success Stories</div>
                </div>
              </div>
            </div>

           
            <div className="relative">
              <div className="relative bg-white/15 backdrop-blur-xl rounded-3xl p-10 border border-white/25 shadow-2xl">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-white/25 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/30">
                    <FaRocket className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Launch Your Career</h3>
                  <p className="text-white/90">Join the premier actuarial community in Tanzania</p>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { icon: FaChartLine, label: "Growth" },
                    { icon: FaHandshake, label: "Network" },
                    { icon: FaGraduationCap, label: "Learn" },
                    { icon: FaUsers, label: "Connect" }
                  ].map((item, index) => (
                    <div key={index} className="text-center group">
                      <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-white/30 group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-white/90 text-sm font-medium">{item.label}</span>
                    </div>
                  ))}
                </div>
                
                
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-xs font-bold text-gray-900">NEW</span>
                </div>
              </div>
              
        
              <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-primary-500 rounded-2xl rotate-45 opacity-80"></div>
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-primary-400 rounded-3xl rotate-12 opacity-60"></div>
            </div>
          </div>
        </div>
        

        <div className="absolute bottom-0 left-0 right-0 h-12 bg-white rounded-t-3xl"></div>
      </section>


      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="bg-white rounded-3xl p-12 shadow-2xl border border-gray-100 relative overflow-hidden">

            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-50 rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                <FaGraduationCap className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-8">Our Mission</h2>
              <p className="text-xl text-gray-700 leading-relaxed font-medium max-w-3xl mx-auto">
                To provide timely, independent, and innovative actuarial experts and to create equitable exposure, 
                access, and development of actuarial students in the industry.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-primary-700 mb-6">
              Why Join UDASS?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
              Unlock your potential and accelerate your actuarial career with our comprehensive platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: FaUsers, 
                title: "Professional Networking", 
                desc: "Connect with industry leaders, alumni, and peers in the actuarial field through exclusive events and platforms"
              },
              { 
                icon: FaGraduationCap, 
                title: "Skill Development", 
                desc: "Access workshops, seminars, and certification programs to enhance your expertise and stay ahead"
              },
              { 
                icon: FaChartLine, 
                title: "Career Growth", 
                desc: "Exclusive internships, job placements, and industry exposure opportunities with top companies"
              },
            ].map((item, i) => (
              <div key={i} className="group relative">
                <div className="relative bg-white rounded-3xl p-10 shadow-2xl border border-gray-100 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-3 group-hover:border-primary-200 h-full flex flex-col">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                    <item.icon className="w-10 h-10 text-primary-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">{item.title}</h3>
                  <p className="text-gray-600 text-center leading-relaxed flex-grow">{item.desc}</p>
                  
                  <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-primary-200 transition-all duration-500"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-20 h-20 bg-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-16 h-16 bg-white rounded-full animate-bounce delay-1000"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-8">Ready to Start Your Actuarial Journey?</h2>
          <p className="text-xl mb-12 opacity-95 max-w-2xl mx-auto font-light">
            Join hundreds of aspiring actuaries shaping the future of the industry at University of Dodoma
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              to="/register" 
              className="bg-white text-primary-600 hover:bg-gray-50 font-bold py-5 px-12 rounded-xl transition-all duration-300 transform hover:scale-105 text-lg shadow-2xl hover:shadow-3xl"
            >
              Join Now 
            </Link>
            <Link
              to="/login"
              className="border-2 border-white hover:bg-white/15 font-bold py-5 px-12 rounded-xl transition-all duration-300 text-lg backdrop-blur"
            >
              Member Login
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-16" id="footer">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center space-x-3 mb-6">
               <div className="w-14 h-14 rounded-full">
              <img src='udass.jpg' alt='UDASS logo' className='w-full h-full rounded-full'/>
            </div>
              <span className="text-2xl font-bold">UDASS</span>
            </div>
            <p className="text-gray-400 text-lg leading-relaxed">
              University of Dodoma Actuarial Science Students - Shaping future actuaries through excellence and innovation.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-xl mb-6">Contact Information</h4>
            <div className="space-y-4 text-gray-400">
              <p className="flex items-center gap-4 text-lg">
                <FaEnvelope className="w-5 h-5 text-primary-400 flex-shrink-0" />
                udass.udom@gmail.com
              </p>
              <p className="flex items-center gap-4 text-lg">
                <FaPhone className="w-5 h-5 text-primary-400 flex-shrink-0" />
                +255 685 701 975/+255 675 059 863
              </p>
              <p className="flex items-center gap-4 text-lg">
                <FaMapMarkerAlt className="w-5 h-5 text-primary-400 flex-shrink-0" />
                University of Dodoma, Dodoma
              </p>
            </div>
          </div>
          
          <div className="flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-xl mb-6">Quick Links</h4>
              <div className="space-y-3">
                <Link to="/register" className="block text-gray-400 hover:text-white transition duration-300 text-lg hover:translate-x-2">Join Our Community</Link>
                <Link to="/login" className="block text-gray-400 hover:text-white transition duration-300 text-lg hover:translate-x-2">Member Portal</Link>
              </div>
            </div>
            <p className="text-gray-500 text-lg mt-8">
              © {new Date().getFullYear()} UDASS. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;