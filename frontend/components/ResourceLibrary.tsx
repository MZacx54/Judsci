import React, { useState } from 'react';
import { API_ENDPOINTS, getMediaUrl } from '../config';
import { Resource } from '../types';
import PhotoGallery from './PhotoGallery';

const DEFAULT_RESOURCES: Resource[] = [
  {
    id: '1',
    title: 'Annual Narrative Report 2023',
    type: 'Annual Report',
    date: '2023-12-31',
    file: getMediaUrl('/media/resources/ANNUAL_NARRATIVE_REPORT_2023.pdf'),
    description: 'Comprehensive overview of JUDSCI Bauchi interventions, achievements, and financial reports for the 2023 project year.'
  },
  {
    id: '2',
    title: 'WASH Community Implementation & Sanitation Guide',
    type: 'Newsletter',
    date: '2024-03-15',
    file: getMediaUrl('/media/resources/ANNUAL_NARRATIVE_REPORT_2023.pdf'),
    description: 'Best practices for establishing WASHCOM committees and managing rural water infrastructure.'
  },
  {
    id: '3',
    title: 'Peace Building & Inter-faith Dialogue Toolkit',
    type: 'Other',
    date: '2024-06-20',
    file: getMediaUrl('/media/resources/ANNUAL_NARRATIVE_REPORT_2023.pdf'),
    description: 'Practical handbook for facilitating community peace clubs and conflict resolution in northern Nigeria.'
  }
];

const ResourceLibrary: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'gallery' | 'publications'>('publications');
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
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Resource Center</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Access our publications, reports, knowledge products, and visual stories.</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-white p-1 rounded-full shadow-sm border border-gray-100 inline-flex">
            <button
              onClick={() => setActiveTab('publications')}
              className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${activeTab === 'publications'
                ? 'bg-green-700 text-white shadow-md'
                : 'text-gray-500 hover:text-green-700'
                }`}
            >
              Publications
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${activeTab === 'gallery'
                ? 'bg-green-700 text-white shadow-md'
                : 'text-gray-500 hover:text-green-700'
                }`}
            >
              Photo Gallery
            </button>
          </div>
        </div>

        {activeTab === 'publications' ? (
          <>
            <div className="flex flex-col md:flex-row gap-6 mb-12">
              <div className="flex-grow relative">
                <input
                  type="text"
                  placeholder="Search reports, manuals..."
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-gray-200 outline-none focus:ring-2 focus:ring-green-500"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">🔍</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {['All', 'Annual Report', 'Newsletter', 'Other'].map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`whitespace-nowrap px-6 py-3 rounded-2xl font-bold transition-all ${filter === f ? 'bg-green-700 text-white shadow-lg' : 'bg-white text-gray-500 border border-gray-200'
                      }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map(res => (
                <div key={res.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 bg-gray-100 text-gray-400 flex items-center justify-center rounded-xl mb-6 group-hover:bg-green-100 group-hover:text-green-700 transition-colors">
                      📄
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-green-700 bg-green-50 px-2 py-1 rounded-md mb-3 inline-block">
                      {res.type}
                    </span>
                    <h3 className="text-lg font-bold mb-2 leading-snug">{res.title}</h3>
                    <p className="text-sm text-gray-400 mb-4">Published on {new Date(res.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    {res.description && (
                      <p className="text-xs text-gray-500 mb-6 leading-relaxed line-clamp-2">{res.description}</p>
                    )}
                  </div>
                  <a href={res.file} target="_blank" rel="noopener noreferrer" className="w-full py-3 bg-gray-50 hover:bg-green-700 hover:text-white text-gray-600 font-bold rounded-xl transition-all flex items-center justify-center gap-2 mt-auto">
                    Download PDF
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
