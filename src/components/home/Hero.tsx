import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Award, Users } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { ExamData } from "../../pages/exams/types";
import { useAuth } from "../../context/AuthContext";

const Hero = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { isLoggedIn } = useAuth();
  const [featuredExams, setFeaturedExams] = useState<ExamData[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const slideInterval = useRef<NodeJS.Timeout>();

  const fetchExams = async () => {
    if (loading || featuredExams.length > 0) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/exams`);
      if (!response.ok) throw new Error("Failed to fetch exams");

      const data = await response.json();
      const featured = data.filter(
        (exam: ExamData) => exam.featured && exam.status === "active"
      );
      setFeaturedExams(featured);
    } catch (err) {
      console.error("Error fetching exams:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          fetchExams();
        }
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => {
      observer.disconnect();
      if (slideInterval.current) clearInterval(slideInterval.current);
    };
  }, []);

  useEffect(() => {
    if (featuredExams.length <= 1) return;

    if (slideInterval.current) clearInterval(slideInterval.current);
    
    slideInterval.current = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === featuredExams.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => {
      if (slideInterval.current) clearInterval(slideInterval.current);
    };
  }, [featuredExams.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    if (slideInterval.current) clearInterval(slideInterval.current);
    slideInterval.current = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === featuredExams.length - 1 ? 0 : prev + 1
      );
    }, 5000);
  };

  return (
    <div
      className="bg-gradient-to-b from-blue-50 to-white py-16 md:py-20"
      ref={heroRef}
    >
      <div className="education-container">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2 mb-10 lg:mb-0 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-education-dark mb-6 leading-tight">
              Elevate Your{" "}
              <span className="text-education-blue">Academic</span> Journey
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl">
              Join thousands of students preparing for exams through our
              comprehensive platform. Expert-designed mock tests, personalized
              feedback, and proven results.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              {!isLoggedIn && (
                <Link
                  to="/register"
                  className="btn-primary text-center py-3 px-8 text-lg hover:scale-105 transition-transform"
                >
                  Get Started
                </Link>
              )}
              <Link
                to="/exams"
                className="btn-outline text-center py-3 px-8 text-lg flex items-center justify-center hover:scale-105 transition-transform"
              >
                Explore Exams <ArrowRight size={18} className="ml-2" />
              </Link>
            </div>
          </div>

          <div className="lg:w-5/12 lg:pl-8 relative">
            {loading ? (
              <div className="flex items-center justify-center h-96 bg-white rounded-xl shadow-xl">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-education-blue"></div>
                <span className="ml-3 text-gray-600">Loading featured exams...</span>
              </div>
            ) : featuredExams.length > 0 ? (
              <div className="relative">
                <div className="bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
                  <div className="relative h-64 overflow-hidden">
                    {featuredExams.map((exam, index) => (
                      <img
                        key={exam.id}
                        src={
                          exam.image ||
                          "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                        }
                        alt={exam.title}
                        className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-500 ${
                          currentSlide === index ? 'opacity-100' : 'opacity-0'
                        }`}
                        loading={index === 0 ? 'eager' : 'lazy'}
                      />
                    ))}
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="bg-blue-100 text-education-blue text-xs font-semibold px-3 py-1 rounded-full">
                        Featured
                      </span>
                      <span className="text-sm text-gray-500">
                        {featuredExams[currentSlide]?.date &&
                          new Date(
                            featuredExams[currentSlide].date
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {featuredExams[currentSlide]?.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {featuredExams[currentSlide]?.description}
                    </p>
                    <Link
                      to={`/exams/${featuredExams[currentSlide]?.id}`}
                      className="text-education-blue font-medium hover:underline flex items-center group"
                    >
                      Learn More{" "}
                      <ArrowRight 
                        size={16} 
                        className="ml-1 group-hover:translate-x-1 transition-transform" 
                      />
                    </Link>
                  </div>
                </div>

                {featuredExams.length > 1 && (
                  <div className="flex justify-center mt-4 space-x-2">
                    {featuredExams.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          currentSlide === index
                            ? "bg-education-blue w-6"
                            : "bg-gray-300 hover:bg-gray-400"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Default exam image"
                  className="w-full h-64 object-cover object-center"
                  loading="eager"
                />
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="bg-blue-100 text-education-blue text-xs font-semibold px-3 py-1 rounded-full">
                      Featured
                    </span>
                    <span className="text-sm text-gray-500">Coming Soon</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Featured Exams</h3>
                  <p className="text-gray-600 mb-4">
                    Check back soon for our featured exams!
                  </p>
                  <Link
                    to="/exams"
                    className="text-education-blue font-medium hover:underline flex items-center group"
                  >
                    Browse Exams{" "}
                    <ArrowRight 
                      size={16} 
                      className="ml-1 group-hover:translate-x-1 transition-transform" 
                    />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center transition-transform hover:scale-105">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen size={32} className="text-education-blue" />
            </div>
            <h3 className="text-2xl font-bold text-education-dark mb-2">
              500+
            </h3>
            <p className="text-gray-600">Mock Tests Available</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center transition-transform hover:scale-105">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={32} className="text-education-blue" />
            </div>
            <h3 className="text-2xl font-bold text-education-dark mb-2">
              50,000+
            </h3>
            <p className="text-gray-600">Students Enrolled</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center transition-transform hover:scale-105">
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
