import { useState, useEffect } from 'react';
import api from '../../api/api';
import { FaExternalLinkAlt, FaGithub, FaTimes } from 'react-icons/fa';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  // ✅ Modal ke liye selected project
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects');
        const data = res.data?.data || res.data || [];
        setProjects(Array.isArray(data) ? data : []);
      } catch (err) {
        // ✅ Error log
        console.error("Error fetching projects:", err);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // ✅ Image ka full URL banao
  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('blob:')) return url;
    // ✅ VITE_API_URL = http://localhost:5000/api -> base = http://localhost:5000
    const apiUrl = import.meta.env.VITE_API_URL || api.defaults.baseURL || 'http://localhost:5000/api';
    const base = apiUrl.replace('/api', '').replace(/\/\$/, '');
    return `${base}${url.startsWith('/') ? url : `/\${url}`}`;
  };

  // ✅ FIX: Title aur Description me dash ki wajah se break na ho
  const formatText = (text) => {
    if (!text) return '';
    return text.replace(/-/g, '\u2011'); // non-breaking hyphen
  };

  const formatTitle = (title) => {
    if (!title) return '';
    return title.replace(/-/g, ' ');
  };

  if (loading) {
    return (
      <section className="py-20 text-center">
        <p className="text-gray-400 animate-pulse text-sm">Loading projects...</p>
      </section>
    );
  }

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
          {/* Heading */}
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
                  {/* Image */}
                  {imageUrl ? (
                    <div className="w-full h-44 bg-gray-100 rounded-xl mb-4 overflow-hidden border border-gray-200">
                      <img 
                        src={imageUrl} 
                        alt={p.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    </div>
                  ) : (
                    <div className="w-full h-44 bg-gray-50 rounded-xl mb-4 flex items-center justify-center border border-dashed text-gray-400 text-xs">
                      No Image
                    </div>
                  )}

                  {/* Category Badge */}
                  <span className="bg-gray-900 text-white text-xs px-3 py-1 rounded-full inline-block font-bold tracking-widest uppercase w-fit">
                    {techs[0]?.trim() || 'FULL STACK'}
                  </span>

                  {/* Title */}
                  <h3 className="font-extrabold text-lg text-gray-900 leading-tight mt-3">
                    {formatTitle(p.title)}
                  </h3>

                  {/* Short description on card */}
                  <p className="text-sm text-gray-500 mt-2 line-clamp-3 leading-relaxed flex-1">
                    {p.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {techs.slice(0, 3).map((tech, i) => (
                      <span key={i} className="text-xs bg-gray-100 border border-gray-200 text-gray-700 px-2.5 py-1 rounded-full font-medium">
                        {tech.trim()}
                      </span>
                    ))}
                  </div>

                  {/* Action hint */}
                  <div className="mt-4 text-xs text-gray-400">Click to view full details →</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ✅ FIXED COMPACT MODAL */}
      {selectedProject && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedProject(null)}>
          <div 
            className="bg-white rounded-2xl max-w-md w-full max-h-[85vh] flex flex-col p-5 border-2 border-gray-900 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-3 shrink-0">
              <h3 className="font-extrabold text-xl text-gray-900 pr-3 leading-tight">
                {formatTitle(selectedProject.title)}
              </h3>
              <button onClick={() => setSelectedProject(null)} className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-900 hover:text-white transition shrink-0">
                <FaTimes size={12} />
              </button>
            </div>
            
            {/* Scrollable Content Container */}
            <div className="overflow-y-auto pr-1 flex-1 custom-scrollbar">
              {getImageUrl(selectedProject.image_url) && (
                <img 
                  src={getImageUrl(selectedProject.image_url)} 
                  alt={selectedProject.title} 
                  className="w-full h-44 object-cover rounded-xl mb-3 border border-gray-200 shrink-0" 
                />
              )}

              {/* Description */}
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {formatText(selectedProject.description)}
                </p>
              </div>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {selectedProject.tech_stack?.split(',').map((tech, i) => (
                  <span key={i} className="text-xs bg-gray-900 text-white px-2.5 py-1 rounded-full font-medium">
                    {tech.trim()}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2 shrink-0">
              {selectedProject.live_link && (
                <a href={selectedProject.live_link} target="_blank" rel="noreferrer" className="text-xs font-bold text-white bg-gray-900 px-4 py-2.5 rounded-full flex items-center gap-1.5 hover:bg-gray-800 transition">
                  Live <FaExternalLinkAlt size={10} />
                </a>
              )}
              {selectedProject.github_link && (
                <a href={selectedProject.github_link} target="_blank" rel="noreferrer" className="text-xs font-bold border-2 border-gray-900 px-4 py-2.5 rounded-full flex items-center gap-1.5 hover:bg-gray-100 transition">
                  <FaGithub size={12} /> Code
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Projects;
