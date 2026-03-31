import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Users, Star, GraduationCap, Mail, Phone } from "lucide-react";

const Faculties = () => {
  const [teachers, setTeachers] = useState<any[]>([]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await fetch("/api/teachers");
        if (res.ok) {
          setTeachers(await res.json());
        }
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };
    fetchTeachers();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Our Expert Faculty</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Meet the dedicated educators who bring years of experience and passion to help you excel in your academic journey.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {teachers.map((teacher) => (
          <motion.div
            key={teacher.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 group"
          >
            <div className="relative h-64 overflow-hidden">
              <img
                src={teacher.image}
                alt={teacher.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <div className="flex space-x-4 text-white">
                  <Mail className="w-5 h-5 cursor-pointer hover:text-blue-400" />
                  <Phone className="w-5 h-5 cursor-pointer hover:text-blue-400" />
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-gray-900">{teacher.name}</h3>
                <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider">{teacher.subject}</p>
              </div>
              <div className="flex items-center space-x-2 text-gray-500 text-sm">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>{teacher.experience} Experience</span>
              </div>
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center space-x-1 text-xs text-gray-400">
                  <GraduationCap className="w-4 h-4" />
                  <span>PhD / Masters</span>
                </div>
                <button className="text-blue-600 text-sm font-bold hover:underline">View Profile</button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <section className="bg-blue-600 rounded-3xl p-12 text-white text-center space-y-8 mt-16">
        <h2 className="text-3xl font-bold">Want to Join Our Team?</h2>
        <p className="text-blue-100 max-w-xl mx-auto">
          We are always looking for passionate educators to join our growing family. If you have the expertise and the drive to inspire, we want to hear from you.
        </p>
        <button className="px-8 py-3 bg-white text-blue-600 font-bold rounded-full hover:bg-blue-50 transition-colors">
          Apply as Faculty
        </button>
      </section>
    </div>
  );
};

export default Faculties;
