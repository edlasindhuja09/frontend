
import { Link } from "react-router-dom";
import { Calendar, Clock, BookOpen, ChevronRight, Pencil, EyeOff, Eye, Trash2 } from "lucide-react";

interface ExamCardProps {

  id: string;
  title: string;
  subject: string;
  date: string;
  duration: string;
  difficulty: "Easy" | "Medium" | "Hard";
  image: string;
  status?: 'active' | 'inactive'; // Add this
  isAdmin?: boolean;              // Admin mode toggle
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  onStatusToggle?: (id: string) => void;
}
const ExamCard = ({
  id,
  title,
  subject,
  date,
  duration,
  difficulty,
  image,
  status = 'active',
  isAdmin = false,
  onDelete,
  onEdit,
  onStatusToggle
}: ExamCardProps) => {
  const getDifficultyColor = () => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Hard": return "bg-red-100 text-red-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
      <div className="relative">
        <img src={image} alt={title} className="w-full h-48 object-cover" />

        {/* Difficulty Badge */}
        <div className="absolute top-4 right-4">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getDifficultyColor()}`}>
            {difficulty}
          </span>
        </div>

        {/* Admin Controls */}
        {isAdmin && (
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <button
              onClick={() => onEdit?.(id)}
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition flex items-center justify-center"
              aria-label="Edit exam"
            >
              <Pencil className="h-5 w-5 text-white" />
            </button>
            
        <button
          onClick={() => onStatusToggle?.(id)}
          className={`p-2 rounded-full ${status === 'active' ? 'bg-green-500' : 'bg-gray-400'} flex items-center justify-center`}
          aria-label="Toggle status"
        >
          {status === 'active' ? (
            <Eye className="h-5 w-5 text-white" />
          ) : (
            <EyeOff className="h-5 w-5 text-white" />
          )}
        </button>
          <button
            onClick={() => onDelete?.(id)}
            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition flex items-center justify-center"
            aria-label="Delete exam"
          >
            <Trash2 className="h-5 w-5 text-white" />
          </button>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5">
        <div className="text-sm font-medium text-education-blue mb-2">{subject}</div>
        <h3 className="text-xl font-semibold mb-3 text-education-dark">{title}</h3>

        <div className="flex flex-col space-y-2 mb-4">
          <div className="flex items-center text-gray-600 text-sm">
            <Calendar size={16} className="mr-2" />
            <span>{new Date(date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <Clock size={16} className="mr-2" />
            <span>{duration}</span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <Link
            to={`/mock-tests/${id}`}
            className="text-education-teal hover:text-teal-700 font-medium flex items-center text-sm"
          >
            <BookOpen size={16} className="mr-1" /> Try Mock Test
          </Link>
          <Link
            to={`/exams/${id}`}
            className="text-education-blue hover:text-blue-700 font-medium flex items-center text-sm"
          >
            View Details <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExamCard;