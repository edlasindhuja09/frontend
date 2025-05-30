
import { ExamData, Question } from "./types";

// Mock exam data
export const mockExamData: ExamData = {
  id: "default-id",
  title: "Mathematics Olympiad Mock Test",
  subject: "Mathematics",
  duration: 60, // in minutes
  totalQuestions: 10,
  instructions: [
    "Read each question carefully before answering.",
    "Each question has only one correct answer.",
    "There is no negative marking for wrong answers.",
    "You can navigate between questions using the navigation panel.",
    "You can mark questions for review and come back to them later.",
  ]
};

// Mock questions data
export const mockQuestions: Question[] = [
  {
    id: 1,
    text: "If x² + y² = 25 and x + y = 7, find the value of x × y.",
    options: ["10", "12", "24", "49/4"],
    correctAnswer: 1,
    difficulty: "medium"
  },
  {
    id: 2,
    text: "What is the sum of the first 100 positive integers?",
    options: ["5050", "5000", "5150", "10100"],
    correctAnswer: 0,
    difficulty: "easy"
  },
  {
    id: 3,
    text: "If the sequence a₁, a₂, a₃, ... is defined by a₁ = 3 and aₙ₊₁ = 2aₙ - 1 for all n ≥ 1, what is a₄?",
    options: ["11", "17", "23", "31"],
    correctAnswer: 2,
    difficulty: "medium"
  },
  {
    id: 4,
    text: "What is the value of cos(30°) × cos(60°) - sin(30°) × sin(60°)?",
    options: ["0", "0.25", "0.5", "0.75"],
    correctAnswer: 0,
    difficulty: "medium"
  },
  {
    id: 5,
    text: "How many 4-digit numbers are there such that the digit sum is exactly 9?",
    options: ["84", "126", "220", "330"],
    correctAnswer: 1,
    difficulty: "hard"
  },
  {
    id: 6,
    text: "If the radius of a circle is increased by 50%, by what percentage does the area increase?",
    options: ["50%", "75%", "100%", "125%"],
    correctAnswer: 3,
    difficulty: "easy"
  },
  {
    id: 7,
    text: "What is the sum of all the interior angles of a regular octagon?",
    options: ["540°", "720°", "1080°", "1440°"],
    correctAnswer: 2,
    difficulty: "medium"
  },
  {
    id: 8,
    text: "Solve for x: log₄(x) + log₄(4x) = 3",
    options: ["2", "4", "8", "16"],
    correctAnswer: 0,
    difficulty: "hard"
  },
  {
    id: 9,
    text: "How many different ways can 8 people be seated around a circular table?",
    options: ["40320", "5040", "56", "1"],
    correctAnswer: 1,
    difficulty: "medium"
  },
  {
    id: 10,
    text: "If a and b are the roots of the equation x² - 5x + 6 = 0, what is the value of a² + b²?",
    options: ["13", "25", "30", "37"],
    correctAnswer: 1,
    difficulty: "medium"
  }
];
