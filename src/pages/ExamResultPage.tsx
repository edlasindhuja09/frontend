
import { useLocation, useParams } from "react-router-dom";
import { 
  calculateResultStatistics, 
  calculateDifficultyPerformance, 
  prepareSummaryChartData, 
  prepareDifficultyChartData,
  getFeedbackAndNextSteps,
  getMockResultData
} from "./results/utils";
import { ResultState } from "./results/types";
import ScoreCards from "./results/components/ScoreCards";
import PerformanceCharts from "./results/components/PerformanceCharts";
import FeedbackSection from "./results/components/FeedbackSection";
import QuestionReview from "./results/components/QuestionReview";

const ExamResultPage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  
  // Get result data from router state or mock data if not available
  const resultData = location.state as ResultState || getMockResultData();
  
  // Calculate result statistics
  const {
    totalQuestions,
    answeredQuestions,
    correctAnswers,
    incorrectAnswers,
    notAnswered,
    accuracy,
    score
  } = calculateResultStatistics(resultData);
  
  // Mock data for ranks and percentiles
  const rankData = {
    rank: 12,
    totalParticipants: 263,
    percentile: 95
  };
  
  // Calculate difficulty-wise performance
  const difficultyPerformance = calculateDifficultyPerformance(resultData);
  
  // Prepare chart data
  const summaryData = prepareSummaryChartData(correctAnswers, incorrectAnswers, notAnswered);
  const difficultyData = prepareDifficultyChartData(difficultyPerformance);
  
  // Generate feedback based on score
  const feedback = getFeedbackAndNextSteps(score);
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="education-container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-education-dark mb-2">Test Results</h1>
          <p className="text-gray-600">{resultData.examTitle}</p>
        </div>
        
        {/* Score and rank summary */}
        <ScoreCards 
          score={score}
          correctAnswers={correctAnswers}
          totalQuestions={totalQuestions}
          timeSpent={resultData.timeSpent}
          rankData={rankData}
        />
        
        {/* Performance Charts */}
        <PerformanceCharts
          summaryData={summaryData}
          difficultyData={difficultyData}
        />
        
        {/* Feedback and Next Steps */}
        <FeedbackSection feedback={feedback} />
        
        {/* Answer Review */}
        <QuestionReview
          questions={resultData.questions}
          answers={resultData.answers}
          examId={id}
        />
      </div>
    </div>
  );
};

export default ExamResultPage;
