import React from 'react';
import { API_ENDPOINTS, getMediaUrl } from '../config';
import { Program, BlogPost } from '../types';

interface ProgramGridProps {
  onSelect?: () => void;
  fullView?: boolean;
  onReadStory?: (post: BlogPost) => void;
}

const DEFAULT_PROGRAMS: Program[] = [
  {
    id: 1,
    title: "Water, Sanitation and Hygiene (WASH)",
    slug: "wash",
    icon: "💧",
    color: "bg-blue-500",
    description: "Our WASH interventions focus on the provision of potable water through the construction of boreholes and wells, sensitization on sanitation and hygiene, and VIP latrines with support from Misereor.",
    full_content: "Our WASH interventions focus on the provision of potable water..."
  },
  {
    id: 2,
    title: "Peace Building & Conflict Resolution",
    slug: "peace-building",
    icon: "🕊️",
    color: "bg-green-600",
    description: "We facilitate inclusive dialogue sessions, establish interfaith peace structures, and create Peace Clubs in schools to foster social and religious tolerance across Bauchi and Gombe States.",
    full_content: "We facilitate inclusive dialogue sessions..."
  },
  {
    id: 3,
    title: "Sustainable Agriculture",
    slug: "agriculture",
    icon: "🌱",
    color: "bg-emerald-600",
    description: "We promote sustainable agricultural practices to improve food security and economic resilience for local farmers across rural communities.",
    full_content: "We promote sustainable agricultural practices..."
  },
  {
    id: 4,
    title: "Women and Youth Empowerment",
    slug: "empowerment",
    icon: "👩‍🚀",
    color: "bg-orange-500",
    description: "Empowering women and youth through vocational skills training, entrepreneurship development, and advocacy for economic independence.",
    full_content: "Empowering women and youth..."
  },
  {
    id: 5,
    title: "Prison Apostolate",
    slug: "prison-apostolate",
    icon: "⚖️",
    color: "bg-red-600",
    description: "We advocate for the rights and dignity of inmates by providing support services, welfare assistance, and spiritual guidance within correctional facilities.",
    full_content: "We advocate for the rights and dignity of inmates..."
  }
];

const ProgramGrid: React.FC<ProgramGridProps> = ({ onSelect, fullView, onReadStory }) => {
  const [programs, setPrograms] = React.useState<Program[]>(DEFAULT_PROGRAMS);
  const [posts, setPosts] = React.useState<BlogPost[]>([]);

  React.useEffect(() => {
    Promise.all([
      fetch(API_ENDPOINTS.PROGRAMS).then(res => res.json()).catch(() => null),
      fetch(API_ENDPOINTS.POSTS).then(res => res.json()).catch(() => null)
    ]).then(([progData, postData]) => {
      if (Array.isArray(progData) && progData.length > 0) {
        setPrograms(progData);
      }
      if (Array.isArray(postData)) {
        setPosts(postData);
      }
    }).catch(err => {
      console.error("Failed to fetch data:", err);
    });
  }, []);

  const handleProgramClick = (prog: Program) => {
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
                    src={getMediaUrl(prog.image)}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${prog.slug || prog.id}/800/600`;
                    }}
                    alt={`JDPC Bauchi Program: ${prog.title}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className={`w-full h-full ${prog.color || 'bg-green-600'} opacity-20 flex items-center justify-center text-5xl`}>
                    {prog.icon || '📌'}
                  </div>
                )}
                <div className="absolute top-4 right-4 w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-md shadow-lg flex items-center justify-center text-2xl z-10 border border-gray-100">
                  {prog.icon || '📌'}
                </div>
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
