import React from 'react';

interface HeroProps {
  onExplore: () => void;
  onDonate: () => void;
}

const Hero: React.FC<HeroProps> = ({ onExplore, onDonate }) => {
  return (
    <section className="relative min-h-[calc(100vh-5rem)] md:min-h-[75vh] lg:h-[82vh] flex items-center overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/peace-building.jpg"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/wash.jpg';
          }}
          className="w-full h-full object-cover filter brightness-[0.38]"
          alt="JDPC Bauchi - Promoting Justice and Peace in Bauchi State, Nigeria"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-green-950/80 via-black/40 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white w-full py-10 sm:py-16 md:py-20 flex flex-col justify-center">
        <div className="max-w-3xl">
          {/* Responsive Sleek Badge */}
          <div className="inline-block mb-3 sm:mb-4 px-3.5 py-1.5 sm:px-5 sm:py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-green-300 font-bold tracking-wider uppercase text-[10px] sm:text-xs md:text-sm animate-fade-in-up">
            Justice Development & Social Cohesion Initiative
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-3 sm:mb-6 tracking-tight leading-[1.15] drop-shadow-md animate-fade-in-up delay-100">
            Building a <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">Just</span> & <br className="inline sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">Peaceful</span> Society
          </h1>

          {/* Mission Subtitle */}
          <p className="text-sm sm:text-lg md:text-xl text-gray-200 mb-6 sm:mb-8 font-normal leading-relaxed max-w-2xl animate-fade-in-up delay-200">
            Facilitating a just, peaceful and stable society across the <strong>Bauchi Diocese</strong> (Bauchi and Gombe States) through the Gospel values of Justice, Peace, and Integral Human Development.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-in-up delay-300 max-w-md sm:max-w-none">
            <button
              onClick={onExplore}
              className="w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-4 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold text-sm sm:text-base rounded-full transition-all transform hover:scale-[1.02] shadow-lg shadow-green-900/30 text-center"
            >
              Explore Our Impact
            </button>
            <button
              onClick={onDonate}
              className="w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-4 bg-white/10 hover:bg-white/20 active:bg-white/30 backdrop-blur-md text-white font-bold text-sm sm:text-base rounded-full border border-white/30 transition-all hover:border-white text-center"
            >
              Donate Now
            </button>
          </div>
        </div>
      </div>

      {/* Stats preview gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-24 bg-gradient-to-t from-gray-950/80 to-transparent pointer-events-none"></div>
    </section>
  );
};

export default Hero;
