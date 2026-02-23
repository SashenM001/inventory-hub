import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInventoryStore } from "@/stores/inventoryStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserPlus } from "lucide-react";

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useInventoryStore();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Validation
    if (!fullName || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    // Create account and login
    signup(fullName, email, password);
    navigate("/");

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo & Branding */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <img
              src="/SFD_Logo.jpg"
              alt="SFD Logo"
              className="h-16 w-auto rounded-lg object-contain shadow-lg"
            />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 font-playfair">
            Inventory Hub
          </h1>
          <p className="text-slate-600 font-inter">Supreme Funeral Directors</p>
        </div>

        {/* Signup Card */}
        <Card className="shadow-lg border-slate-200">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-playfair text-slate-900">
              Create Account
            </CardTitle>
            <CardDescription className="text-slate-600 font-inter">
              Sign up to manage your inventory
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 font-inter">
                  Full Name
                </label>
                <Input
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isLoading}
                  className="font-inter border-slate-300 focus:border-slate-900 focus:ring-slate-900"
                />
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 font-inter">
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="font-inter border-slate-300 focus:border-slate-900 focus:ring-slate-900"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 font-inter">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="font-inter border-slate-300 focus:border-slate-900 focus:ring-slate-900"
                />
                <p className="text-xs text-slate-500 font-inter">
                  At least 6 characters
                </p>
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 font-inter">
                  Confirm Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  className="font-inter border-slate-300 focus:border-slate-900 focus:ring-slate-900"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm font-medium text-red-700 font-inter">
                    {error}
                  </p>
                </div>
              )}

              {/* Sign Up Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-inter font-medium py-2 gap-2"
              >
                <UserPlus className="w-4 h-4" />
                {isLoading ? "Creating account..." : "Sign Up"}
              </Button>
            </form>

            {/* Sign In Link */}
            <div className="mt-6 text-center">
              <p className="text-slate-600 font-inter text-sm">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-slate-900 font-semibold hover:underline"
                >
                  Sign In
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 font-inter">
          © 2024 Supreme Funeral Directors. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
