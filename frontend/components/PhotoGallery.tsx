import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS, getMediaUrl } from '../config';

export interface Photo {
  id: string;
  image: string;
  title: string;
  caption?: string;
  category: string;
}

const DEFAULT_PHOTOS: Photo[] = [
  // WASH
  { id: '1', title: 'Borehole Commissioning', category: 'WASH', image: '/media/gallery/Borehole Commissioning Pictures (49).JPG.jpeg', caption: 'Official commissioning of a new motorized borehole providing clean water to over 350 households in Rijin Gani.' },
  { id: '2', title: 'Sanitation Training Session', category: 'WASH', image: '/media/gallery/Borehole Commissioning Pictures (44).JPG.jpeg', caption: 'JUDSCI team conducting hygiene and sanitation sensitization in rural communities.' },
  { id: '3', title: 'Technical Inspection', category: 'WASH', image: '/media/gallery/Borehole Commissioning Pictures (37).JPG.jpeg', caption: 'Quality assurance and technical inspection of newly constructed WASH infrastructure.' },

  // PEACE BUILDING
  { id: '4', title: 'Peace Club Launch', category: 'PEACE_BUILDING', image: '/media/gallery/GSS Bogoro LGA Peace Club members (24).JPG.jpeg', caption: 'Students of GSS Bogoro participating in the launch of the community Peace Club.' },
  { id: '5', title: 'Youth Peace Dialogue', category: 'PEACE_BUILDING', image: '/media/gallery/GSS Bogoro LGA Peace Club members (30).JPG.jpeg', caption: 'Interfaith youth leaders engaging in dialogue to foster religious tolerance.' },
  { id: '6', title: 'Conflict Resolution Workshop', category: 'PEACE_BUILDING', image: '/media/gallery/GSS Bogoro LGA Peace Club members (31).JPG.jpeg', caption: 'Training community members on sustainable conflict resolution techniques.' },
  { id: '7', title: 'Inter-community Peace Sports Festival', category: 'PEACE_BUILDING', image: '/media/gallery/IMG-20250906-WA0004.jpg.jpeg', caption: 'Kick-off ceremony for the North-Gombe State Inter-community Peace Sport Festival 2023.' },
  { id: '8', title: 'Sports for Unity', category: 'PEACE_BUILDING', image: '/media/gallery/IMG-20250906-WA0023.jpg.jpeg', caption: 'Youth teams competing in unity during the regional Peace Sports event.' },
  { id: '9', title: 'Peace Advocacy through Sports', category: 'PEACE_BUILDING', image: '/media/gallery/IMG-20250906-WA0032.jpg.jpeg', caption: 'Using sports as a tool for bridge-building between diverse ethnic groups.' },
  { id: '10', title: 'Harmony Dialogue Session', category: 'PEACE_BUILDING', image: '/media/gallery/IMG-20250906-WA0034.jpg.jpeg', caption: 'Community elders discussing shared resources and harmony.' },

  // EMPOWERMENT
  { id: '11', title: 'Vocational Skills Center', category: 'EMPOWERMENT', image: '/media/gallery/IMG-20250906-WA0085.jpg.jpeg', caption: 'Ongoing vocational skills training for vulnerable women and youth.' },
  { id: '12', title: 'Entrepreneurship Workshop', category: 'EMPOWERMENT', image: '/media/gallery/IMG-20250906-WA0039.jpg.jpeg', caption: 'Empowering women with entrepreneurship and business management skills.' },
  { id: '13', title: 'Youth Skills Acquisition', category: 'EMPOWERMENT', image: '/media/gallery/IMG-20250906-WA0040.jpg.jpeg', caption: 'Empowering the next generation through practical vocational training.' },
  { id: '14', title: 'Graduation Ceremony', category: 'EMPOWERMENT', image: '/media/gallery/IMG-20250906-WA0065.jpg.jpeg', caption: 'Celebrating the graduation of empowerment program beneficiaries.' },
  { id: '15', title: 'Tailoring and Design training', category: 'EMPOWERMENT', image: '/media/gallery/IMG-20250906-WA0069.jpg.jpeg', caption: 'Women learning professional tailoring skills for economic independence.' },
  { id: '16', title: 'Women Empowerment Outreach', category: 'EMPOWERMENT', image: '/media/gallery/IMG-20250906-WA0072.jpg.jpeg', caption: 'Field outreach program focused on female economic inclusion.' },
  { id: '17', title: 'Financial Literacy Session', category: 'EMPOWERMENT', image: '/media/gallery/IMG-20250906-WA0078.jpg.jpeg', caption: 'Village Savings and Loan Association (VSLA) training for rural women.' },
  { id: '18', title: 'Group Empowerment Training', category: 'EMPOWERMENT', image: '/media/gallery/IMG-20250906-WA0080.jpg.jpeg', caption: 'Interactive group training session for local empowerment groups.' },
  { id: '19', title: 'Community Leadership Outreach', category: 'EMPOWERMENT', image: '/media/gallery/IMG_1843.JPG.jpeg', caption: "Engaging community leaders on women's rights and economic participation." },
  { id: '20', title: 'Youth Leadership Summit', category: 'EMPOWERMENT', image: '/media/gallery/IMG_1849.JPG.jpeg', caption: 'Empowering youth leaders with global advocacy skills.' },
  { id: '21', title: 'Economic Resilience Session', category: 'EMPOWERMENT', image: '/media/gallery/IMG_1866.JPG.jpeg', caption: 'Building resilience through diversified income generation training.' },

  // PRISON APOSTOLATE
  { id: '22', title: 'Prison Visitation', category: 'PRISON_APOSTOLATE', image: '/media/gallery/IMG_20250909_093607.jpg.jpeg', caption: 'Welfare support and counseling visit to a correctional facility in Bauchi.' },
  { id: '23', title: 'Legal Aid Outreach', category: 'PRISON_APOSTOLATE', image: '/media/gallery/IMG_20250909_093613.jpg.jpeg', caption: 'Providing legal guidance and human rights awareness to inmates.' },
  { id: '24', title: 'Inmate Support Program', category: 'PRISON_APOSTOLATE', image: '/media/gallery/IMG_20250909_093705.jpg.jpeg', caption: 'Donation of welfare materials and essential supplies to correctional centers.' },

  // SUSTAINABLE AGRIC
  { id: '25', title: 'Modern Farming Demo', category: 'SUSTAINABLE_AGRIC', image: '/media/gallery/sustainable_agric.jpg', caption: 'Demonstrating sustainable agricultural techniques to improve food security.' },

  // GENERAL
  { id: '26', title: 'Stakeholder Engagement', category: 'GENERAL', image: '/media/gallery/IMG-20200310-WA0004.jpg.jpeg', caption: 'JUDSCI Bauchi coordinating with local stakeholders on regional development.' }
];

