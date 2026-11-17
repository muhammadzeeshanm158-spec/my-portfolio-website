import React from 'react';
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaFacebook, FaYoutube, FaGlobe, FaExternalLinkAlt } from 'react-icons/fa';
import { socialData } from '../../data.js'; // ✅ Static data — No API!

const SocialLinks = () => {
  // ✅ Seedha data.js se — No loading, No fetch!
  const socials = socialData || [];

  const getCardData = (platform) => {
    const p = (platform || '').toLowerCase();
    if (p.includes('github')) return { Icon: FaGithub, bg: 'bg-gray-900' };
    if (p.includes('linkedin')) return { Icon: FaLinkedin, bg: 'bg-[#0A66C2]' };
    if (p.includes('twitter') || p.includes('x.com')) return { Icon: FaTwitter, bg: 'bg-black' };
    if (p.includes('insta')) return { Icon: FaInstagram, bg: 'bg-gradient-to-br from-purple-600 to-pink-500' };
    if (p.includes('facebook')) return { Icon: FaFacebook, bg: 'bg-[#1877F2]' };
    if (p.includes('youtube')) return { Icon: FaYoutube, bg: 'bg-[#FF0000]' };
    return { Icon: FaGlobe, bg: 'bg-gray-900' };
  };

  if (socials.length === 0) return null;

  return (
    <section className="w-full bg-white py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ✅ My Skills jaisi simple heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">My Social Links</h2>
          <p className="text-gray-500 mt-3 text-">Connect with me on these platforms</p>
          <div className="w-16 h-1.5 bg-gray-900 mx-auto mt-5 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {socials.map((social) => {
            const { Icon, bg } = getCardData(social.platform_name);
            return (
              <a
                key={social.id}
                href={social.profile_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white border-2 border-gray-900 rounded- p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`${bg} w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl border-2 border-gray-900`}>
                    <Icon />
                  </div>
                  <div className="w-8 h-8 bg-gray-100 border-2 border-gray-900 rounded-full flex items-center justify-center group-hover:bg-gray-900 group-hover:text-white transition-all">
                    <FaExternalLinkAlt className="text-" />
                  </div>
                </div>
                <h3 className="font-bold text-gray-900">{social.platform_name}</h3>
                <p className="text-xs text-gray-400 mt-2 truncate">{social.profile_url}</p>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SocialLinks;



