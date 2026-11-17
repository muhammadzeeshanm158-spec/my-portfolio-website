import { FaGithub, FaLinkedin, FaHeart } from 'react-icons/fa';
import { FaArrowUpRightFromSquare } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

const Footer = () => {
  const footerLinks = [
    { path: '/about', label: 'About' },
    { path: '/projects', label: 'Projects' },
    { path: '/skills', label: 'Skills' },
    { path: '/experience', label: 'Experience' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <footer className="bg-gray-900 text-white mt-12 sm:mt-20 w-full overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        {/* MAIN FOOTER */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-8 items-start">

          {/* LEFT: Logo + Bio */}
          <div className="text-center lg:text-left order-1">
            <Link to="/" className="text-xl sm:text-2xl font-extrabold inline-flex">
              <span className="bg-white text-gray-900 px-2 py-1 rounded-md">MZ</span>
              <span className="ml-2">Portfolio</span>
            </Link>
            <p className="text-gray-400 mt-4 max-w-sm mx-auto lg:mx-0 text-sm sm:text-base leading-relaxed">
              MERN Stack Developer. I build fast & modern web apps with clean code.
            </p>
          </div>

          {/* CENTER: Links */}
          <div className="flex justify-center order-2">
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-3 sm:gap-6">
              {footerLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative text-gray-400 hover:text-white flex items-center gap-1.5 group py-1 text-sm sm:text-base transition-colors"
                >
                  {link.label} <FaArrowUpRightFromSquare size={11} className="opacity-70 group-hover:opacity-100" />
                  <span className="absolute left-0 -bottom-0.5 h- w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </div>
          </div>

          {/* RIGHT: Social Icons — Gmail hata diya! */}
          <div className="flex flex-col items-center lg:items-end gap-5 order-3">
            <div className="flex items-center gap-3 sm:gap-4">
              <a href="https://github.com/muhammadzeeshanm158-spec?tab=repositories" target="_blank" rel="noreferrer"
                 className="bg-gray-800 p-3 rounded-full hover:bg-white hover:text-black transition-all hover:scale-110 active:scale-95 touch-manipulation"
                 aria-label="GitHub">
                <FaGithub size={18} />
              </a>
              <a href="https://www.linkedin.com/in/muhammad-zeeshan-muhammad-yaqoob-394ab0420/" target="_blank" rel="noreferrer"
                 className="bg-gray-800 p-3 rounded-full hover:bg-white hover:text-black transition-all hover:scale-110 active:scale-95 touch-manipulation"
                 aria-label="LinkedIn">
                <FaLinkedin size={18} />
              </a>
            </div>
            <p className="text-gray-500 text-xs sm:text-sm lg:hidden text-center">
              Connect with me
            </p>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="border-t border-gray-800 mt-10 sm:mt-12 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs sm:text-sm text-gray-500 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Muhammad Zeeshan. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Made with <FaHeart className="text-red-500 animate-pulse" /> in Karachi, Pakistan
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;