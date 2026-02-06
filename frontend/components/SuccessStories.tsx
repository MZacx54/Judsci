import React, { useState, useEffect } from 'react';
import { BlogPost } from '../types';

const SuccessStories: React.FC = () => {
  const [active, setActive] = useState(0);
  const [stories, setStories] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/posts/')
      .then(res => res.json())
      .then(data => {
        // Filter for "WASH" or "Success" categories if available, 
        // otherwise just take the last 3
        setStories(data.slice(0, 3));
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  if (isLoading || stories.length === 0) return null;

  return (
    <section className="py-20 bg-green-900 text-white relative overflow-hidden">
      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-6">Success <span className="text-green-300">Stories</span></h2>
          <div className="w-24 h-1.5 bg-green-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            {stories.map((story, idx) => (
              <button
                key={idx}
                onClick={() => setActive(idx)}
                className={`text-left w-full p-6 rounded-2xl transition-all duration-300 border border-green-700 ${active === idx ? 'bg-white/10 shadow-lg scale-105 border-green-500' : 'hover:bg-green-800'
                  }`}
              >
                <h4 className="text-xl font-bold mb-2 text-green-100 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-sm text-white">
                    {idx + 1}
                  </span>
                  {story.title}
                </h4>
                <p className={`text-green-200 line-clamp-2 ${active === idx ? 'opacity-100' : 'opacity-60'}`}>
                  {story.summary}
                </p>
              </button>
            ))}
          </div>

          <div className="bg-white text-gray-900 p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative animate-in fade-in slide-in-from-right-8 duration-500" key={active}>
            <div className="absolute -top-6 -right-6 text-9xl text-green-100 font-serif leading-none opacity-50">”</div>

            <div className="space-y-6">
              <div>
                <h5 className="text-xs font-bold text-green-600 uppercase tracking-widest mb-2">Impact Highlight</h5>
                <p className="text-gray-600 leading-relaxed italic text-lg">
                  {stories[active].summary}
                </p>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <p className="text-gray-500 text-sm mb-4">
                  This is part of our ongoing commitment to community development. {stories[active].title} represents the progress we are making together.
                </p>
                <p className="text-green-700 font-bold uppercase tracking-widest text-xs">Category: {stories[active].category}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;
