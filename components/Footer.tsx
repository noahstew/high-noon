import Link from 'next/link';
import Image from 'next/image';
import { FaFacebook } from 'react-icons/fa';

const navLinks = [
  { name: 'About', href: '/about' },
  { name: 'Blog', href: '/blog' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Contact', href: '/contact' },
];

function Footer() {
  return (
    <footer className="bg-gray-300 border-t-2 border-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Logo and Name Section */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <Link href="/" className="group">
              <Image
                src="/logo.png"
                alt="High Noon Optimist Club Logo"
                width={120}
                height={120}
                className="transition-transform duration-200 group-hover:scale-105"
              />
            </Link>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-primary">
                High Noon Optimist Club
              </h3>
              <p className="text-dark text-sm mt-1">Regina, Saskatchewan</p>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="flex flex-col items-center space-y-4">
            <h4 className="text-lg font-semibold text-primary">Quick Links</h4>
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-dark hover:text-primary transition-colors duration-200 text-center font-medium"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social Media Section */}
          <div className="flex flex-col items-center md:items-end space-y-4">
            <h4 className="text-lg font-semibold text-primary">Follow Us</h4>
            <a
              href="https://www.facebook.com/p/High-Noon-Optimist-Club-Regina-100064661350870/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-dark hover:text-primary transition-colors duration-200 group"
            >
              <FaFacebook className="text-3xl group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">Facebook</span>
            </a>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-8 pt-6 border-t border-gray-400 text-center">
          <p className="text-dark text-sm">
            © {new Date().getFullYear()} High Noon Optimist Club. All rights
            reserved.
          </p>
          <Link
            href="/admin"
            className="text-gray-500 hover:text-primary text-xs mt-2 inline-block transition-colors duration-200"
          >
            •
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
