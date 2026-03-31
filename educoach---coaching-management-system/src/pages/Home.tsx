import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Star, Quote, MapPin, Phone, GraduationCap, Users, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [topPerformers, setTopPerformers] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quotesRes, performersRes, branchesRes] = await Promise.all([
          fetch("/api/quotes"),
          fetch("/api/top-performers"),
          fetch("/api/branches")
        ]);

        if (quotesRes.ok) setQuotes(await quotesRes.json());
        if (performersRes.ok) setTopPerformers(await performersRes.json());
        if (branchesRes.ok) setBranches(await branchesRes.json());
      } catch (error) {
        console.error("Error fetching home data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (quotes.length > 0) {
      const interval = setInterval(() => {
        setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [quotes]);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden bg-blue-900 text-white">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://picsum.photos/seed/ramanujan/1920/1080" 
            alt="Hero Background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center space-y-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tight"
          >
            Welcome to <span className="text-blue-400">Ramanujan Classes</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Specialized Coaching for JEE (Main + Advanced), NEET, and Board Exams (Class 8th-12th).
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/contact" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all flex items-center space-x-2">
              <span>Join JEE Batch</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/contact" className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-all flex items-center space-x-2">
              <span>Join NEET Batch</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "JEE", desc: "Intensive training for IIT-JEE Main & Advanced with expert faculty.", color: "bg-blue-600" },
            { title: "NEET", desc: "Comprehensive medical entrance preparation with focus on Biology & Chemistry.", color: "bg-green-600" },
            { title: "Boards", desc: "Foundation courses for Class 8th to 12th (CBSE/ICSE/State Boards).", color: "bg-purple-600" },
          ].map((cat, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 space-y-4 hover:shadow-xl transition-shadow">
              <div className={`w-12 h-1 bg-blue-600 rounded-full mb-4`} />
              <h3 className="text-2xl font-bold text-gray-900">{cat.title}</h3>
              <p className="text-gray-600">{cat.desc}</p>
              <Link to="/contact" className="text-blue-600 font-bold hover:underline inline-flex items-center space-x-1">
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Motivation Quotes Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 relative overflow-hidden">
          <Quote className="absolute top-4 left-4 w-12 h-12 text-blue-50 opacity-10" />
          <AnimatePresence mode="wait">
            {quotes.length > 0 && (
              <motion.div
                key={currentQuoteIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center space-y-4"
              >
                <p className="text-2xl md:text-3xl font-serif italic text-gray-800">
                  "{quotes[currentQuoteIndex].text}"
                </p>
                <p className="text-blue-600 font-semibold">— {quotes[currentQuoteIndex].author}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Top Performers Section */}
      <section className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-gray-900">Our Top Performers</h2>
          <p className="text-gray-500">Proudly presenting the stars of Ramanujan Classes</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {topPerformers.map((tp) => (
            <motion.div 
              key={tp.id}
              whileHover={{ y: -10 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 text-center group"
            >
              <div className="h-64 overflow-hidden">
                <img 
                  src={tp.image} 
                  alt={tp.name} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6 space-y-2">
                <h4 className="text-xl font-bold text-gray-900">{tp.name}</h4>
                <p className="text-blue-600 font-bold">{tp.score}</p>
                <p className="text-sm text-gray-500 uppercase tracking-widest">{tp.category}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="text-center">
          <Link to="/results" className="text-blue-600 font-semibold hover:underline flex items-center justify-center space-x-1">
            <span>View All Results</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Branches Section */}
      <section className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-gray-900">Our Branches</h2>
          <p className="text-gray-500">Visit us at our state-of-the-art facilities</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {branches.map((branch) => (
            <div key={branch.id} className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 space-y-4 hover:border-blue-200 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{branch.name}</h3>
              <div className="space-y-2 text-gray-600">
                <p className="flex items-start space-x-2">
                  <MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <span>{branch.address}</span>
                </p>
                <p className="flex items-center space-x-2">
                  <Phone className="w-5 h-5 text-blue-500 shrink-0" />
                  <span>{branch.phone}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
