import React from 'react';
import { API_ENDPOINTS } from '../config';
import { BlogPost } from '../types';


interface NewsSectionProps {
  fullView?: boolean;
  onReadStory?: (post: BlogPost) => void;
  onSeeAll?: () => void;
}

const NewsSection: React.FC<NewsSectionProps> = ({ fullView, onReadStory, onSeeAll }) => {
  const [posts, setPosts] = React.useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    fetch(API_ENDPOINTS.POSTS)
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch posts:", err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <div className="py-20 text-center text-gray-400">Loading stories...</div>;
  if (posts.length === 0) return null;

  const displayPosts = fullView ? posts : posts.slice(0, 3);

  return (
    <section className={`py-32 ${fullView ? 'bg-white' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Voices of <span className="text-green-700">Change</span></h2>
            <p className="text-lg text-gray-500 font-medium max-w-2xl">Discover firsthand stories of impact and transformation from our field operations across Bauchi State.</p>
          </div>
          {!fullView && onSeeAll && (
            <button
              onClick={onSeeAll}
              className="text-green-700 font-bold hover:underline flex items-center gap-2"
            >
              View All Posts &rarr;
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayPosts.map(post => (
            <article key={post.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all group border border-gray-100 flex flex-col h-full">
              <div className="h-64 overflow-hidden relative cursor-pointer" onClick={() => onReadStory?.(post)}>
                <img
                  src={post.image || `https://picsum.photos/seed/${post.slug}/800/600`}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                  decoding="async"
                />
                <span className="absolute top-4 left-4 px-3 py-1 bg-green-700 text-white text-xs font-bold rounded-lg shadow-lg">
                  {post.category}
                </span>
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <div className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">{new Date(post.published_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                <h3
                  className="text-xl font-bold mb-4 group-hover:text-green-700 transition-colors cursor-pointer leading-tight"
                  onClick={() => onReadStory?.(post)}
                >
                  {post.title}
                </h3>
                <p className="text-gray-600 line-clamp-3 text-sm leading-relaxed mb-8 flex-grow">
                  {post.summary}
                </p>
                <button
                  onClick={() => onReadStory?.(post)}
                  className="text-sm font-black text-gray-900 flex items-center gap-2 group-hover:gap-4 transition-all mt-auto"
                >
                  Read Full Story
                  <svg className="w-4 h-4 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
