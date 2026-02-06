import React from 'react';

const PARTNERS = [
    { name: 'MISEREOR', category: 'International', logo: '🤝' },
    { name: 'Catholic Relief Services', category: 'International', logo: '✝️' },
    { name: 'USAID', category: 'International', logo: '🇺🇸' },
    { name: 'European Union', category: 'International', logo: '🇪🇺' },
    { name: 'British High Commission', category: 'International', logo: '🇬🇧' },
    { name: 'ActionAid', category: 'International', logo: '🌍' },
    { name: 'Caritas Nigeria', category: 'Local', logo: '🕊️' },
    { name: 'NHRC Nigeria', category: 'Local', logo: '⚖️' },
];

interface PartnersListProps {
    onInquire?: () => void;
}

const PartnersList: React.FC<PartnersListProps> = ({ onInquire }) => {
    return (
        <section className="py-24 bg-gray-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h4 className="text-xs font-black text-green-700 uppercase tracking-[0.3em] mb-4">Our Collaborative Network</h4>
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">Trusted by <span className="text-green-700">Global</span> & Local Partners</h2>
                </div>

                <div className="relative">
                    {/* Continuous scrolling row */}
                    <div className="flex gap-8 animate-scroll">
                        {[...PARTNERS, ...PARTNERS].map((partner, idx) => (
                            <div
                                key={idx}
                                className="flex-shrink-0 flex items-center gap-4 bg-white px-8 py-6 rounded-2xl shadow-sm border border-gray-100 grayscale hover:grayscale-0 transition-all cursor-pointer group"
                            >
                                <div className="text-4xl group-hover:scale-110 transition-transform">{partner.logo}</div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{partner.name}</h3>
                                    <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">{partner.category}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none"></div>
                </div>

                <style>{`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-scroll {
            display: flex;
            width: fit-content;
            animation: scroll 40s linear infinite;
          }
          .animate-scroll:hover {
            animation-play-state: paused;
          }
        `}</style>

                <div className="mt-20 text-center">
                    <p className="text-gray-500 max-w-2xl mx-auto mb-8 font-medium italic">
                        "JDPC works with communities across Bauchi and Gombe States, reaching all people irrespective of religion, ethnicity, or political affiliation."
                    </p>
                    <button
                        onClick={onInquire}
                        className="px-8 py-4 bg-white border-2 border-green-700 text-green-700 font-black rounded-2xl hover:bg-green-700 hover:text-white transition-all shadow-lg active:scale-95"
                    >
                        Inquire about Partnership
                    </button>
                </div>
            </div>
        </section>
    );
};

export default PartnersList;
