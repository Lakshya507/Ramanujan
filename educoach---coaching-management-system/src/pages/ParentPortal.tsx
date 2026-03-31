import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { UserCheck, Search, User, GraduationCap, TrendingUp, Calendar, Mail, Phone, AlertCircle, CheckCircle, Trophy } from "lucide-react";

const ParentPortal = () => {
  const [parentId, setParentId] = useState("");
  const [password, setPassword] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/parent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parentId, password }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Invalid Parent ID or Password." }));
        setError(errorData.error || "Invalid Parent ID or Password.");
        return;
      }

      const result = await res.json();
      if (result.success) {
        setData(result);
        setIsAuthenticated(true);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 w-full max-w-md space-y-6"
        >
          <div className="text-center space-y-2">
            <User className="w-12 h-12 text-blue-600 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-900">Parent Portal</h2>
            <p className="text-gray-500">Login to track your child's progress</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Parent ID</label>
              <input 
                type="text" 
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. P101"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="••••••••"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button 
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Login</span>
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const { parent, student } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {parent.name}</h1>
          <p className="text-gray-500">Monitoring progress for: <span className="font-bold text-blue-600">{student.name}</span></p>
        </div>
        <button 
          onClick={() => { setIsAuthenticated(false); setData(null); setParentId(""); setPassword(""); }}
          className="px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Marks Section */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span>Academic Performance</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(student.marks).map(([subject, mark]: [string, any]) => (
                <div key={subject} className="p-4 bg-gray-50 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="capitalize font-bold text-gray-700">{subject}</span>
                    <span className="text-blue-600 font-bold">{mark}/100</span>
                  </div>
                  <div className="h-2 bg-white rounded-full overflow-hidden border border-gray-100">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${mark}%` }}
                      className={`h-full ${mark >= 80 ? "bg-green-500" : mark >= 60 ? "bg-blue-500" : "bg-yellow-500"}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Attendance & Behavior */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Attendance Rate</h3>
              <div className="flex items-center space-x-4">
                <div className="relative w-24 h-24">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path className="text-gray-100" stroke="currentColor" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="text-blue-600" strokeDasharray="92, 100" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-bold text-xl">92%</div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Total Classes: 120</p>
                  <p className="text-sm text-gray-500">Attended: 110</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Teacher's Remarks</h3>
              <p className="text-gray-600 italic">"Excellent progress in Mathematics. Needs to focus more on Chemistry practicals. Overall behavior is very disciplined."</p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="bg-gray-900 p-8 rounded-2xl text-white space-y-6">
            <h3 className="text-lg font-bold">Student Profile</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Category</span>
                <span className="font-bold">{student.category}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Class</span>
                <span className="font-bold">{student.class}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Branch</span>
                <span className="font-bold">Main Branch</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-lg font-bold text-gray-900">Fee Status</h3>
            <div className="p-4 bg-green-50 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-xs text-green-600 font-bold uppercase">Current Installment</p>
                <p className="text-lg font-bold text-gray-900">Paid</p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <button className="w-full py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors">
              View Fee History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentPortal;
