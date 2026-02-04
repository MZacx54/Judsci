
import React, { useState } from 'react';

const LGAS = [
    "Alkaleri", "Bauchi", "Bogoro", "Dambam", "Darazo", "Dass", "Gamawa", "Ganjuwa",
    "Giade", "Itas/Gadau", "Jama'are", "Katagum", "Kirfi", "Misau", "Ningis",
    "Shira", "Tafawa Balewa", "Toro", "Warji", "Zaki"
];

const BauchiMap: React.FC = () => {
    const [hoveredLGA, setHoveredLGA] = useState<string | null>(null);

    // Simplified representative SVG shapes for Bauchi LGAs
    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="flex-1 text-left">
                        <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                            Our Footprint <br />Across <span className="text-green-700">Bauchi</span>
                        </h2>
                        <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                            JDPC Bauchi operates across all 20 Local Government Areas, ensuring that no community is left behind in our quest for justice and development.
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            {LGAS.slice(0, 8).map(lga => (
                                <div
                                    key={lga}
                                    onMouseEnter={() => setHoveredLGA(lga)}
                                    onMouseLeave={() => setHoveredLGA(null)}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-default ${hoveredLGA === lga ? 'bg-green-700 text-white shadow-lg' : 'bg-gray-100 text-gray-600'
                                        }`}
                                >
                                    {lga}
                                </div>
                            ))}
                            <div className="px-4 py-2 rounded-xl text-sm font-bold bg-green-50 text-green-700 italic">
                                +12 more LGAs
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 relative group">
                        <svg
                            viewBox="0 0 500 400"
                            className="w-full h-auto drop-shadow-2xl"
                            style={{ filter: 'drop-shadow(0 25px 25px rgb(0 0 0 / 0.15))' }}
                        >
                            {/* This is a stylized/illustrative map of Bauchi */}
                            <circle cx="250" cy="200" r="150" fill="#f0fdf4" stroke="#dcfce7" strokeWidth="2" />
                            {[...Array(20)].map((_, i) => {
                                const angle = (i / 20) * Math.PI * 2;
                                const r = 100 + Math.random() * 40;
                                const x = 250 + Math.cos(angle) * r;
                                const y = 200 + Math.sin(angle) * r;
                                const lgaName = LGAS[i];
                                const isHovered = hoveredLGA === lgaName;

                                return (
                                    <path
                                        key={i}
                                        d={`M ${x},${y} L ${250 + Math.cos(angle + 0.3) * r},${200 + Math.sin(angle + 0.3) * r} L 250,200 Z`}
                                        fill={isHovered ? "#15803d" : "#166534"}
                                        stroke="white"
                                        strokeWidth="1"
                                        className="transition-all duration-300 cursor-pointer"
                                        onMouseEnter={() => setHoveredLGA(lgaName)}
                                        onMouseLeave={() => setHoveredLGA(null)}
                                        style={{
                                            transform: isHovered ? 'scale(1.05) translate(-10px, -10px)' : 'scale(1)',
                                            transformOrigin: '250px 200px'
                                        }}
                                    />
                                );
                            })}
                            <text x="250" y="200" textAnchor="middle" className="text-4xl font-black fill-white/10 select-none">BAUCHI</text>
                        </svg>

                        {hoveredLGA && (
                            <div className="absolute top-0 right-0 bg-white shadow-2xl p-6 rounded-2xl border border-green-100 animate-in fade-in slide-in-from-right-4 duration-300">
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
