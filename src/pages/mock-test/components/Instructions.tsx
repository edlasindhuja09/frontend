
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { ExamData } from "../types";
import { formatTime } from "../utils";

interface InstructionsProps {
  examData: ExamData;
  timeLeft: number;
}

const Instructions = ({ examData, timeLeft }: InstructionsProps) => {
  return (
    <div className="mb-6">
      <Card className="border-education-blue">
        <CardHeader className="bg-education-blue text-white">
          <CardTitle className="flex justify-between items-center">
            <span>{examData.title} - Instructions</span>
            <span className="flex items-center text-base">
              <Clock className="mr-1 h-5 w-5" /> Time Left: {formatTime(timeLeft)}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <ul className="list-disc pl-5 space-y-1">
            {examData.instructions.map((instruction, index) => (
              <li key={index} className="text-gray-700">{instruction}</li>
            ))}
          </ul>
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              Total Questions: {examData.totalQuestions} | 
              Subject: {examData.subject} | 
              Duration: {examData.duration} minutes
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Instructions;
