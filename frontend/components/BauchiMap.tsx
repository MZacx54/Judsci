
import React, { useState } from 'react';

const BAUCHI_LGAS = [
    "Alkaleri", "Bauchi", "Bogoro", "Dambam", "Darazo", "Dass", "Gamawa", "Ganjuwa",
    "Giade", "Itas/Gadau", "Jama'are", "Katagum", "Kirfi", "Misau", "Ningi",
    "Shira", "Tafawa Balewa", "Toro", "Warji", "Zaki"
];

const GOMBE_LGAS = [
    "Akko", "Balanga", "Billiri", "Dukku", "Funakaye", "Gombe", "Kaltungo", "Kwami",
    "Nafada", "Shongom", "Yamaltu/Deba"
];

const BauchiMap: React.FC = () => {
    const [selectedLGA, setSelectedLGA] = useState<string | null>("Bauchi");
    const [showAllBauchi, setShowAllBauchi] = useState(false);
    const [showAllGombe, setShowAllGombe] = useState(false);

    const displayedBauchi = showAllBauchi ? BAUCHI_LGAS : BAUCHI_LGAS.slice(0, 6);
    const displayedGombe = showAllGombe ? GOMBE_LGAS : GOMBE_LGAS.slice(0, 6);

    return (
        <section className="py-14 sm:py-24 bg-white overflow-hidden border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
                    <div className="flex-1 text-left w-full">
                        <span className="text-xs font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">
                            Diocesan Jurisdiction
                        </span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6 leading-tight text-gray-900">
                            Our Footprint Across <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-emerald-600">
                                Bauchi & Gombe States
                            </span>
                        </h2>
                        <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                            JUDSCI Bauchi operates actively across all <strong>31 Local Government Areas</strong> in the Bauchi Diocese (20 in Bauchi State, 11 in Gombe State), bringing transformative WASH projects, peace initiatives, and human rights advocacy to grassroot communities.
                        </p>

                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center justify-between mb-2.5">
                                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">
                                        Bauchi State (20 LGAs)
                                    </h3>
                                    <button
                                        onClick={() => setShowAllBauchi(!showAllBauchi)}
                                        className="text-xs font-bold text-green-700 hover:text-green-800 underline"
                                    >
                                        {showAllBauchi ? "Show Less" : "+ View All 20"}
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {displayedBauchi.map(lga => (
                                        <button
                                            key={lga}
                                            onClick={() => setSelectedLGA(lga)}
                                            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all text-left truncate ${
                                                selectedLGA === lga
                                                    ? 'bg-green-700 text-white shadow-md'
                                                    : 'bg-gray-50 text-gray-700 border border-gray-100 hover:bg-gray-100'
                                            }`}
                                        >
                                            📍 {lga}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2.5">
                                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">
                                        Gombe State (11 LGAs)
                                    </h3>
                                    <button
                                        onClick={() => setShowAllGombe(!showAllGombe)}
                                        className="text-xs font-bold text-green-700 hover:text-green-800 underline"
                                    >
                                        {showAllGombe ? "Show Less" : "+ View All 11"}
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {displayedGombe.map(lga => (
                                        <button
                                            key={lga}
                                            onClick={() => setSelectedLGA(lga)}
                                            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all text-left truncate ${
                                                selectedLGA === lga
                                                    ? 'bg-green-700 text-white shadow-md'
                                                    : 'bg-gray-50 text-gray-700 border border-gray-100 hover:bg-gray-100'
                                            }`}
                                        >
                                            📍 {lga}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 w-full relative group">
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50/50 p-6 sm:p-8 rounded-3xl border border-green-100 shadow-xl text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-700 text-white rounded-2xl mb-4 shadow-lg text-2xl">
                                🗺️
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                                {selectedLGA || "Bauchi Diocese"}
                            </h3>
                            <p className="text-xs sm:text-sm text-green-700 font-semibold mb-4">
                                Active Project Intervention Zone
                            </p>
                            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto text-left">
                                <div className="bg-white p-3 rounded-xl border border-green-100 shadow-sm">
                                    <div className="text-[10px] uppercase font-bold text-gray-400">Interventions</div>
                                    <div className="text-sm font-bold text-gray-800">WASH & Peace</div>
                                </div>
                                <div className="bg-white p-3 rounded-xl border border-green-100 shadow-sm">
                                    <div className="text-[10px] uppercase font-bold text-gray-400">Coverage</div>
                                    <div className="text-sm font-bold text-gray-800">Community Level</div>
                                </div>
                            </div>
                            <div className="mt-6 text-xs text-gray-500">
                                Supporting sustainable water systems, agricultural cooperatives, and social cohesion across all zones.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BauchiMap;
