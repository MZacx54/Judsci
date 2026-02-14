
import React from 'react';
import { API_ENDPOINTS } from '../config';
import { Program, BlogPost } from '../types';

interface ProgramGridProps {
  onSelect?: () => void;
  fullView?: boolean;
  onReadStory?: (post: BlogPost) => void;
}

const ProgramGrid: React.FC<ProgramGridProps> = ({ onSelect, fullView, onReadStory }) => {
  const [programs, setPrograms] = React.useState<Program[]>([]);
  const [posts, setPosts] = React.useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Fetch both programs and posts to allow linking
    Promise.all([
      fetch(API_ENDPOINTS.PROGRAMS).then(res => res.json()),
      fetch(API_ENDPOINTS.POSTS).then(res => res.json())
    ]).then(([progData, postData]) => {
      setPrograms(progData);
      setPosts(postData);
      setIsLoading(false);
    }).catch(err => {
      console.error("Failed to fetch data:", err);
      setIsLoading(false);
    });
  }, []);

  const handleProgramClick = (prog: Program) => {
    // Try to find a blog post with the same category/title or slug
    const matchingPost = posts.find(p =>
      p.category.toLowerCase().includes(prog.title.toLowerCase().substring(0, 5)) ||
      p.slug.includes(prog.slug)
    );

    if (matchingPost && onReadStory) {
      onReadStory(matchingPost);
    } else if (onSelect) {
      onSelect();
    }
  };

  if (isLoading) return <div className="py-20 text-center text-gray-400">Loading programs...</div>;
  if (programs.length === 0) return null;

  return (
    <section className={`py-16 md:py-32 ${fullView ? 'bg-gray-50' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Our <span className="text-green-700">Thematic</span> Areas</h2>
        <p className="text-lg md:text-xl text-gray-500 max-w-3xl mx-auto mb-20 font-medium">
          Evidence-based interventions designed to address the most critical socio-economic and justice needs across the <strong>Bauchi Diocese</strong> (Bauchi and Gombe States).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {programs.map((prog) => (
            <div
              key={prog.id}
              className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-2 overflow-hidden flex flex-col h-full"
              onClick={() => handleProgramClick(prog)}
            >
              <div className="h-56 w-full bg-gray-100 relative overflow-hidden">
                {prog.image ? (
                  <img
                    src={prog.image}
                    alt={`JDPC Bauchi Program: ${prog.title}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className={`w-full h-full ${prog.color} opacity-20 flex items-center justify-center text-5xl`}>
                    {prog.icon}
                  </div>
                )}
              </div>

              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold mb-3 group-hover:text-green-700 transition-colors leading-tight">{prog.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-8 line-clamp-3 text-sm">
                  {prog.description}
                </p>
                <button
                  onClick={(e) => { e.stopPropagation(); handleProgramClick(prog); }}
                  className="text-sm font-black text-green-700 flex items-center gap-2 group-hover:gap-4 transition-all mt-auto pointer-events-auto"
                >
                  Learn More
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgramGrid;
