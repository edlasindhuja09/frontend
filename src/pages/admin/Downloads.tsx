import { useEffect, useState } from "react";

const Downloads = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [filters, setFilters] = useState({
    usertype: "",
    schoolname: ""
  });

  const [filterOptions, setFilterOptions] = useState({
    schools: [],
    userTypes: ["student", "sales", "school", "admin"]
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchFilterOptions = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/student-filters`);
      if (!response.ok) {
        throw new Error("Failed to fetch filter options");
      }
      const data = await response.json();
      setFilterOptions((prev) => ({
        ...prev,
        schools: data.schools || []
      }));
    } catch (err) {
      console.error("Error fetching filters:", err);
      setError("Failed to load filter options.");
    }
  };

  const generateAndDownloadExport = async () => {
    setIsGenerating(true);
    setError("");
    setSuccessMessage("");

    try {
      const params = new URLSearchParams();
      if (filters.usertype) params.append("usertype", filters.usertype);
      if (filters.schoolname) params.append("schoolname", filters.schoolname);

      const response = await fetch(
        `${backendUrl}/api/generate-csv?${params.toString()}`
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Export failed");
      }

      // Get the filename from the Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'export.csv';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      // Create blob from response
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      
      // Trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      window.URL.revokeObjectURL(downloadUrl);

      setSuccessMessage("File downloaded successfully!");

    } catch (err) {
      console.error("Export Error:", err);
      setError(err.message || "Failed to download file");
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold mb-4">Generate Filtered Export</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">
            {successMessage}
          </div>
        )}

        <div className="bg-white p-4 sm:p-6 rounded shadow mb-6 grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User Type
            </label>
            <select
              value={filters.usertype}
              onChange={(e) =>
                setFilters({ ...filters, usertype: e.target.value })
              }
              className="w-full p-2 border rounded"
            >
              <option value="">Select User Type</option>
              {filterOptions.userTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              School Name
            </label>
            <select
              value={filters.schoolname}
              onChange={(e) =>
                setFilters({ ...filters, schoolname: e.target.value })
              }
              className="w-full p-2 border rounded"
            >
              <option value="">Select School</option>
              {filterOptions.schools.map((school) => (
                <option key={school} value={school}>
                  {school}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={generateAndDownloadExport}
          disabled={isGenerating || (!filters.usertype && !filters.schoolname)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          {isGenerating ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </span>
          ) : "Generate and Download"}
        </button>
      </div>
    </div>
  );
};

export default Downloads;
