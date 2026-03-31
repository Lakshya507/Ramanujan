import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GraduationCap, Search, BookOpen, Trophy, User, Calendar, CheckCircle, XCircle, AlertCircle, TrendingUp } from "lucide-react";

const StudentPortal = () => {
  const [rollNo, setRollNo] = useState("");
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollNo }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Invalid Roll Number" }));
        setError(errorData.error || "Invalid Roll Number. Please check and try again.");
        return;
      }

      const data = await res.json();
      if (data.success) {
        setStudent(data.student);
        setIsAuthenticated(true);
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
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
            <GraduationCap className="w-12 h-12 text-blue-600 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-900">Student Portal</h2>
            <p className="text-gray-500">Enter your Roll Number to view your results</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Roll Number</label>
              <input 
                type="text" 
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. 101"
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
                  <span>View Results</span>
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
            {student.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{student.name}</h1>
            <p className="text-gray-500">Roll No: {student.rollNo} | Class: {student.class} | Category: {student.category}</p>
          </div>
        </div>
        <button 
          onClick={() => { setIsAuthenticated(false); setStudent(null); setRollNo(""); }}
          className="px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Overview */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span>Academic Performance</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(student.marks).map(([subject, mark]: [string, any]) => (
                <div key={subject} className="space-y-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="capitalize text-gray-600">{subject}</span>
                    <span className="text-blue-600">{mark}/100</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${mark}%` }}
                      className="h-full bg-blue-600"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span>Progress Analysis</span>
            </h2>
            <div className="h-64 flex items-end justify-between gap-2 px-4">
              {[65, 78, 72, 85, 82, 90].map((val, i) => (
                <div key={i} className="flex-grow space-y-2">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${val}%` }}
                    className="w-full bg-blue-100 rounded-t-lg relative group"
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {val}%
                    </div>
                  </motion.div>
                  <p className="text-[10px] text-gray-400 text-center font-bold uppercase">Test {i + 1}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <div className="bg-blue-600 p-8 rounded-2xl text-white space-y-6">
            <h3 className="text-lg font-bold">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-blue-500 pb-4">
                <span className="text-blue-100">Attendance</span>
                <span className="font-bold">92%</span>
              </div>
              <div className="flex justify-between items-center border-b border-blue-500 pb-4">
                <span className="text-blue-100">Class Rank</span>
                <span className="font-bold">#04</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-100">Overall Grade</span>
                <span className="font-bold">A+</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-lg font-bold text-gray-900">Upcoming Tests</h3>
            <div className="space-y-4">
              {[
                { title: "Physics Mock Test", date: "April 15, 2025" },
                { title: "Chemistry Quiz", date: "April 18, 2025" },
                { title: "Maths Weekly Test", date: "April 22, 2025" },
              ].map((test, i) => (
                <div key={i} className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{test.title}</p>
                    <p className="text-xs text-gray-500">{test.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPortal;