const PhotoGallery: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>(DEFAULT_PHOTOS);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.PHOTOS);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setPhotos(data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch photos, using defaults:", error);
      }
    };
    fetchPhotos();
  }, []);

  const filteredPhotos = filter === 'All'
    ? photos
    : photos.filter(p => p.category === filter);

  const categories = ['All', ...Array.from(new Set(photos.map(p => p.category)))];

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
            {cat.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Grid Layout */}
      {filteredPhotos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              className="group relative cursor-pointer overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
              onClick={() => setSelectedPhoto(photo)}
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100">
                <img
                  src={photo.image ? getMediaUrl(photo.image) : `https://picsum.photos/seed/${photo.id}/800/600`}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${photo.id}/800/600`;
                  }}
                  alt={photo.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <span className="text-xs font-bold text-green-400 uppercase tracking-widest mb-1">{photo.category.replace('_', ' ')}</span>
                <h3 className="text-white font-bold text-lg leading-snug">{photo.title}</h3>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400 font-medium italic">No photos found in this category.</p>
        </div>
      )}

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
              src={selectedPhoto.image ? getMediaUrl(selectedPhoto.image) : `https://picsum.photos/seed/${selectedPhoto.id}/800/600`}
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${selectedPhoto.id}/800/600`;
              }}
              alt={selectedPhoto.title}
              className="w-full h-auto rounded-lg shadow-2xl max-h-[80vh] object-contain mx-auto"
            />
            <div className="mt-4 text-center">
              <h3 className="text-2xl font-bold text-white mb-2">{selectedPhoto.title}</h3>
              <p className="text-gray-300 max-w-2xl mx-auto">{selectedPhoto.caption}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
