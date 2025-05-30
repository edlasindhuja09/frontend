'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import ExamCard from '../components/exams/ExamCard';

const DashboardPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [userName, setUserName] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');

  useEffect(() => {
    // Retrieve the user's name from localStorage when the component mounts
    const name = localStorage.getItem('userName');
    if (name) {
      setUserName(name);
    }
  }, []);

  const exams = [
    {
      id: 'math-olympiad',
      title: 'Mathematics Olympiad',
      subject: 'Mathematics',
      date: '2025-05-15',
      duration: '2 hours',
      difficulty: 'Medium' as const,
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'science-challenge',
      title: 'National Science Challenge',
      subject: 'Science',
      date: '2025-05-20',
      duration: '2.5 hours',
      difficulty: 'Hard' as const,
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'english-proficiency',
      title: 'English Proficiency Test',
      subject: 'English',
      date: '2025-05-28',
      duration: '1.5 hours',
      difficulty: 'Easy' as const,
      image: 'https://images.unsplash.com/photo-1456513080867-f24f76ced9b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'physics-championship',
      title: 'Physics Championship',
      subject: 'Physics',
      date: '2025-06-05',
      duration: '3 hours',
      difficulty: 'Hard' as const,
      image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
  ];

  const results = [
    {
      exam: 'Mathematics Olympiad',
      score: '85%',
      date: '2025-05-02',
      status: 'Passed',
    },
    {
      exam: 'Science Challenge',
      score: '72%',
      date: '2025-04-28',
      status: 'Passed',
    },
  ];

  const currentMonth = new Date().getMonth();
  const upcomingExams = exams.filter((exam) => new Date(exam.date).getMonth() === currentMonth);

  // Apply filtering to both upcomingExams and all exams
  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject ? exam.subject === selectedSubject : true;
    const matchesDifficulty = selectedDifficulty ? exam.difficulty === selectedDifficulty : true;
    
    return matchesSearch && matchesSubject && matchesDifficulty;
  });

  // Apply filtering to upcomingExams as well
  const filteredUpcomingExams = upcomingExams.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject ? exam.subject === selectedSubject : true;
    const matchesDifficulty = selectedDifficulty ? exam.difficulty === selectedDifficulty : true;
    
    return matchesSearch && matchesSubject && matchesDifficulty;
  });

  const subjects = [...new Set(exams.map(exam => exam.subject))];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-12">
      {/* Heading */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-education-dark mb-4">
          Welcome, {userName ? userName : 'User'}!
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          Explore the exams available to you. Use the search to quickly find what you're looking for.
        </p>
      </div>

      {/* Search and Filter Section */}
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

      {/* Upcoming Exams */}
      <section className="mb-14">
        <h2 className="text-2xl font-semibold text-education-dark mb-4">Upcoming Exams (This Month)</h2>
        {filteredUpcomingExams.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUpcomingExams.map((exam) => (
              <ExamCard key={exam.id} {...exam} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No upcoming exams this month.</p>
        )}
      </section>

      {/* All Exams (Searchable) */}
      <section className="mb-14">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-education-dark">All Mock Tests</h2>
          <div className="text-gray-500 text-sm">
            Showing {filteredExams.length} of {exams.length} exams
          </div>
        </div>
        {filteredExams.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExams.map((exam) => (
              <ExamCard key={exam.id} {...exam} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Search size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-medium text-education-dark mb-2">No exams found</h3>
            <p className="text-gray-600">Try adjusting your search term.</p>
          </div>
        )}
      </section>

      {/* Results */}
      <section>
        <h2 className="text-2xl font-semibold text-education-dark mb-4">Your Results</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-sm">
            <thead className="bg-education-blue text-white">
              <tr>
                <th className="py-3 px-4 text-left">Exam</th>
                <th className="py-3 px-4 text-left">Score</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={index} className="border-t">
                  <td className="py-3 px-4">{result.exam}</td>
                  <td className="py-3 px-4">{result.score}</td>
                  <td className="py-3 px-4">{result.date}</td>
                  <td className="py-3 px-4">{result.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
