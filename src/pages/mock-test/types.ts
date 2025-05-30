
export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  difficulty: "easy" | "medium" | "hard";
}

export interface ExamData {
  id: string;
  title: string;
  subject: string;
  duration: number; // in minutes
  totalQuestions: number;
  instructions: string[];
}

export interface MockTestState {
  currentQuestion: number;
  selectedAnswers: (number | null)[];
  markedForReview: boolean[];
  timeLeft: number; // in seconds
  testSubmitted: boolean;
}
