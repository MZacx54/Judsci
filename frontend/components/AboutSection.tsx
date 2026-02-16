import React from 'react';
import aboutUsImg from '../assets/about-us.jpg';

const AboutSection: React.FC = () => {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 animate-fade-in-up">
                    <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-gray-900">Who We <span className="text-green-700">Are</span></h2>
                    <div className="w-24 h-1.5 bg-green-500 mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
                    <div className="space-y-6 text-lg text-gray-600 leading-relaxed font-medium animate-fade-in-up delay-100">
                        <p>
                            <strong className="text-gray-900">The Justice Development and Social Cohesion Initiative (JUDSCI) Bauchi</strong> (also known as JDPC Bauchi) of the Catholic Diocese of Bauchi is mandated to promote justice, peace, and integral human development. Established as the policy-making body for the Diocese’s social programs, we operate under the direct authority of the Bishop.
                        </p>
                        <p>
                            Started in 2003 and registered with the <strong>CAC in 2016 (JUDSCI - No. 90258)</strong>, we work across the <strong>Bauchi Diocese</strong> which comprises both <strong>Bauchi and Gombe States</strong>. We reach all people irrespective of religion or ethnicity, focusing on the vulnerable.
                        </p>
                        <p>
                            Guided by Catholic Social Teachings, our interventions include WASH, Peace Building, Good Governance, Sustainable Agriculture, and <strong>Prison Apostolate</strong>.
                        </p>
                        <div className="flex gap-4 pt-4">
                            <div className="px-6 py-3 bg-green-50 rounded-xl border border-green-100">
                                <span className="block text-3xl font-bold text-green-700 mb-1">2003</span>
                                <span className="text-sm text-gray-500 font-bold uppercase tracking-wider">Established</span>
                            </div>
                            <div className="px-6 py-3 bg-blue-50 rounded-xl border border-blue-100">
                                <span className="block text-3xl font-bold text-blue-700 mb-1">35k+</span>
                                <span className="text-sm text-gray-500 font-bold uppercase tracking-wider">Households</span>
                            </div>
                        </div>
                    </div>
                    <div className="relative group rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-500 animate-fade-in-up delay-200 aspect-[3/4] md:aspect-[4/5]">
                        <div className="absolute inset-0 bg-green-900/0 group-hover:bg-green-900/10 transition-colors z-10"></div>
                        <img src={aboutUsImg} alt="JDPC Bauchi Team" className="w-full h-full object-cover object-center" />

                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 pt-24 z-20">
                            <h3 className="text-white font-bold text-xl leading-tight">JDPC Bauchi Team</h3>
                            <p className="text-green-300 text-sm font-medium mt-1">Promoting Justice, Peace and Development</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Vision */}
                    <div className="bg-gray-50 p-10 rounded-[2rem] hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100 group">
                        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                            👁️
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                        <p className="text-gray-600 leading-relaxed">
                            To build a just and peaceful society where unity, human dignity, and respect for life are upheld, and people are empowered with hope and joy in all creation.
                        </p>
                    </div>

                    {/* Mission */}
                    <div className="bg-green-700 p-10 rounded-[2rem] shadow-lg shadow-green-900/20 transform md:-translate-y-4 hover:translate-y-[-1.5rem] transition-all duration-300">
                        <div className="w-16 h-16 bg-white/20 text-white rounded-2xl flex items-center justify-center text-3xl mb-6 backdrop-blur-sm">
                            🚀
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
                        <p className="text-green-50 leading-relaxed font-medium">
                            We are a faith-based organization committed to promoting integral human development through capacity building, good governance, and collaboration that fosters social and religious tolerance.
                        </p>
                    </div>

                    {/* Core Values */}
                    <div className="bg-gray-50 p-10 rounded-[2rem] hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100 group">
                        <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                            💎
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Core Values</h3>
                        <ul className="space-y-3 text-gray-600">
                            {[
                                "Respect for human dignity",
                                "Unity & Peaceful Co-existence",
                                "Accountability & Transparency",
                                "Equality & Quality Services",
                                "Environmental Protection",
                                "Teamwork & Empowerment",
                                "Protection of Life",
                                "Education & Development"
                            ].map((value, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <span className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></span>
                                    <span>{value}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
