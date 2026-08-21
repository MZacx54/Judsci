import React from 'react';

// Custom SVG partner brand logos
const MisereorLogo = () => (
    <div className="w-12 h-12 flex items-center justify-center bg-red-700 text-white rounded-xl shadow-sm font-black text-xs tracking-tighter p-1 text-center leading-none">
        <div className="flex flex-col items-center">
            <span className="text-[14px] font-extrabold tracking-widest uppercase">MIS</span>
            <span className="text-[9px] tracking-tight uppercase opacity-90">EREOR</span>
        </div>
    </div>
);

const CRSLogo = () => (
    <div className="w-12 h-12 flex items-center justify-center bg-blue-900 text-white rounded-xl shadow-sm font-black text-xs tracking-tighter p-1 text-center leading-none border border-blue-800">
        <div className="flex flex-col items-center">
            <span className="text-[14px] font-extrabold tracking-tighter text-red-500">CRS</span>
            <span className="text-[7px] tracking-widest text-blue-200 uppercase">Relief</span>
        </div>
    </div>
);

const CaritasLogo = () => (
    <div className="w-12 h-12 flex items-center justify-center bg-rose-800 text-white rounded-xl shadow-sm font-black text-xs tracking-tighter p-1 text-center leading-none">
        <div className="flex flex-col items-center">
            <span className="text-base mb-[1px]">✝️</span>
            <span className="text-[8px] font-black tracking-wider uppercase text-yellow-300">Caritas</span>
        </div>
    </div>
);

const JDPHLogo = () => (
    <div className="w-12 h-12 flex items-center justify-center bg-emerald-800 text-white rounded-xl shadow-sm font-black text-xs tracking-tighter p-1 text-center leading-none border border-emerald-700">
        <div className="flex flex-col items-center">
            <span className="text-[14px] font-extrabold tracking-tight text-amber-300">JDPH</span>
            <span className="text-[7px] tracking-widest text-emerald-200 uppercase">Health</span>
        </div>
    </div>
);

interface Partner {
    name: string;
    category: string;
    logoComponent: React.ReactNode;
    logoUrl?: string;
}

const PARTNERS: Partner[] = [
    {
        name: 'Misereor',
        category: 'International',
        logoComponent: <MisereorLogo />,
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Misereor_Logo_%282022%29.svg'
    },
    {
        name: 'Catholic Relief Services (CRS)',
        category: 'International',
        logoComponent: <CRSLogo />
    },
    {
        name: 'Caritas Nigeria',
        category: 'Local',
        logoComponent: <CaritasLogo />
    },
    {
        name: 'JDPH',
        category: 'Local',
        logoComponent: <JDPHLogo />
    }
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
                        {[...PARTNERS, ...PARTNERS, ...PARTNERS].map((partner, idx) => (
                            <div
                                key={idx}
                                className="flex-shrink-0 flex items-center gap-4 bg-white px-8 py-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group"
                            >
                                <div className="group-hover:scale-110 transition-transform flex items-center justify-center">
                                    {partner.logoUrl ? (
                                        <img
                                            src={partner.logoUrl}
                                            alt={partner.name}
                                            className="w-12 h-12 object-contain"
                                            onError={(e) => {
                                                // Fall back to SVG component if URL fails
                                                (e.target as HTMLElement).style.display = 'none';
                                                (e.target as HTMLElement).nextElementSibling?.classList.remove('hidden');
                                            }}
                                        />
                                    ) : null}
                                    <div className={partner.logoUrl ? 'hidden' : ''}>
                                        {partner.logoComponent}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-sm md:text-base">{partner.name}</h3>
                                    <p className="text-[10px] uppercase font-black text-green-700 tracking-widest">{partner.category}</p>
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
            100% { transform: translateX(-33.33%); }
          }
          .animate-scroll {
            display: flex;
            width: fit-content;
            animation: scroll 35s linear infinite;
          }
          .animate-scroll:hover {
            animation-play-state: paused;
          }
        `}</style>

                <div className="mt-20 text-center">
                    <p className="text-gray-500 max-w-2xl mx-auto mb-8 font-medium italic">
                        "JUDSCI works with communities across Bauchi and Gombe States, reaching all people irrespective of religion, ethnicity, or political affiliation."
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
