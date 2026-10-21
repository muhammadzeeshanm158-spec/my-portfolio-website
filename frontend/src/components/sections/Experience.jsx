import React, { useState, useEffect } from 'react';
import api from '../../api/api';

const Experience = () => {
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/experiences') // experiences (plural) use karo
    .then(res => {
        const data = res.data?.data || res.data || [];
        setExperience(Array.isArray(data) ? data : []);
      })
    .catch(() => setExperience([]))
    .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Present';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <section className="py-20 text-center">
        <p className="text-gray-400 animate-pulse">Loading experience...</p>
      </section>
    );
  }

  return (
    <section id="experience" className="py-16 lg:py-24 w-full bg-white">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900">Experience</h2>
          <div className="w-20 h-1.5 bg-gray-900 mx-auto mt-5 rounded-full"></div>
          <p className="text-gray-500 mt-3 text-base">My professional journey</p>
        </div>

        {experience.length === 0 ? (
          <p className="text-gray-400 mt-6 text-center">No experience added yet</p>
        ) : (
          <div className="mt-10 space-y-6 max-w-4xl mx-auto relative">
            {/* Timeline Line - Desktop */}
            <div className="hidden sm:block absolute left-8 top-0 bottom-0 w-1 bg-gray-200"></div>

            {experience.map((exp) => (
              <div 
                key={exp.id} 
                className="relative bg-white border-2 border-gray-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl hover:border-gray-900 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                  {/* Left */}
                  <div className="flex-1 flex gap-4">
                    {/* Timeline Dot */}
                    <div className="hidden sm:flex w-5 h-5 bg-gray-900 border-4 border-white rounded-full mt-1 shrink-0 shadow-md group-hover:scale-125 transition"></div>

                    <div className="flex-1">
                      <h3 className="font-extrabold text-gray-900 text-lg sm:text-xl leading-tight">
                        {exp.role}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-700 font-bold mt-1">
                        {exp.company_name}
                      </p>
                      <p className="text-sm text-gray-600 mt-3 leading-relaxed whitespace-pre-line">
                        {exp.description}
                      </p>
                    </div>
                  </div>

                  {/* Date Badge */}
                  <div className="sm:text-right shrink-0">
                    <span className="inline-block text-xs font-bold bg-gray-900 text-white group-hover:bg-black px-4 py-2 rounded-full border-2 border-gray-900">
                      {formatDate(exp.start_date)} — {formatDate(exp.end_date)}
                    </span>
                    {!exp.end_date && (
                      <p className="text-xs font-bold text-green-600 mt-2 sm:text-right">● Currently Working</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Experience;