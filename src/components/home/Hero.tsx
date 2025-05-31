import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Award, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { ExamData } from "../../pages/exams/types";

const Hero = () => {
   const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [featuredExams, setFeaturedExams] = useState<ExamData[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
 

  useEffect(() => {
    // Check login status when component mounts
    const checkLoginStatus = () => {
      const userToken = localStorage.getItem("userToken");
      setIsLoggedIn(!!userToken);
    };

    checkLoginStatus();

    // Listen for storage changes to detect logout from other tabs/windows
    const handleStorageChange = () => {
      checkLoginStatus();
    };

    // Fetch all exams and filter featured ones
    const fetchExams = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/exams`);
        if (!response.ok) {
          throw new Error('Failed to fetch exams');
        }
        const data = await response.json();
        // Filter exams where featured is true and status is active
        const featured = data.filter((exam: ExamData) => 
          exam.featured === true && exam.status === 'active'
        );
        setFeaturedExams(featured);
      } catch (err) {
        console.error('Error fetching exams:', err);
      }
    };

    fetchExams();

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Auto-rotate carousel every 5 seconds
  useEffect(() => {
    if (featuredExams.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => 
        prev === featuredExams.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredExams.length]);

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white py-16 md:py-20">
      <div className="education-container">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2 mb-10 lg:mb-0 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-education-dark mb-6 leading-tight">
              Elevate Your <span className="text-education-blue">Academic</span> Journey
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl">
              Join thousands of students preparing for exams through our comprehensive platform. Expert-designed mock tests, personalized feedback, and proven results.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              {!isLoggedIn && (
                <Link to="/register" className="btn-primary text-center py-3 px-8 text-lg">
                  Get Started
                </Link>
              )}
              <Link to="/exams" className="btn-outline text-center py-3 px-8 text-lg flex items-center justify-center">
                Explore Exams <ArrowRight size={18} className="ml-2" />
              </Link>
            </div>
          </div>

          <div className="lg:w-5/12 lg:pl-8 relative">
            {featuredExams.length > 0 ? (
              <div className="relative">
                <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                  <img
                    src={featuredExams[currentSlide]?.image || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"}
                    alt={featuredExams[currentSlide]?.title}
                    className="w-full h-64 object-cover object-center"
                  />
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="bg-blue-100 text-education-blue text-xs font-semibold px-3 py-1 rounded-full">Featured</span>
                      <span className="text-sm text-gray-500">
                        {featuredExams[currentSlide]?.date && new Date(featuredExams[currentSlide].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{featuredExams[currentSlide]?.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {featuredExams[currentSlide]?.description}
                    </p>
                    <Link 
                      to={`/exams/${featuredExams[currentSlide]?.id}`} 
                      className="text-education-blue font-medium hover:underline flex items-center"
                    >
                      Learn More <ArrowRight size={16} className="ml-1" />
                    </Link>
                  </div>
                </div>
                
                {/* Indicators only - no navigation buttons */}
                {featuredExams.length > 1 && (
                  <div className="flex justify-center mt-4 space-x-2">
                    {featuredExams.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${currentSlide === index ? 'bg-education-blue' : 'bg-gray-300'}`}
                        aria-label={`Slide ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Default exam image"
                  className="w-full h-64 object-cover object-center"
                />
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="bg-blue-100 text-education-blue text-xs font-semibold px-3 py-1 rounded-full">Featured</span>
                    <span className="text-sm text-gray-500">Coming Soon</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Featured Exams</h3>
                  <p className="text-gray-600 mb-4">Check back soon for our featured exams!</p>
                  <Link to="/exams" className="text-education-blue font-medium hover:underline flex items-center">
                    Browse Exams <ArrowRight size={16} className="ml-1" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen size={32} className="text-education-blue" />
            </div>
            <h3 className="text-2xl font-bold text-education-dark mb-2">500+</h3>
            <p className="text-gray-600">Mock Tests Available</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={32} className="text-education-blue" />
            </div>
            <h3 className="text-2xl font-bold text-education-dark mb-2">50,000+</h3>
            <p className="text-gray-600">Students Enrolled</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award size={32} className="text-education-blue" />
            </div>
            <h3 className="text-2xl font-bold text-education-dark mb-2">95%</h3>
            <p className="text-gray-600">Success Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
