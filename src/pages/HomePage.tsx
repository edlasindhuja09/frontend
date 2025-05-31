import Hero from "../components/home/Hero";
import Features from "../components/home/Features";
import TestimonialCard from "../components/home/TestimonialCard";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowRight, School, Users, BarChart3, Star, Search } from "lucide-react";
import ExamCard from "../components/exams/ExamCard";
import { ExamData } from "../pages/exams/types";

const HomePage = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [exams, setExams] = useState<ExamData[]>([]);
  const [featuredExams, setFeaturedExams] = useState<ExamData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/exams`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: ExamData[] = await response.json();
        // Filter only active exams
        const activeExams = data.filter(exam => exam.status === 'active');
        setExams(activeExams);
        // Filter featured exams
        const featured = activeExams.filter(exam => exam.featured === true);
        setFeaturedExams(featured);
      } catch (error) {
        console.error("Error fetching exams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  // Filter logic for regular exams
  const filteredExams = exams.filter((exam) => {
    const matchesSearch =
      exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.subject.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSubject = selectedSubject ? exam.subject === selectedSubject : true;
    const matchesDifficulty = selectedDifficulty ? exam.difficulty === selectedDifficulty : true;

    return matchesSearch && matchesSubject && matchesDifficulty;
  });

  const subjects = [...new Set(exams.map((exam) => exam.subject))];

  // Sample data for testimonials
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Student, Grade 10",
      content: "EduVerse helped me prepare for my science olympiad. The mock tests were incredibly similar to the actual exam, which gave me the confidence I needed to succeed.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Parent",
      content: "As a parent, I appreciate the detailed progress reports that help me understand where my child needs additional support. The platform is intuitive and comprehensive.",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      rating: 4,
    },
    {
      name: "Emma Wilson",
      role: "School Coordinator",
      content: "Managing multiple students through EduVerse has streamlined our exam preparation process. The analytics provide valuable insights for our teaching strategy.",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      rating: 5,
    },
  ];

  return (
    <div className="overflow-x-hidden">
      <Hero />
      <Features />
      
      {/* Featured Exams Section */}
      <section className="py-12 md:py-16 bg-gray-50 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-10 gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-education-dark">Featured Exams</h2>
            <Link to="/exams" className="text-education-blue hover:text-blue-700 flex items-center font-medium">
              View All <ArrowRight size={18} className="ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="text-center py-12 sm:py-20 text-gray-500 col-span-full">Loading exams...</div>
            ) : (
              <>
                {featuredExams.length > 0 ? (
                  featuredExams.map((exam) => (
                    <ExamCard 
                      key={exam.id} 
                      {...exam} 
                      isAdmin={false} 
                      onEdit={() => {}} 
                      onDelete={() => {}} 
                      onStatusToggle={() => {}}
                    />
                  ))
                ) : (
                  <div className="text-center py-12 sm:py-16 col-span-full">
                    <Search size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium text-education-dark mb-2">No featured exams available</h3>
                    <p className="text-gray-600">Check back later for featured exams or browse all exams.</p>
                    <Link 
                      to="/exams" 
                      className="mt-4 inline-flex items-center text-education-blue hover:text-blue-700 font-medium"
                    >
                      Browse all exams <ArrowRight size={18} className="ml-1" />
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* All Exams Section */}
      <section className="py-12 md:py-16 bg-white px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 sm:mb-10 gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-education-dark">All Exams</h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
              <input
                type="text"
                placeholder="Search exams..."
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-auto"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-auto"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                <option value="">All Subjects</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-auto"
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
              >
                <option value="">All Levels</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="text-center py-12 sm:py-20 text-gray-500 col-span-full">Loading exams...</div>
            ) : (
              <>
                {filteredExams.length > 0 ? (
                  filteredExams.map((exam) => (
                    <ExamCard 
                      key={exam.id} 
                      {...exam} 
                      isAdmin={false} 
                      onEdit={() => {}} 
                      onDelete={() => {}} 
                      onStatusToggle={() => {}}
                    />
                  ))
                ) : (
                  <div className="text-center py-12 sm:py-16 col-span-full">
                    <Search size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium text-education-dark mb-2">No exams found</h3>
                    <p className="text-gray-600">Try adjusting your search or filter criteria to find what you're looking for.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* For Schools Section */}
      <section className="py-12 md:py-16 bg-white px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-education-dark">For Schools</h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Partner with us to provide your students with comprehensive exam preparation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 - School Registration */}
            <div className="bg-gray-50 p-5 sm:p-6 rounded-lg shadow-md transition hover:shadow-lg">
              <div className="flex items-center mb-3 sm:mb-4 text-education-blue">
                <School size={28} className="mr-2 sm:mr-3" />
                <h3 className="text-lg sm:text-xl font-semibold">School Registration</h3>
              </div>
              <p className="text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base">
                Register your school as a partner and gain access to our comprehensive exam preparation platform.
              </p>
              <Link to="/school-registration" className="text-education-blue hover:text-blue-700 flex items-center font-medium text-sm sm:text-base">
                Learn More <ArrowRight size={18} className="ml-1" />
              </Link>
            </div>

            {/* Card 2 - Bulk Registration */}
            <div className="bg-gray-50 p-5 sm:p-6 rounded-lg shadow-md transition hover:shadow-lg">
              <div className="flex items-center mb-3 sm:mb-4 text-education-blue">
                <Users size={28} className="mr-2 sm:mr-3" />
                <h3 className="text-lg sm:text-xl font-semibold">Bulk Registration</h3>
              </div>
              <p className="text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base">
                Register multiple students at once and manage their accounts from a central dashboard.
              </p>
              <Link to="/bulk-registration" className="text-education-blue hover:text-blue-700 flex items-center font-medium text-sm sm:text-base">
                Learn More <ArrowRight size={18} className="ml-1" />
              </Link>
            </div>

            {/* Card 3 - Performance Tracking */}
            <div className="bg-gray-50 p-5 sm:p-6 rounded-lg shadow-md transition hover:shadow-lg">
              <div className="flex items-center mb-3 sm:mb-4 text-education-blue">
                <BarChart3 size={28} className="mr-2 sm:mr-3" />
                <h3 className="text-lg sm:text-xl font-semibold">Performance Tracking</h3>
              </div>
              <p className="text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base">
                Monitor your students' progress and performance with detailed analytics and reports.
              </p>
              <Link to="/performance-tracking" className="text-education-blue hover:text-blue-700 flex items-center font-medium text-sm sm:text-base">
                Learn More <ArrowRight size={18} className="ml-1" />
              </Link>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center mt-10 sm:mt-12">
            <Link
              to="/signup"
              className="inline-block bg-education-blue text-white hover:bg-blue-700 font-semibold py-2 sm:py-3 px-6 sm:px-8 rounded-md transition-all shadow-md text-sm sm:text-base"
            >
              Become a Partner School
            </Link>
          </div>
        </div>
      </section>

      {/* Become an Olympiad Coordinator Section */}
      <section className="py-12 md:py-16 bg-white px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center bg-education-blue text-white rounded-3xl sm:rounded-[50px] border border-white py-8 sm:py-12 px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">Become an Olympiad Coordinator</h2>
          <p className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
            Join our team of dedicated educators and help students excel in competitive exams. As a coordinator, you'll organize exams, provide guidance, and connect schools with our platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Link
              to="/coordinator-application"
              className="bg-white text-education-blue hover:bg-gray-100 font-semibold py-2 sm:py-3 px-4 sm:px-8 rounded-md transition-all shadow-md text-sm sm:text-base"
            >
              Apply Now
            </Link>
            <Link
              to="/contact"
              className="border border-white text-white hover:bg-blue-700 font-semibold py-2 sm:py-3 px-4 sm:px-8 rounded-md transition-all text-sm sm:text-base"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 md:py-16 bg-white px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-education-dark mb-3 sm:mb-4">What Our Users Say</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Hear from students, parents, and schools who have experienced success with EduVerse.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
