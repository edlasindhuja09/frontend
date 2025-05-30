import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ExamHeader from "./exams/components/ExamHeader";
import ExamQuickInfo from "./exams/components/ExamQuickInfo";
import ExamActions from "./exams/components/ExamActions";
import ExamOverviewTab from "./exams/components/ExamOverviewTab";
import ExamSyllabusTab from "./exams/components/ExamSyllabusTab";
import ExamResourcesTab from "./exams/components/ExamResourcesTab";
import ExamFAQsTab from "./exams/components/ExamFAQsTab";
import { ExamData } from "./exams/types"; // make sure types match your backend shape



const ExamDetailPage = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { id } = useParams<{ id: string }>();
  const [exam, setExam] = useState<ExamData | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/exams/${id}`);
        if (!response.ok) throw new Error("Failed to fetch exam");
        const data = await response.json();
        setExam(data);
      } catch (error) {
        console.error("Error fetching exam:", error);
      }
    };

    fetchExam();
  }, [id]);

  if (!exam) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="education-container">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Exam Header */}
          <ExamHeader
            title={exam.title}
            subject={exam.subject}
            difficulty={exam.difficulty}
            image={exam.image}
          />

          {/* Quick Info */}
          <ExamQuickInfo
            date={exam.date}
            duration={exam.duration}
            fee={exam.fee}
            location={exam.location}
          />

          {/* Action Buttons */}
          <ExamActions examId={exam.id} />

          {/* Tabs */}
          <div className="p-6">
            <Tabs defaultValue="overview" onValueChange={setActiveTab} value={activeTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="syllabus">Syllabus</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="faqs">FAQs</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <ExamOverviewTab
                  description={exam.description}
                  eligibility={exam.eligibility}
                  registrationDeadline={exam.registrationDeadline}
                  examDate={exam.date}
                />
              </TabsContent>

              <TabsContent value="syllabus">
                <ExamSyllabusTab syllabus={exam.syllabus} />
              </TabsContent>

              <TabsContent value="resources">
                <ExamResourcesTab resources={exam.resources} />
              </TabsContent>

              <TabsContent value="faqs">
                <ExamFAQsTab faqs={exam.faqs} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamDetailPage;
