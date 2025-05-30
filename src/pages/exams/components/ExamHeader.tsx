
import { Badge } from "@/components/ui/badge";
import { DifficultyType } from "../types";

interface ExamHeaderProps {
  title: string;
  subject: string;
  difficulty: DifficultyType;
  image: string;
}

export const getDifficultyVariant = (difficulty: DifficultyType) => {
  if (difficulty === "Easy") return "default";
  if (difficulty === "Medium") return "secondary";
  return "destructive";
};

const ExamHeader = ({ title, subject, difficulty, image }: ExamHeaderProps) => {
  return (
    <div className="relative">
      <img 
        src={image} 
        alt={title} 
        className="w-full h-64 object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 text-white">
        <div className="mb-2">
          <Badge variant="secondary" className="mb-2">{subject}</Badge>
          <Badge variant={getDifficultyVariant(difficulty)} className="ml-2">
            {difficulty}
          </Badge>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
      </div>
    </div>
  );
};

export default ExamHeader;
