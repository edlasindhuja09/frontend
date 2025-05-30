
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { mockExamData, mockQuestions } from "./data";
import { Question, MockTestState } from "./types";

// Components
import Instructions from "./components/Instructions";
import QuestionContent from "./components/QuestionContent";
import TimerProgress from "./components/TimerProgress";
import QuestionPalette from "./components/QuestionPalette";

const MockTestPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Use mock data but override ID if provided
  const examData = {
    ...mockExamData,
    id: id || mockExamData.id
  };
  
  // State variables
  const [state, setState] = useState<MockTestState>({
    currentQuestion: 0,
    selectedAnswers: Array(mockQuestions.length).fill(null),
    markedForReview: Array(mockQuestions.length).fill(false),
    timeLeft: examData.duration * 60, // in seconds
    testSubmitted: false
  });
  
  // Timer effect
  useEffect(() => {
    if (state.timeLeft > 0 && !state.testSubmitted) {
      const timer = setTimeout(() => 
        setState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 })), 
      1000);
      return () => clearTimeout(timer);
    } else if (state.timeLeft === 0 && !state.testSubmitted) {
      handleSubmitTest();
    }
  }, [state.timeLeft, state.testSubmitted]);
  
  // Calculate progress
  const answeredQuestions = state.selectedAnswers.filter(answer => answer !== null).length;
  const progress = (answeredQuestions / mockQuestions.length) * 100;
  
  // Handle question navigation
  const goToQuestion = (index: number) => {
    setState(prev => ({ ...prev, currentQuestion: index }));
  };
  
  // Handle answer selection
  const handleSelectAnswer = (answerIndex: number) => {
    setState(prev => {
      const newAnswers = [...prev.selectedAnswers];
      newAnswers[prev.currentQuestion] = answerIndex;
      return { ...prev, selectedAnswers: newAnswers };
    });
  };
  
  // Toggle mark for review
  const toggleMarkForReview = () => {
    setState(prev => {
      const newMarked = [...prev.markedForReview];
      newMarked[prev.currentQuestion] = !newMarked[prev.currentQuestion];
      return { ...prev, markedForReview: newMarked };
    });
  };
  
  // Handle save and next
  const handleSaveAndNext = () => {
    if (state.currentQuestion < mockQuestions.length - 1) {
      setState(prev => ({ ...prev, currentQuestion: prev.currentQuestion + 1 }));
    }
  };
  
  // Handle previous question
  const handlePrevious = () => {
    if (state.currentQuestion > 0) {
      setState(prev => ({ ...prev, currentQuestion: prev.currentQuestion - 1 }));
    }
  };
  
  // Handle submit test
  const handleSubmitTest = () => {
    setState(prev => ({ ...prev, testSubmitted: true }));
    
    toast({
      title: "Mock Test Submitted",
      description: "Your answers have been successfully submitted.",
    });
    
    // Navigate to results page with answers data
    setTimeout(() => {
      navigate(`/exam-results/${id}`, { 
        state: { 
          answers: state.selectedAnswers,
          questions: mockQuestions,
          examTitle: examData.title,
          timeSpent: examData.duration * 60 - state.timeLeft
        } 
      });
    }, 1500);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="education-container">
        {/* Instructions Modal */}
        {!state.testSubmitted && (
          <Instructions 
            examData={examData}
            timeLeft={state.timeLeft}
          />
        )}
        
        {/* Main test area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Question and options */}
          <div className="lg:col-span-2">
            <QuestionContent
              question={mockQuestions[state.currentQuestion]}
              currentQuestion={state.currentQuestion}
              totalQuestions={mockQuestions.length}
              selectedAnswer={state.selectedAnswers[state.currentQuestion]}
              testSubmitted={state.testSubmitted}
              handleSelectAnswer={handleSelectAnswer}
              handlePrevious={handlePrevious}
              handleSaveAndNext={handleSaveAndNext}
              toggleMarkForReview={toggleMarkForReview}
              isMarkedForReview={state.markedForReview[state.currentQuestion]}
            />
          </div>
          
          {/* Question palette and timer */}
          <div className="lg:col-span-1">
            <TimerProgress 
              timeLeft={state.timeLeft}
              progress={progress}
              answeredQuestions={answeredQuestions}
              totalQuestions={mockQuestions.length}
            />
            
            <QuestionPalette
              totalQuestions={mockQuestions.length}
              currentQuestion={state.currentQuestion}
              selectedAnswers={state.selectedAnswers}
              markedForReview={state.markedForReview}
              goToQuestion={goToQuestion}
              handleSubmitTest={handleSubmitTest}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockTestPage;
