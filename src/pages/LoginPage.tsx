import { Link } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="education-container">
        <div className="max-w-md mx-auto text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-education-blue">My Olympiad</Link>
          <h1 className="mt-6 text-3xl font-bold text-education-dark">Welcome Back</h1>
          <p className="mt-2 text-gray-600">Log in to continue your learning journey</p>
        </div>
        
        <LoginForm />
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            By logging in, you agree to our{" "}
            <Link to="/terms" className="text-education-blue hover:underline">Terms of Service</Link>
            {" "}and{" "}
            <Link to="/privacy" className="text-education-blue hover:underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
