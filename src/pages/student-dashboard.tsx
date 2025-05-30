'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import ExamCard from '../components/exams/ExamCard';
import { ExamData } from '../pages/exams/types';

const StudentDashboardPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [userName, setUserName] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [exams, setExams] = useState<ExamData[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState<any>(null);
  const [olympiadExamName, setOlympiadExamName] = useState('');
  const [userRole, setUserRole] = useState('');

  // Load user data from localStorage
  useEffect(() => {
    const name = localStorage.getItem('userName');
    const userData = localStorage.getItem('userData');
    const examName = localStorage.getItem('olympiadExamName');
    const role = localStorage.getItem('userRole');

    if (name) setUserName(name);
    if (role) setUserRole(role);

    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        setStudentData(parsedData);
        if (parsedData.olympiadExam) {
          const examNameToSet = parsedData.olympiadExam;
          setOlympiadExamName(examNameToSet);
          localStorage.setItem('olympiadExamName', examNameToSet);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    } else if (examName) {
      setOlympiadExamName(examName);
    }
  }, []);

  // Fetch exams when studentData or olympiadExamName changes
  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/exams');
        if (!response.ok) throw new Error('Network response was not ok');
        const data: ExamData[] = await response.json();

        // Get the current exam name (prefer studentData over localStorage)
        const currentExamName = studentData?.olympiadExam || olympiadExamName || '';

        if (currentExamName) {
          // Filter exams with trimmed title comparison
          const registeredExams = data.filter(
            exam => exam.title.trim() === currentExamName.trim() &&
              exam.status === 'active'
          );

          console.log('Current Exam Name:', currentExamName);
          console.log('Found Exams:', registeredExams);

          setExams(registeredExams);
        } else {
          setExams([]);
        }
      } catch (error) {
        console.error('Error fetching exams:', error);
        setExams([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [studentData, olympiadExamName]);

  // Get current month and year for upcoming exams
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Filter upcoming exams for current month
  const upcomingExams = exams.filter(
    exam => new Date(exam.date).getMonth() === currentMonth &&
      new Date(exam.date).getFullYear() === currentYear
  );

  // Filter exams based on search and filters
  const filterExams = (examList: ExamData[]) =>
    examList.filter(exam => {
      const matchesSearch =
        exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.subject.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSubject = selectedSubject
        ? exam.subject === selectedSubject
        : true;
      const matchesDifficulty = selectedDifficulty
        ? exam.difficulty === selectedDifficulty
        : true;

      return matchesSearch && matchesSubject && matchesDifficulty;
    });

  const filteredExams = filterExams(exams);
  const filteredUpcomingExams = filterExams(upcomingExams);

  // Get unique subjects for filter dropdown
  const subjects = [...new Set(exams.map(exam => exam.subject))];

  return (
    <div className="min-h-screen bg-gray-50 md:px-12"
      style={{
        marginTop: '3rem',
        paddingLeft: '10rem',
        paddingRight: '10rem',
        marginBottom: '3rem',
      }}
    >
      {/* Heading */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-education-dark mb-4">
          Welcome, {userName ? userName : 'User'}!
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          {olympiadExamName
            ? `You are registered for ${olympiadExamName}. Here are your exams:`
            : "You are not currently registered for any exams. Please contact your school administrator."}
        </p>
      </div>

      {/* Search and Filters - Only show if there are exams */}
      {exams.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search bar */}
            <div className="relative mt-[21px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search exams..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-education-blue focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Subject filter */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <select
                id="subject"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-education-blue focus:border-transparent"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                <option value="">All Subjects</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            {/* Difficulty filter */}
            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty
              </label>
              <select
                id="difficulty"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-education-blue focus:border-transparent"
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
      )}

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading exams...</div>
      ) : (
        <>
          {/* Upcoming Exams */}
          {filteredUpcomingExams.length > 0 && (
            <section className="mb-14">
              <h2 className="text-2xl font-semibold text-education-dark mb-4">
                Upcoming Exams This Month
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUpcomingExams.map((exam) => (
                  <ExamCard
                    key={exam.id}
                    id={exam.id}
                    title={exam.title}
                    subject={exam.subject}
                    date={exam.date}
                    duration={exam.duration}
                    difficulty={exam.difficulty}
                    image={exam.image}
                    status={exam.status}
                    isAdmin={userRole === 'admin'}
                  />
                ))}
              </div>
            </section>
          )}

          {/* All Registered Exams */}
          {filteredExams.length > 0 ? (
            <section className="mb-14">
              <h2 className="text-2xl font-semibold text-education-dark mb-4">
                Your Registered Exams
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredExams.map((exam) => (
                  <ExamCard
                    key={exam.id}
                    id={exam.id}
                    title={exam.title}
                    subject={exam.subject}
                    date={exam.date}
                    duration={exam.duration}
                    difficulty={exam.difficulty}
                    image={exam.image}
                    status={exam.status}
                    isAdmin={false}
                  />
                ))}
              </div>
            </section>
          ) : (
            !loading && olympiadExamName && (
              <div className="text-center py-20 text-gray-500">
                No active exams found for {olympiadExamName}.
              </div>
            )
          )}

          {!loading && !olympiadExamName && (
            <div className="text-center py-20 text-gray-500">
              You are not registered for any exams. Please contact your school administrator.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StudentDashboardPage;