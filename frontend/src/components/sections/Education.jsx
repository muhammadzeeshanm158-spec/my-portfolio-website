import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { FaGraduationCap } from 'react-icons/fa';

const Education = () => {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/education').then(res => {
      const data = res.data?.data || res.data || [];
      setEducation(Array.isArray(data) ? data : []);
    }).catch(() => setEducation([])).finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (education.length === 0) return null;

  return (
    <section className="w-full bg-white py-16 sm:py-20">
      <div className="max-w-5xl mx-auto px-4">
        
        {/* ✅ My Skills jaisi simple heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">My Education</h2>
          <p className="text-gray-500 mt-3 text-">My academic journey and qualifications</p>
          <div className="w-16 h-1.5 bg-gray-900 mx-auto mt-5 rounded-full"></div>
        </div>

        <div className="grid gap-6">
          {education.map((edu) => (
            <div key={edu.id} className="border-2 border-black rounded- p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center"><FaGraduationCap /></div>
                <div>
                  <h3 className="font-bold text-lg">{edu.degree}</h3>
                  <p className="text-sm text-gray-600">{edu.institution} • {edu.start_year} - {edu.end_year || 'Present'}</p>
                  <p className="text-sm mt-2 text-gray-700 leading-relaxed">{edu.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;