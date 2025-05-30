import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import UserTypeSelector from "../ui/UserTypeSelector";
import { useAuth } from "../../contexts/AuthContext";


const RegisterForm = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);
  const { login } = useAuth();
  


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    schoolName: "",
    schoolId: "",
    address: ""
  });

  const handleUserTypeSelect = (type) => {
    setUserType(type);
    setStep(2);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setMessage(null);

  if (formData.password !== formData.confirmPassword) {
    setMessage("Passwords do not match");
    setMessageType("error");
    setIsLoading(false);
    return;
  }

  let payload: any = {
    userType,
    name: formData.name,
    email: formData.email,
    password: formData.password,
    confirmPassword: formData.confirmPassword
  };

  if (userType === "admin") {
    payload.phoneNumber = formData.phoneNumber;
  }

  if (userType === "school") {
    payload.schoolName = formData.schoolName;
    payload.schoolId = formData.schoolId;
    payload.address = formData.address;
  }

  try {
    const response = await fetch(`${backendUrl}/api/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Registration failed");

    setMessage("You have registered successfully!");
    setMessageType("success");

    login(result.token, result.userType);
localStorage.setItem("userName", formData.name);
localStorage.setItem("userId", result.userId);


     // Wait 2 seconds before navigating to show the message
      setTimeout(() => {
        switch (result.userType) {
          case "student":
            navigate("/student-dashboard");
            break;
          case "sales":
            navigate("/sales-dashboard");
            break;
          case "admin":
            navigate("/admin-dashboard");
            break;
          case "school":
            navigate("/school-dashboard");
            break;
          default:
            navigate("/not-found");
        }
      }, 2000);

    } catch (err: any) {
      setMessage(err.message);
      setMessageType("error");
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        {step === 1 ? (
          <UserTypeSelector 
            onSelect={handleUserTypeSelect} 
            mode="signup" 
            allowedTypes={["admin", "school"]} // Only show these options
          />
        ) : (
          <>
            <div className="mb-4">
              <button onClick={() => setStep(1)} className="flex items-center text-gray-600 hover:text-blue-500">
                <ArrowLeft className="mr-2" size={18} /> Back
              </button>
            </div>
            <h2 className="text-xl font-semibold mb-6">
              Create Your {userType.charAt(0).toUpperCase() + userType.slice(1)} Account
            </h2>

            {message && (
              <div className={`mb-6 p-3 rounded text-center ${
                messageType === "success"
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : "bg-red-100 text-red-800 border border-red-200"
              }`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {userType === "admin" && (
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {userType === "school" && (
                <>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-1">School Name</label>
                    <input
                      name="schoolName"
                      value={formData.schoolName}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-1">School Registration ID</label>
                    <input
                      name="schoolId"
                      value={formData.schoolId}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-1">School Address</label>
                    <input
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}

              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(prev => !prev)}
                    className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className={`w-full py-2 rounded text-white font-medium transition-colors ${
                  isLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Registering..." : "Register"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default RegisterForm;