import { useState } from "react";  
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";



interface ExamActionsProps {
  examId: string;
}

const ExamActions = ({ examId }: ExamActionsProps) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<{
    message: string;
    downloadUrl?: string;
    details?: any;
    failedCount?: number;
    sampleError?: any;
    sampleSuccess?: any;
    errorMessages?: string | null;
    summary?: {
      successCount: number;
      duplicateCount: number;
      errorCount: number;
    };
    rawData?: any;
  } | null>(null);

  const openRegisterModal = () => {
    setFile(null);
    setError(null);
    setSuccessData(null);
    setShowRegisterModal(true);
  };

  const closeRegisterModal = () => {
    setShowRegisterModal(false);
    setSuccessData(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };
const handleUpload = async () => {
  if (!file) {
    setError("Please select a file.");
    return;
  }

  setLoading(true);
  setError(null);
  setSuccessData(null);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("examId", examId);

  try {
    const response = await fetch(`${backendUrl}/api/register-students`, {
      method: "POST",
      body: formData,
    });

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      throw new Error(text.includes('<!DOCTYPE') ? 
        "Server returned an error page" : text);
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Upload failed");
    }

    // Format detailed results
    const successMessages = data.processedStudents
      .filter(s => s.status === "success")
      .map(s => `Row ${s.row}: Registered ${s.data.name} (${s.data.email})`)
      .join('\n');

    const duplicateMessages = data.processedStudents
      .filter(s => s.status === "skipped")
      .map(s => `Row ${s.row}: Skipped - ${s.reason} (ID: ${s.existingId})`)
      .join('\n');

    const errorMessages = data.processedStudents
      .filter(s => s.status === "failed")
      .map(s => `Row ${s.row}: Failed - ${s.error}`)
      .join('\n');

    setSuccessData({
      message: `Registered ${data.successCount}/${data.total} students`,
      summary: {
        successCount: data.successCount,
        duplicateCount: data.duplicateCount,
        errorCount: data.errorCount
      },
      details: {
        successes: successMessages,
        duplicates: duplicateMessages,
        errors: errorMessages
      },
      downloadUrl: data.downloadUrl,
      rawData: data
    });

  } catch (err: any) {
    setError(err.message);
    console.error("Upload error:", err);
  } finally {
    setLoading(false);
  }
};
  return (
    <>
      <div className="bg-white px-6 py-4 border-b border-gray-200">
        <div className="flex flex-wrap gap-4">
          <Button 
            onClick={openRegisterModal} 
            className="bg-education-blue hover:bg-blue-700"
          >
            Register Students
          </Button>

          <Link to={`/mock-tests/${examId}`}>
            <Button 
              variant="outline" 
              className="border-education-blue text-education-blue"
            >
              Start Test
            </Button>
          </Link>
        </div>
      </div>

      {showRegisterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full relative">
            <button
              onClick={closeRegisterModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl font-bold focus:outline-none"
              aria-label="Close"
              type="button"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">Register Students for Exam</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload CSV File
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-education-blue file:text-white
                  hover:file:bg-blue-700"
              />
            </div>

            {error && (
              <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
                {error}
              </div>
            )}

            {successData && (
  <div className="space-y-4">
    <div className="p-3 text-sm text-green-700 bg-green-100 rounded-lg">
      <strong>{successData.message}</strong>
      <a 
        href={`${backendUrl}${successData.downloadUrl}`}
        className="mt-2 block text-blue-600 hover:underline"
        download
      >
        Download All Student Credentials
      </a>
    </div>

    {successData.rawData?.processedStudents?.filter((s: any) => s.status === "failed").length > 0 && (
      <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
        <strong>
          Failed Registrations ({successData.rawData?.processedStudents?.filter((s: any) => s.status === "failed").length}):
        </strong>
        <div className="mt-1 max-h-40 overflow-auto">
          {successData.rawData?.processedStudents
            ?.filter((s: any) => s.status === "failed")
            .map((student: any, i: number) => (
              <div key={i} className="mt-1">
                <strong>Row {student.row}:</strong> {student.error}
              </div>
            ))}
        </div>
      </div>
    )}
  </div>
)}

            <div className="mt-6 flex justify-end space-x-4">
              <Button 
                onClick={closeRegisterModal} 
                disabled={loading} 
                variant="secondary"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleUpload} 
                disabled={loading || !file}
                className="bg-education-blue hover:bg-blue-700"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </>
                ) : "Upload All Students"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExamActions;