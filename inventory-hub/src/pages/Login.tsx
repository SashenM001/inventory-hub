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
import { LogIn } from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useInventoryStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!email || !password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    // Validate against predefined accounts
    const success = login(email, password);
    if (success) {
      navigate("/");
    } else {
      setError("Invalid email or password");
    }

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

        {/* Login Card */}
        <Card className="shadow-lg border-slate-200">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-playfair text-slate-900">
              Sign In
            </CardTitle>
            <CardDescription className="text-slate-600 font-inter">
              Enter your credentials to access the inventory system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm font-medium text-red-700 font-inter">
                    {error}
                  </p>
                </div>
              )}

              {/* Sign In Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-inter font-medium py-2 gap-2"
              >
                <LogIn className="w-4 h-4" />
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 space-y-3">
              <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
                <p className="text-xs font-medium text-blue-900 font-inter mb-2">
                  Admin Account:
                </p>
                <p className="text-xs text-blue-800 font-inter">
                  Email:{" "}
                  <code className="bg-white px-1 py-0.5 rounded text-blue-900 text-xs">
                    admin1@sfd.com
                  </code>
                </p>
                <p className="text-xs text-blue-800 font-inter">
                  Password:{" "}
                  <code className="bg-white px-1 py-0.5 rounded text-blue-900 text-xs">
                    Admin111_
                  </code>
                </p>
              </div>

              <div className="p-3 bg-green-50 rounded-md border border-green-200">
                <p className="text-xs font-medium text-green-900 font-inter mb-2">
                  StoreKeeper Account:
                </p>
                <p className="text-xs text-green-800 font-inter">
                  Email:{" "}
                  <code className="bg-white px-1 py-0.5 rounded text-green-900 text-xs">
                    storekeeper1@sfd.com
                  </code>
                </p>
                <p className="text-xs text-green-800 font-inter">
                  Password:{" "}
                  <code className="bg-white px-1 py-0.5 rounded text-green-900 text-xs">
                    StoreKeeper111
                  </code>
                </p>
              </div>
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

export default LoginPage;
