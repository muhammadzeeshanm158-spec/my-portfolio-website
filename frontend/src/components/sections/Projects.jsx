import { useState } from 'react';
import { FaExternalLinkAlt, FaGithub, FaTimes } from 'react-icons/fa';
import { projectsData } from '../../data.js'; // ✅ Static data — No API!

const Projects = () => {
  const projects = projectsData || [];
  const [selectedProject, setSelectedProject] = useState(null);

  // ✅ Image fix — public/ se seedha!
  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('blob:')) return url;
    return url.startsWith('/') ? url : `/${url}`;
  };

  const formatText = (text) => {
    if (!text) return '';
    return text.replace(/-/g, '\u2011');
  };

  const formatTitle = (title) => {
    if (!title) return '';
    return title.replace(/-/g, ' ');
  };

  if (projects.length === 0) {
    return (
      <section className="py-20 w-full bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold">My Projects</h2>
          <p className="text-gray-400 mt-6">No projects yet</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="projects" className="py-16 lg:py-20 w-full bg-white">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">My Projects</h2>
            <p className="text-gray-500 mt-3 text-sm">A selection of my recent work</p>
            <div className="w-16 h-1.5 bg-gray-900 mx-auto mt-5 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {projects.map((p) => {
              const imageUrl = getImageUrl(p.image_url);
              const techs = p.tech_stack ? (Array.isArray(p.tech_stack) ? p.tech_stack : p.tech_stack.split(',')) : [];
              
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedProject(p)}
                  className="group cursor-pointer bg-white border-2 border-gray-900 rounded-xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all flex flex-col"
                >
                  {imageUrl ? (
                    <div className="w-full h-44 bg-gray-100 rounded-xl mb-4 overflow-hidden border border-gray-200">
                      <img 
                        src={imageUrl} 
                        alt={p.title} 
                        onError={(e) => { e.target.style.display = 'none'; }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    </div>
                  ) : (
                    <div className="w-full h-44 bg-gray-50 rounded-xl mb-4 flex items-center justify-center border border-dashed text-gray-400 text-xs">
                      No Image
                    </div>
                  )}

                  <span className="bg-gray-900 text-white text-xs px-3 py-1 rounded-full inline-block font-bold tracking-widest uppercase w-fit">
                    {techs[0]?.trim() || 'FULL STACK'}
                  </span>

                  <h3 className="font-extrabold text-lg text-gray-900 leading-tight mt-3">
                    {formatTitle(p.title)}
                  </h3>

                  <p className="text-sm text-gray-500 mt-2 line-clamp-3 leading-relaxed flex-1">
                    {p.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {techs.slice(0, 3).map((tech, i) => (
                      <span key={i} className="text-xs bg-gray-100 border border-gray-200 text-gray-700 px-2.5 py-1 rounded-full font-medium">
                        {tech.trim()}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 text-xs text-gray-400">Click to view full details →</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
           
           {selectedProject && (
  <div
    className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
    onClick={() => setSelectedProject(null)}
  >
    <div
      className="bg-white rounded-xl w-full max-w-md my-auto flex flex-col overflow-hidden border-2 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      onClick={(e) => e.stopPropagation()}
    >
      {/* ✅ Image — Bilkul card jaisi */}
      {getImageUrl(selectedProject.image_url) && (
        <div className="p-5 pb-0">
          <div className="w-full h-44 bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
            <img
              src={getImageUrl(selectedProject.image_url)}
              alt={selectedProject.title}
              onError={(e) => { e.target.style.display = 'none'; }}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* ✅ Content — Card jaisa p-5 */}
      <div className="overflow-y-auto p-5 max-h-">
        <div className="flex justify-between items-start gap-3">
          <span className="bg-gray-900 text-white text-xs px-3 py-1 rounded-full inline-block font-bold tracking-widest uppercase w-fit">
            {selectedProject.tech_stack}
          </span>
          <button onClick={() => setSelectedProject(null)} className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-900 hover:text-white transition shrink-0">
            <FaTimes size={12} />
          </button>
        </div>

        <h3 className="font-extrabold text-lg text-gray-900 leading-tight mt-3">
          {formatTitle(selectedProject.title)}
        </h3>

        <p className="text-sm text-gray-500 mt-2 leading-relaxed whitespace-pre-wrap">
          {formatText(selectedProject.description)}
        </p>

        {/* ✅ Tech — Card jaisi pills */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {selectedProject.tech_stack?.split(',').map((tech, i) => (
            <span key={i} className="text-xs bg-gray-100 border border-gray-200 text-gray-700 px-2.5 py-1 rounded-full font-medium">
              {tech.trim()}
            </span>
          ))}
        </div>
      </div>

      {/* ✅ Footer — Card jaisa */}
      <div className="px-5 pb-5 flex gap-2 shrink-0 bg-white">
        {selectedProject.github_link && (
          <a href={selectedProject.github_link} target="_blank" rel="noreferrer" className="flex-1 text-xs font-bold border-2 border-gray-900 px-4 py-2.5 rounded-full flex items-center justify-center gap-1.5 hover:bg-gray-100 transition">
            <FaGithub size={12} /> Code
          </a>
        )}
        {selectedProject.live_link ? (
          <a href={selectedProject.live_link} target="_blank" rel="noreferrer" className="flex-1 text-xs font-bold text-white bg-gray-900 px-4 py-2.5 rounded-full flex items-center justify-center gap-1.5 hover:bg-gray-800 transition">
            Live <FaExternalLinkAlt size={10} />
          </a>
        ) : (
          <span className="flex-1 text-xs font-bold text-gray-400 bg-gray-100 border border-gray-200 px-4 py-2.5 rounded-full flex items-center justify-center">
            Live Coming Soon
          </span>
        )}
      </div>
    </div>
  </div>
)}



   
    </>
  );
};

export default Projects;