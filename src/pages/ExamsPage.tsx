import { useState, useEffect } from "react";
import { Search, Filter, BookOpen, Calendar, Clock, Award } from "lucide-react";
import ExamCard from "../components/exams/ExamCard";
import { ExamData } from "../pages/exams/types";

const ExamsPage = () => {
  const [exams, setExams] = useState<ExamData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/exams");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: ExamData[] = await response.json();
        // Filter only active exams
        const activeExams = data.filter(exam => exam.status === 'active');
        setExams(activeExams);
      } catch (error) {
        console.error("Error fetching exams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  // Filter logic
  const filteredExams = exams.filter((exam) => {
    const matchesSearch =
      exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.subject.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSubject = selectedSubject ? exam.subject === selectedSubject : true;
    const matchesDifficulty = selectedDifficulty ? exam.difficulty === selectedDifficulty : true;

    return matchesSearch && matchesSubject && matchesDifficulty;
  });

  const subjects = [...new Set(exams.map((exam) => exam.subject))];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="education-container">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-education-dark mb-4">Available Exams</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Browse our collection of exams and mock tests to help you prepare for your upcoming academic challenges.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative mt-[21px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search exams..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-education-blue"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <select
                id="subject"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-education-blue"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                <option value="">All Subjects</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty
              </label>
              <select
                id="difficulty"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-education-blue"
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
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading exams...</div>
        ) : (
          <>
            {/* Exams List */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-education-dark">All Exams</h2>
              <p className="text-gray-500 text-sm">Showing {filteredExams.length} exams</p>
            </div>

            {filteredExams.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredExams.map((exam) => (
                  <ExamCard 
                    key={exam.id} 
                    {...exam} 
                    isAdmin={false} 
                    onEdit={() => {}} 
                    onDelete={() => {}} 
                    onStatusToggle={() => {}}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Search size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-education-dark mb-2">No exams found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria to find what you're looking for.</p>
              </div>
            )}

            {/* Why Take Our Exams */}
            <div className="mt-16 pt-12 border-t border-gray-200">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-education-dark mb-4">Why Take Our Exams?</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Our exams and mock tests are designed to help you achieve academic excellence.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <Calendar size={32} className="text-education-blue mb-4" />
                  <h3 className="text-xl font-semibold mb-3 text-education-dark">Structured Timeline</h3>
                  <p className="text-gray-600">
                    Our exams follow a structured timeline that helps you prepare systematically for your final assessments.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <Clock size={32} className="text-education-blue mb-4" />
                  <h3 className="text-xl font-semibold mb-3 text-education-dark">Real Exam Conditions</h3>
                  <p className="text-gray-600">
                    Experience real exam conditions with our timed tests and authentic question formats.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <Award size={32} className="text-education-blue mb-4" />
                  <h3 className="text-xl font-semibold mb-3 text-education-dark">Recognized Certifications</h3>
                  <p className="text-gray-600">
                    Earn certifications that are recognized by educational institutions and employers.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ExamsPage;