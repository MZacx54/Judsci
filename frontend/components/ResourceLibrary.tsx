import React, { useState } from 'react';
import { API_ENDPOINTS, getMediaUrl } from '../config';
import { Resource } from '../types';
import PhotoGallery from './PhotoGallery';

const resolveResourceUrl = (fileUrl?: string) => {
  if (!fileUrl) return '/resources/ANNUAL_NARRATIVE_REPORT_2023.pdf';
  if (fileUrl.startsWith('http')) return fileUrl;
  const filename = fileUrl.split('/').pop() || '';
  if (filename) {
    return `/resources/${filename}`;
  }
  return getMediaUrl(fileUrl);
};

const DEFAULT_RESOURCES: Resource[] = [
  {
    id: '1',
    title: 'Annual Narrative Report 2023',
    type: 'Annual Report',
    date: '2023-12-31',
    file: '/resources/ANNUAL_NARRATIVE_REPORT_2023.pdf',
    description: 'Comprehensive overview of JUDSCI Bauchi interventions, achievements, and financial reports for the 2023 project year.'
  },
  {
    id: '2',
    title: 'WASH Community Implementation & Sanitation Guide',
    type: 'Newsletter',
    date: '2024-03-15',
    file: '/resources/ANNUAL_NARRATIVE_REPORT_2023.pdf',
    description: 'Best practices for establishing WASHCOM committees and managing rural water infrastructure.'
  },
  {
    id: '3',
    title: 'Peace Building & Inter-faith Dialogue Toolkit',
    type: 'Other',
    date: '2024-06-20',
    file: '/resources/ANNUAL_NARRATIVE_REPORT_2023.pdf',
    description: 'Practical handbook for facilitating community peace clubs and conflict resolution in northern Nigeria.'
  }
];

const ResourceLibrary: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'gallery' | 'publications'>('gallery');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');
  const [resources, setResources] = useState<Resource[]>(DEFAULT_RESOURCES);

  React.useEffect(() => {
    fetch(API_ENDPOINTS.RESOURCES)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setResources(data);
        }
      })
      .catch(err => {
        console.error("Failed to fetch resources, using defaults:", err);
      });
  }, []);

  const filtered = resources.filter(res => {
    const matchesSearch = (res.title || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All' || res.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <section className="py-12 sm:py-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-10 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-green-700 bg-green-50 px-3 py-1 rounded-full mb-3 inline-block">
            Document Repository & Media
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Resource Center</h2>
          <p className="text-gray-500 text-sm sm:text-base max-w-2xl mx-auto">
            Access our verified visual archives, program photo galleries, official annual narrative reports, and community handbooks.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8 sm:mb-12">
          <div className="bg-white p-1.5 rounded-full shadow-sm border border-gray-200 flex w-full max-w-sm sm:w-auto">
            <button
              onClick={() => setActiveTab('gallery')}
              className={`flex-1 sm:flex-initial px-4 sm:px-8 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold transition-all text-center ${
                activeTab === 'gallery'
                  ? 'bg-green-700 text-white shadow-md'
                  : 'text-gray-600 hover:text-green-700 active:bg-gray-50'
              }`}
            >
              📷 Photo Gallery
            </button>
            <button
              onClick={() => setActiveTab('publications')}
              className={`flex-1 sm:flex-initial px-4 sm:px-8 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold transition-all text-center ${
                activeTab === 'publications'
                  ? 'bg-green-700 text-white shadow-md'
                  : 'text-gray-600 hover:text-green-700 active:bg-gray-50'
              }`}
            >
              📄 Publications
            </button>
          </div>
        </div>

        {activeTab === 'publications' ? (
          <>
            <div className="flex flex-col md:flex-row gap-4 mb-8 sm:mb-12">
              <div className="flex-grow relative">
                <input
                  type="text"
                  placeholder="Search reports, manuals, guides..."
                  className="w-full pl-11 pr-4 py-3.5 sm:py-4 text-sm rounded-2xl bg-white border border-gray-200 outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base">🔍</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none items-center">
                {['All', 'Annual Report', 'Newsletter', 'Other'].map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`whitespace-nowrap px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                      filter === f
                        ? 'bg-green-700 text-white shadow-md'
                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 active:bg-gray-100'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(res => (
                <div key={res.id} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                  <div>
                    <div className="w-12 h-12 bg-green-50 text-green-700 flex items-center justify-center rounded-2xl mb-5 group-hover:bg-green-700 group-hover:text-white transition-colors text-xl">
                      📄
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-green-800 bg-green-50 px-2.5 py-1 rounded-md mb-3 inline-block">
                      {res.type.replace('_', ' ')}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold mb-2 leading-snug text-gray-900 group-hover:text-green-800 transition-colors">
                      {res.title}
                    </h3>
                    <p className="text-xs text-gray-400 mb-3 font-medium">
                      Published on {new Date(res.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    {res.description && (
                      <p className="text-xs sm:text-sm text-gray-500 mb-6 leading-relaxed line-clamp-3">
                        {res.description}
                      </p>
                    )}
                  </div>
                  <a
                    href={resolveResourceUrl(res.file)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 bg-gray-50 hover:bg-green-700 hover:text-white text-gray-800 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 mt-auto active:scale-[0.98] border border-gray-200 hover:border-green-700"
                  >
                    Download Official PDF
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </a>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="col-span-full py-20 text-center text-gray-400">
                  No resources found matching your criteria.
                </div>
              )}
            </div>
          </>
        ) : (
          <PhotoGallery />
        )}
      </div>
    </section>
  );
};

export default ResourceLibrary;
