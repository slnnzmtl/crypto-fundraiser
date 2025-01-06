import React from 'react';

export const FooterSection: React.FC = () => (
  <footer className="relative z-10 text-center mt-12 border-t border-white/10 pt-16 pb-12">
    <div className="max-w-4xl mx-auto px-4">
      <h2 className="text-2xl xl:text-3xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-yellow-400">
        About the Author
      </h2>
      <p className="text-gray-300 mb-10 text-lg xl:text-xl">
        Created by Daniel Kazansky
      </p>
      <div className="flex justify-center gap-12">
        <a
          href="https://github.com/slnnzmtl"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors duration-200"
        >
          <span className="text-lg xl:text-xl group-hover:scale-110 transition-transform duration-200">GitHub</span>
        </a>
        <a
          href="https://linkedin.com/in/daniel-kazansky"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors duration-200"
        >
          <span className="text-lg xl:text-xl group-hover:scale-110 transition-transform duration-200">LinkedIn</span>
        </a>
      </div>
    </div>
  </footer>
); 