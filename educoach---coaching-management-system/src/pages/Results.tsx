import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Trophy, Star, TrendingUp, Award, User, Calendar, MapPin, Phone, ArrowRight } from "lucide-react";

const Results = () => {
  const [topPerformers, setTopPerformers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch("/api/top-performers");
        if (res.ok) {
          const data = await res.json();
          setTopPerformers(data);
        }
      } catch (error) {
        console.error("Error fetching results:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
      <section className="text-center space-y-4">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-gray-900"
        >
          Our <span className="text-blue-600">Results</span>
        </motion.h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Celebrating the hard work and dedication of our students who have achieved excellence in JEE, NEET, and Board exams.
        </p>
      </section>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-16">
          {/* JEE Toppers */}
          <section className="space-y-8">
            <div className="flex items-center space-x-4">
              <div className="h-8 w-2 bg-blue-600 rounded-full"></div>
              <h2 className="text-3xl font-bold text-gray-900">JEE (Main + Advanced) Toppers</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {topPerformers.filter(tp => tp.category === 'JEE').map((tp) => (
                <motion.div 
                  key={tp.id}
                  whileHover={{ y: -10 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 text-center group"
                >
                  <div className="h-64 overflow-hidden relative">
                    <img 
                      src={tp.image} 
                      alt={tp.name} 
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                      JEE
                    </div>
                  </div>
                  <div className="p-6 space-y-2">
                    <h4 className="text-xl font-bold text-gray-900">{tp.name}</h4>
                    <p className="text-blue-600 font-bold text-lg">{tp.score}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* NEET Toppers */}
          <section className="space-y-8">
            <div className="flex items-center space-x-4">
              <div className="h-8 w-2 bg-green-600 rounded-full"></div>
              <h2 className="text-3xl font-bold text-gray-900">NEET Toppers</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {topPerformers.filter(tp => tp.category === 'NEET').map((tp) => (
                <motion.div 
                  key={tp.id}
                  whileHover={{ y: -10 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 text-center group"
                >
                  <div className="h-64 overflow-hidden relative">
                    <img 
                      src={tp.image} 
                      alt={tp.name} 
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                      NEET
                    </div>
                  </div>
                  <div className="p-6 space-y-2">
                    <h4 className="text-xl font-bold text-gray-900">{tp.name}</h4>
                    <p className="text-green-600 font-bold text-lg">{tp.score}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Boards Toppers */}
          <section className="space-y-8">
            <div className="flex items-center space-x-4">
              <div className="h-8 w-2 bg-purple-600 rounded-full"></div>
              <h2 className="text-3xl font-bold text-gray-900">Board Exam Toppers</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {topPerformers.filter(tp => tp.category === 'Boards').map((tp) => (
                <motion.div 
                  key={tp.id}
                  whileHover={{ y: -10 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 text-center group"
                >
                  <div className="h-64 overflow-hidden relative">
                    <img 
                      src={tp.image} 
                      alt={tp.name} 
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                      Boards
                    </div>
                  </div>
                  <div className="p-6 space-y-2">
                    <h4 className="text-xl font-bold text-gray-900">{tp.name}</h4>
                    <p className="text-purple-600 font-bold text-lg">{tp.score}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Consistent Success Section */}
      <section className="bg-blue-600 rounded-3xl p-8 md:p-16 text-white text-center space-y-8">
        <div className="max-w-3xl mx-auto space-y-4">
          <Trophy className="w-16 h-16 mx-auto text-blue-200" />
          <h2 className="text-3xl md:text-4xl font-bold">A Legacy of Consistent Success</h2>
          <p className="text-blue-100 text-lg">
            For over a decade, Ramanujan Classes has been the preferred choice for students aiming for top ranks in competitive exams. Our methodology focuses on deep conceptual understanding and rigorous practice.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-blue-500 pt-8">
          {[
            { label: "IIT-JEE Selections", value: "500+" },
            { label: "NEET Selections", value: "300+" },
            { label: "90%+ in Boards", value: "1200+" },
            { label: "NTSE/Olympiads", value: "150+" },
          ].map((stat, i) => (
            <div key={i}>
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-blue-200 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Results;
