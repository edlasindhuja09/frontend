import { useState } from "react";
import { User, School, ShieldCheck, Briefcase } from "lucide-react";

interface UserType {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
}

interface UserTypeSelectorProps {
  onSelect: (type: string) => void;
  mode: "signup" | "login";
  allowedTypes?: string[];
}

const allUserTypes: UserType[] = [
  {
    id: "student",
    title: "Student",
    description: "Take exams, practice with mock tests, track your progress",
    icon: <User size={24} className="text-education-blue" />,
  },
  {
    id: "school",
    title: "School",
    description: "Manage student participation, coordinate exams",
    icon: <School size={24} className="text-education-blue" />,
  },
  {
    id: "admin",
    title: "Admin",
    description: "Platform administrators only",
    icon: <ShieldCheck size={24} className="text-education-blue" />,
  },
  {
    id: "sales",
    title: "Sales",
    description: "Manage inquiries, outreach, and school onboarding",
    icon: <Briefcase size={24} className="text-education-blue" />,
  },
];

const UserTypeSelector = ({ onSelect, mode }: UserTypeSelectorProps) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const filteredUserTypes = mode === "signup"
    ? allUserTypes.filter(type => ["school", "admin"].includes(type.id))
    : allUserTypes.filter(type => ["student", "school", "admin", "sales"].includes(type.id));

  const handleSelect = (typeId: string) => {
    setSelectedType(typeId);
    onSelect(typeId);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center text-education-dark">
        Select Your User Type
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredUserTypes.map((type) => (
          <div
            key={type.id}
            className={`border rounded-lg p-5 cursor-pointer transition-all ${
              selectedType === type.id
                ? "border-education-blue bg-blue-50"
                : "border-gray-200 hover:border-education-blue hover:bg-gray-50"
            }`}
            onClick={() => handleSelect(type.id)}
          >
            <div className="flex items-center mb-3">
              <div className="mr-3">{type.icon}</div>
              <h3 className="text-xl font-medium text-education-dark">{type.title}</h3>
            </div>
            <p className="text-gray-600 text-sm">{type.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserTypeSelector;
