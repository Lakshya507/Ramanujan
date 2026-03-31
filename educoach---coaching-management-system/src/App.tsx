import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { Menu, X, GraduationCap, Users, UserCheck, BookOpen, Trophy, Phone, MapPin, LayoutDashboard, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Home from "./pages/Home";
import Faculties from "./pages/Faculties";
import Results from "./pages/Results";
import Contact from "./pages/Contact";
import AdminPortal from "./pages/AdminPortal";
import StudentPortal from "./pages/StudentPortal";
import ParentPortal from "./pages/ParentPortal";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/", icon: <BookOpen className="w-4 h-4" /> },
    { name: "Faculties", path: "/faculties", icon: <Users className="w-4 h-4" /> },
    { name: "Results", path: "/results", icon: <Trophy className="w-4 h-4" /> },
    { name: "Contact", path: "/contact", icon: <Phone className="w-4 h-4" /> },
  ];

  const portalLinks = [
    { name: "Admin", path: "/admin", icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: "Student", path: "/student", icon: <GraduationCap className="w-4 h-4" /> },
    { name: "Parent", path: "/parent", icon: <UserCheck className="w-4 h-4" /> },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <GraduationCap className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900 tracking-tight">Ramanujan Classes</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
                    location.pathname === link.path ? "text-blue-600" : "text-gray-600 hover:text-blue-500"
                  }`}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              ))}
            </div>
            <div className="h-6 w-px bg-gray-200 mx-2" />
            <div className="flex space-x-4">
              {portalLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100 transition-colors"
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50"
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-100">
                <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Portals</p>
                {portalLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium text-blue-600 hover:bg-blue-50"
                  >
                    {link.icon}
                    <span>{link.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-gray-900 text-white pt-12 pb-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center space-x-2 mb-4">
            <GraduationCap className="w-8 h-8 text-blue-400" />
            <span className="text-2xl font-bold tracking-tight">Ramanujan Classes</span>
          </div>
          <p className="text-gray-400 max-w-md">
            Empowering students for JEE, NEET, and Board exams through expert guidance and personalized coaching.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-400">
            <li><Link to="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
            <li><Link to="/faculties" className="hover:text-blue-400 transition-colors">Faculties</Link></li>
            <li><Link to="/results" className="hover:text-blue-400 transition-colors">Results</Link></li>
            <li><Link to="/contact" className="hover:text-blue-400 transition-colors">Contact Us</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
          <ul className="space-y-2 text-gray-400">
            <li className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>+1 234 567 890</span>
            </li>
            <li className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>123 Education Hub, City Center</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} EduCoach. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/faculties" element={<Faculties />} />
            <Route path="/results" element={<Results />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<AdminPortal />} />
            <Route path="/student" element={<StudentPortal />} />
            <Route path="/parent" element={<ParentPortal />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
