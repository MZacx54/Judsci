
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
    const [hoveredLGA, setHoveredLGA] = useState<string | null>(null);
    const ALL_LGAS = [...BAUCHI_LGAS, ...GOMBE_LGAS];

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="flex-1 text-left">
                        <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                            Our Footprint <br />Across <span className="text-green-700">Bauchi & Gombe</span>
                        </h2>
                        <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                            JUDSCI Bauchi operates across all 31 Local Government Areas in the Bauchi Diocese, ensuring that no community is left behind in our mission.
                        </p>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Bauchi State LGAs</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {BAUCHI_LGAS.slice(0, 6).map(lga => (
                                        <div key={lga} className="px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-xs font-bold border border-gray-100">{lga}</div>
                                    ))}
                                    <div className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-bold italic">+14 more</div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Gombe State LGAs</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {GOMBE_LGAS.slice(0, 6).map(lga => (
                                        <div key={lga} className="px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-xs font-bold border border-gray-100">{lga}</div>
                                    ))}
                                    <div className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-bold italic">+5 more</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 relative group">
                        <svg
                            viewBox="0 0 500 400"
                            className="w-full h-auto drop-shadow-2xl"
                            style={{ filter: 'drop-shadow(0 25px 25px rgb(0 0 0 / 0.15))' }}
                        >
                            <circle cx="250" cy="200" r="160" fill="#f0fdf4" stroke="#dcfce7" strokeWidth="2" />
                            {ALL_LGAS.map((lga, i) => {
                                const angle = (i / 31) * Math.PI * 2;
                                const r = 110 + Math.random() * 30;
                                const x = 250 + Math.cos(angle) * r;
                                const y = 200 + Math.sin(angle) * r;
                                const isHovered = hoveredLGA === lga;

                                return (
                                    <path
                                        key={i}
                                        d={`M ${x},${y} L ${250 + Math.cos(angle + 0.2) * r},${200 + Math.sin(angle + 0.2) * r} L 250,200 Z`}
                                        fill={isHovered ? "#15803d" : i < 20 ? "#166534" : "#15803d"}
                                        stroke="white"
                                        strokeWidth="1"
                                        className="transition-all duration-300 cursor-pointer"
                                        onMouseEnter={() => setHoveredLGA(lga)}
                                        onMouseLeave={() => setHoveredLGA(null)}
                                        opacity={i < 20 ? 1 : 0.8}
                                    />
                                );
                            })}
                            <text x="250" y="200" textAnchor="middle" className="text-3xl font-black fill-white/10 select-none uppercase">Diocese Reach</text>
                        </svg>

                        {hoveredLGA && (
                            <div className="mt-8 lg:mt-0 lg:absolute lg:top-0 lg:right-0 bg-white shadow-xl p-6 rounded-2xl border border-green-100 animate-in fade-in slide-in-from-right-4 duration-300 z-30">
                                <div className="text-xs font-black text-green-700 uppercase mb-1">Active LGA</div>
                                <div className="text-2xl font-black text-gray-900">{hoveredLGA}</div>
                                <div className="mt-4 flex gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                    <span className="text-xs font-bold text-gray-400 font-mono">Operations Active</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BauchiMap;
