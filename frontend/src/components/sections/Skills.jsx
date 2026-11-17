import React from 'react';
import { skillsData } from '../../data.js'; // ✅ Static data — No API!

const Skills = () => {
  // ✅ Seedha data.js se — No loading, No fetch!
  const skills = skillsData || [];

  const getCategoryColor = (cat) => {
    const c = (cat || '').toLowerCase();
    if (c.includes('front')) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (c.includes('back')) return 'bg-green-50 text-green-700 border-green-200';
    if (c.includes('data')) return 'bg-purple-50 text-purple-700 border-purple-200';
    if (c.includes('tool')) return 'bg-orange-50 text-orange-700 border-orange-200';
    return 'bg-gray-50 text-gray-700 border-gray-200';
  };

  return (
    <section id="skills" className="py-16 lg:py-24 w-full overflow-hidden bg-gray-50">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900">My Skills</h2>
          <p className="text-gray-500 mt-3 text-base sm:text-lg">Technologies I work with</p>
          <div className="w-20 h-1.5 bg-gray-900 mx-auto mt-5 rounded-full"></div>
        </div>

        {skills.length === 0? (
          <p className="text-gray-400 mt-6 text-center">No skills yet — Add from admin panel</p>
        ) : (
          <>
            {/* 3 CARDS PER LINE + MOTI BORDER */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-10">
              {skills.map((skill, index) => {
                const skillName = skill.skill_name || skill.name || skill.title || 'Skill';
                const iconUrl = skill.icon_url;
                const proficiency = skill.proficiency_level || skill.proficiency || skill.level;

                return (
                <div
                  key={`skill-${skill.id || index}`}
                  className="group bg-white border-2 border-gray-200 rounded-3xl p-8 sm:p-10 text-center hover:shadow-2xl hover:border-gray-900 hover:-translate-y-2 transition-all duration-300 shadow-sm"
                >
                  <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto bg-white border-2 border-gray-200 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:border-gray-900 transition-all overflow-hidden p-5">
                    {iconUrl? (
                      <img
                        src={iconUrl}
                        alt={skillName}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <span
                      className="w-full h-full bg-gray-900 text-white rounded-xl flex items-center justify-center text-3xl font-bold"
                      style={{ display: iconUrl? 'none' : 'flex' }}
                    >
                      {skillName.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  <p className="font-bold text-gray-900 text-lg sm:text-xl mt-6">
                    {skillName}
                  </p>

                  <span className={`inline-block mt-4 text-xs px-4 py-2 rounded-full border-2 font-bold tracking-widest uppercase ${getCategoryColor(skill.category)}`}>
                    {skill.category || 'Tech'}
                  </span>

                  {proficiency && (
                    <>
                      <div className="w-full bg-gray-100 border border-gray-200 rounded-full h-3 mt-6 overflow-hidden">
                        <div className="bg-gray-900 h-full rounded-full" style={{ width: `${proficiency}%` }}></div>
                      </div>
                      <p className="text-sm text-gray-500 mt-3 font-bold">{proficiency}% Proficiency</p>
                    </>
                  )}
                </div>
                );
              })}
            </div>

            <p className="text-center text-sm text-gray-400 mt-10">
              {skills.length} technologies • Frontend • Backend • Tools
            </p>
          </>
        )}
      </div>
    </section>
  );
};

export default Skills;