import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { onLogin } from "../utils/api";
import Loading from "../components/UI/Loading";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [credentialsInfo, setCredentialsInfo] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }

    setIsLoading(true);

    try {
      const response = await onLogin(formData);
      login(response.data);
      navigate("/");
    } catch (error) {
      setError(error.response?.data?.error || "Error logging in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto h-full flex items-center justify-center">
      <div className="card w-full max-w-md">
        <div className="text-center flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold text-dark">Login Here!</h1>
          <span
            onClick={() => setCredentialsInfo(true)}
            className="btn-secondary"
          >
            Demo credentials
          </span>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg py-2 px-3 mb-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              placeholder="example@gmail.com"
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Lock className="h-4 w-4 mr-2" />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="********"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full btn-primary ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? <Loading text="Logging in..." /> : "Login"}
          </button>
        </form>

        <div className=" text-center">
          <p className="text-gray-600">
            Don't have an account'?{" "}
            <Link
              to="/register"
              className="text-primary hover:text-lime-700 font-medium"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>

      {credentialsInfo && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center p-4 z-[999]">
          <div className="p-4 md:p-6 bg-light rounded-lg border border-primary flex flex-col gap-3 w-md">
            <h1 className="text-center text-2xl text-dark font-semibold">
              Credentials
            </h1>
            <div>
              <h3 className="font-medium text-primary text-base mb-2">
                Admin User:
              </h3>
              <ul className="text-sm font-medium text-gray-600 space-y-1 bg-gray-100 px-3 py-2 rounded-md border border-transparent hover:border-primary flex flex-col gap-1.5">
                <li className=" flex items-center">
                  <Mail className="size-4 mr-2" />
                  Email: admin@restaurant.com
                </li>
                <li className="flex items-center">
                  <Lock className="size-4 mr-2" />
                  Password: admin123
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-primary text-base mb-2">
                Customer User:
              </h3>
              <ul className="text-sm font-medium text-gray-600 space-y-1 bg-gray-100 py-2 px-3 rounded-md border border-transparent hover:border-primary flex flex-col gap-1.5">
                <li className="flex items-center">
                  <Mail className="size-4 mr-2" />
                  Email: john.anderson@example.com
                </li>
                <li className="flex items-center">
                  <Lock className="size-4 mr-2" />
                  Password: password123
                </li>
              </ul>
            </div>

            <div className="flex justify-end">
              <button
                className="btn-secondary mt-2"
                onClick={() => setCredentialsInfo(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
