import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Users, UserPlus, GraduationCap, Plus, Trash2, Edit, Save, X, Search, Filter, Lock } from "lucide-react";

const AdminPortal = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [students, setStudents] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [topPerformers, setTopPerformers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"students" | "teachers" | "top-performers">("students");
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<any>({ category: "JEE" });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password }),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Login failed" }));
        setError(errorData.error || "Invalid credentials");
        return;
      }

      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        fetchData();
      }
    } catch (err) {
      setError("Login failed");
    }
  };

  const fetchData = async () => {
    try {
      const [studentsRes, teachersRes, performersRes] = await Promise.all([
        fetch("/api/students"),
        fetch("/api/teachers"),
        fetch("/api/top-performers")
      ]);

      if (studentsRes.ok) setStudents(await studentsRes.json());
      if (teachersRes.ok) setTeachers(await teachersRes.json());
      if (performersRes.ok) setTopPerformers(await performersRes.json());
    } catch (error) {
      console.error("Error fetching admin data:", error);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    let endpoint = "";
    if (activeTab === "students") endpoint = "/api/admin/students";
    else if (activeTab === "teachers") endpoint = "/api/admin/teachers";
    else endpoint = "/api/admin/top-performers";

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });
    
    if (response.ok) {
      setIsAdding(false);
      setFormData({ category: "JEE" });
      fetchData();
    }
  };

  const handleDeleteTopPerformer = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this top performer?")) {
      await fetch(`/api/admin/top-performers/${id}`, { method: "DELETE" });
      fetchData();
    }
  };

  const filteredData = () => {
    if (activeTab === "students") return students.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
    if (activeTab === "teachers") return teachers.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return topPerformers.filter(tp => tp.name.toLowerCase().includes(searchTerm.toLowerCase()));
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
            <Lock className="w-12 h-12 text-blue-600 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-900">Admin Login</h2>
            <p className="text-gray-500">Enter your credentials to access the portal</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Admin ID</label>
              <input 
                type="text" 
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter ID"
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
                placeholder="Enter Password"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors">
              Login to Portal
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-gray-500">Manage students, faculty, and top performers</p>
        </div>
        <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-xl">
          {["students", "teachers", "top-performers"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-all capitalize ${
                activeTab === tab ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.replace("-", " ")}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all flex items-center justify-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add {activeTab === "students" ? "Student" : activeTab === "teachers" ? "Teacher" : "Top Performer"}</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Name</th>
                {activeTab === "students" ? (
                  <>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Roll No</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Class</th>
                  </>
                ) : activeTab === "teachers" ? (
                  <>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Experience</th>
                  </>
                ) : (
                  <>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Score</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Category</th>
                  </>
                )}
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredData().map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        {item.name.charAt(0)}
                      </div>
                      <span className="font-bold text-gray-900">{item.name}</span>
                    </div>
                  </td>
                  {activeTab === "students" ? (
                    <>
                      <td className="px-6 py-4 text-gray-600">{item.rollNo}</td>
                      <td className="px-6 py-4 text-gray-600">{item.class} ({item.category})</td>
                    </>
                  ) : activeTab === "teachers" ? (
                    <>
                      <td className="px-6 py-4 text-gray-600">{item.subject}</td>
                      <td className="px-6 py-4 text-gray-600">{item.experience}</td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4 text-gray-600">{item.score}</td>
                      <td className="px-6 py-4 text-gray-600">{item.category}</td>
                    </>
                  )}
                  <td className="px-6 py-4 text-right space-x-2">
                    {activeTab === "top-performers" ? (
                      <button 
                        onClick={() => handleDeleteTopPerformer(item.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    ) : (
                      <>
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                          <Edit className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Add New {activeTab === "students" ? "Student" : activeTab === "teachers" ? "Teacher" : "Top Performer"}</h3>
                <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <form onSubmit={handleAdd} className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-600">Full Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 outline-none"
                    placeholder="Enter name"
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                {activeTab === "students" ? (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-600">Roll Number</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 outline-none"
                        placeholder="e.g. 101"
                        onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-600">Class</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 outline-none"
                        placeholder="e.g. 10th"
                        onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-600">Category</label>
                      <select 
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 outline-none"
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        value={formData.category}
                      >
                        <option value="JEE">JEE</option>
                        <option value="NEET">NEET</option>
                        <option value="Boards">Boards</option>
                      </select>
                    </div>
                  </>
                ) : activeTab === "teachers" ? (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-600">Subject</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 outline-none"
                        placeholder="e.g. Mathematics"
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-600">Experience</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 outline-none"
                        placeholder="e.g. 5 years"
                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-600">Score</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 outline-none"
                        placeholder="e.g. 99.8 Percentile"
                        onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-600">Category</label>
                      <select 
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 outline-none"
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        value={formData.category}
                      >
                        <option value="JEE">JEE</option>
                        <option value="NEET">NEET</option>
                        <option value="Boards">Boards</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-600">Image URL</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 outline-none"
                        placeholder="https://..."
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      />
                    </div>
                  </>
                )}
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-200 mt-4"
                >
                  Save {activeTab === "students" ? "Student" : activeTab === "teachers" ? "Teacher" : "Top Performer"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPortal;
