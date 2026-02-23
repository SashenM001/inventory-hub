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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, UserPlus } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";

const AdminEmployeesPage = () => {
  const navigate = useNavigate();
  const { currentUser, createEmployee } = useInventoryStore();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"storekeeper" | "admin">("storekeeper");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Only admins can access this page
  if (!currentUser || currentUser.role !== "admin") {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <Card className="w-full max-w-md shadow-lg border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Access Denied</CardTitle>
              <CardDescription>
                Only administrators can manage employees.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => navigate("/")}
                className="w-full bg-slate-900 hover:bg-slate-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
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

    // Create employee
    const result = createEmployee(fullName, email, password, role);
    if (result) {
      setSuccess(`Employee "${fullName}" created successfully as ${role}`);
      setFullName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setRole("storekeeper");
    } else {
      setError("Failed to create employee. Email may already exist.");
    }

    setIsLoading(false);
  };

  return (
    <MainLayout>
      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 font-playfair">
            Manage Employees
          </h1>
          <p className="text-slate-600 font-inter">
            Add new employees to the inventory system
          </p>
        </div>

        {/* Form Card */}
        <Card className="shadow-lg border-slate-200">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-playfair text-slate-900">
              Create New Employee
            </CardTitle>
            <CardDescription className="text-slate-600 font-inter">
              Enter employee details and credentials below
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
                  placeholder="employee@sfd.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="font-inter border-slate-300 focus:border-slate-900 focus:ring-slate-900"
                />
              </div>

              {/* Role Select */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 font-inter">
                  Role
                </label>
                <Select
                  value={role}
                  onValueChange={(value: any) => setRole(value)}
                >
                  <SelectTrigger className="font-inter border-slate-300">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="storekeeper">StoreKeeper</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
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

              {/* Success Message */}
              {success && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm font-medium text-green-700 font-inter">
                    {success}
                  </p>
                </div>
              )}

              {/* Create Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-inter font-medium py-2 gap-2"
              >
                <UserPlus className="w-4 h-4" />
                {isLoading ? "Creating..." : "Create Employee"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Back Button */}
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="border-slate-300 text-slate-900 hover:bg-slate-50 font-inter"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    </MainLayout>
  );
};

export default AdminEmployeesPage;
