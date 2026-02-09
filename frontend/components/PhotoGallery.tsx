import React, { useState } from 'react';

export interface Photo {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  category: string;
}

export const SAMPLE_photos: Photo[] = [
  {
    id: '1',
    src: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    alt: 'Community Outreach',
    caption: 'Providing essential supplies to rural communities in Bauchi.',
    category: 'Outreach'
  },
  {
    id: '2',
    src: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    alt: 'Environmental Awareness',
    caption: 'Tree planting campaign to combat desertification.',
    category: 'Environment'
  },
  {
    id: '3',
    src: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    alt: 'Legal Aid Workshop',
    caption: 'Educating citizens on their rights and access to justice.',
    category: 'Legal Aid'
  },
  {
    id: '4',
    src: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    alt: 'Youth Empowerment',
    caption: 'Skill acquisition training for unemployed youth.',
    category: 'Empowerment'
  },
  {
    id: '5',
    src: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    alt: 'Clean Water Project',
    caption: 'Commissioning a new borehole for clean water access.',
    category: 'WASH'
  },
  {
    id: '6',
    src: 'https://images.unsplash.com/photo-1576267423048-15c0040fec78?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    alt: 'Healthcare Initiative',
    caption: 'Free medical checkups for the elderly.',
    category: 'Health'
  }
];

const PhotoGallery: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [filter, setFilter] = useState('All');

  const filteredPhotos = filter === 'All'
    ? SAMPLE_photos
    : SAMPLE_photos.filter(p => p.category === filter);

  const categories = ['All', ...Array.from(new Set(SAMPLE_photos.map(p => p.category)))];

  return (
    <div className="space-y-8">
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === cat
              ? 'bg-green-700 text-white shadow-md'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPhotos.map((photo) => (
          <div
            key={photo.id}
            className="group relative cursor-pointer overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300"
            onClick={() => setSelectedPhoto(photo)}
          >
            <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100">
              <img
                src={photo.src}
                alt={photo.alt}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
              <span className="text-xs font-bold text-green-400 uppercase tracking-widest mb-1">{photo.category}</span>
              <h3 className="text-white font-bold text-lg">{photo.alt}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 transition-opacity duration-300"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2"
            onClick={() => setSelectedPhoto(null)}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div
            className="max-w-5xl w-full max-h-screen overflow-y-auto bg-transparent relative"
            onClick={e => e.stopPropagation()}
          >
            <img
              src={selectedPhoto.src}
              alt={selectedPhoto.alt}
              className="w-full h-auto rounded-lg shadow-2xl max-h-[80vh] object-contain mx-auto"
            />
            <div className="mt-4 text-center">
              <h3 className="text-2xl font-bold text-white mb-2">{selectedPhoto.alt}</h3>
              <p className="text-gray-300">{selectedPhoto.caption}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
