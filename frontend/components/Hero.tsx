
import React from 'react';

interface HeroProps {
  onExplore: () => void;
  onDonate: () => void;
}

const Hero: React.FC<HeroProps> = ({ onExplore, onDonate }) => {
  return (
    <section className="relative min-h-[70vh] md:h-[80vh] flex items-center overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://picsum.photos/id/11/1920/1080"
          className="w-full h-full object-cover filter brightness-[0.4]"
          alt="JDPC Bauchi - Promoting Justice and Peace in Bauchi State, Nigeria"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/60 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-4xl">
          <div className="inline-block mb-4 px-6 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-green-300 font-bold tracking-widest uppercase text-sm animate-fade-in-up">
            Justice Development and Peace Committee
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 md:mb-8 tracking-tight leading-tight lg:leading-none drop-shadow-lg animate-fade-in-up delay-100">
            Building a <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">Just</span> & <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">Peaceful</span> Society
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 font-light loading-relaxed max-w-2xl animate-fade-in-up delay-200">
            To facilitate the building of a just, peaceful and stable society through the promotion of the Gospel values of Justice, Peace, and Love.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-300">
            <button
              onClick={onExplore}
              className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-full transition-all transform hover:scale-105 hover:shadow-green-500/30 shadow-lg"
            >
              Explore Our Impact
            </button>
            <button
              onClick={onDonate}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold rounded-full border border-white/30 transition-all hover:border-white"
            >
              Donate Now
            </button>
          </div>
        </div>
      </div>

      {/* Stats preview floating at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-950/80 to-transparent"></div>
    </section>
  );
};

export default Hero;
