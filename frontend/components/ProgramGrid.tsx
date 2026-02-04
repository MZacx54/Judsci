
import React from 'react';
import { Program } from '../types';


interface ProgramGridProps {
  onSelect?: () => void;
  fullView?: boolean;
}

const ProgramGrid: React.FC<ProgramGridProps> = ({ onSelect, fullView }) => {
  const [programs, setPrograms] = React.useState<Program[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/programs/')
      .then(res => res.json())
      .then(data => {
        setPrograms(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch programs:", err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <div className="py-20 text-center text-gray-400">Loading programs...</div>;
  if (programs.length === 0) return null;

  return (
    <section className={`py-32 ${fullView ? 'bg-gray-50' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Our <span className="text-green-700">Thematic</span> Areas</h2>
        <p className="text-lg md:text-xl text-gray-500 max-w-3xl mx-auto mb-20 font-medium">
          Evidence-based interventions designed to address the most critical socio-economic and justice needs across Bauchi State.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {programs.map((prog) => (
            <div
              key={prog.id}
              className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-2 overflow-hidden"
              onClick={onSelect}
            >
              {prog.image ? (
                <div className="h-48 w-full bg-gray-200 relative">
                  <img
                    src={prog.image}
                    alt={prog.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              ) : (
                <div className={`h-32 w-full ${prog.color} opacity-10 relative`}>
                  <div className={`absolute top-6 left-6 w-14 h-14 ${prog.color} text-white text-3xl flex items-center justify-center rounded-2xl shadow-lg z-10 opacity-100`}>
                    {prog.icon}
                  </div>
                </div>
              )}

              <div className="p-8 pt-6">
                <h3 className="text-xl font-bold mb-3 group-hover:text-green-700 transition-colors">{prog.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3">
                  {prog.description}
                </p>
                <button className="text-sm font-bold text-green-700 flex items-center group-hover:gap-2 transition-all">
                  Learn More
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
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
