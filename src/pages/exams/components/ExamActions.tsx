import { useState } from "react";  
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ExamActionsProps {
  examId: string;
}

const ExamActions = ({ examId }: ExamActionsProps) => {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const openRegisterModal = () => {
    setFile(null);
    setError(null);
    setSuccessMessage(null);
    setShowRegisterModal(true);
  };

  const closeRegisterModal = () => {
    setShowRegisterModal(false);
    setSuccessMessage(null);
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
    setSuccessMessage(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("examId", examId);

    try {
      const response = await fetch("http://localhost:5000/api/register-students", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

     setSuccessMessage("All students registered successfully!");

    } catch (err: any) {
      setError(`Failed to upload file: ${err.message || "Unknown error"}`);
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

            {successMessage && (
              <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">
                {successMessage}
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
