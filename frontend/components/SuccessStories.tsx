import React, { useState } from 'react';

const STORIES = [
  {
    problem: "In Rijin Gani community of Bauchi State, women and children relied on unsafe surface water, leading to frequent waterborne diseases and long hours spent fetching water.",
    intervention: "JDPC Bauchi facilitated community consultations, supported the construction of 2 VIP Latrines and a borehole, and trained a WASHCOM to manage maintenance.",
    result: "Over 350 households gained reliable access to safe drinking water. Cases of water-related illnesses reduced. Women saved time for farming.",
    quote: "“Before, our children were always sick. Now we drink clean water, and we are not afraid anymore.”",
    author: "Community Woman Leader",
  },
  {
    problem: "Open defecation and poor hygiene practices were common, contributing to disease outbreaks and environmental degradation.",
    intervention: "JDPC supported construction of VIP latrines, conducted hygiene promotion sessions, and promoted behavior change using participatory methods.",
    result: "Households adopted improved sanitation, increased hand-washing, and safer waste disposal with stronger community ownership.",
    quote: "“We now understand that sanitation is everyone’s responsibility. Our environment is cleaner, and our children are healthier.”",
    author: "Youth Leader",
  },
  {
    problem: "Some communities faced low trust, weak collaboration, and lingering tensions that affected collective development efforts.",
    intervention: "JDPC facilitated inclusive dialogue sessions, strengthened interfaith structures, and integrated peace principles into WASH activities.",
    result: "Improved cooperation among leaders, joint decision-making, and renewed trust between communities and partners.",
    quote: "“JDPC did not just bring projects; they brought us together and listened to us.”",
    author: "Chief Imam",
  }
];

const SuccessStories: React.FC = () => {
  const [active, setActive] = useState(0);

  return (
    <section className="py-20 bg-green-900 text-white relative overflow-hidden">
      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-6">Success <span className="text-green-300">Stories</span></h2>
          <div className="w-24 h-1.5 bg-green-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
             {STORIES.map((story, idx) => (
                <button
                  key={idx}
                  onClick={() => setActive(idx)}
                  className={`text-left w-full p-6 rounded-2xl transition-all duration-300 border border-green-700 ${
                    active === idx ? 'bg-white/10 shadow-lg scale-105 border-green-500' : 'hover:bg-green-800'
                  }`}
                >
                  <h4 className="text-xl font-bold mb-2 text-green-100 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-sm text-white">
                      {idx + 1}
                    </span>
                    Story from the Field
                  </h4>
                  <p className={`text-green-200 line-clamp-2 ${active === idx ? 'opacity-100' : 'opacity-60'}`}>
                    {story.problem}
                  </p>
                </button>
             ))}
          </div>

          <div className="bg-white text-gray-900 p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative animate-in fade-in slide-in-from-right-8 duration-500 key={active}">
             <div className="absolute -top-6 -right-6 text-9xl text-green-100 font-serif leading-none">”</div>
             
             <div className="space-y-6">
                <div>
                  <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">The Problem</h5>
                  <p className="text-gray-600">{STORIES[active].problem}</p>
                </div>
                <div>
                  <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">The Intervention</h5>
                  <p className="text-gray-600">{STORIES[active].intervention}</p>
                </div>
                <div>
                   <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">The Result</h5>
                   <p className="text-gray-600 font-medium">{STORIES[active].result}</p>
                </div>

                <div className="pt-6 border-t border-gray-100">
                   <p className="text-xl md:text-2xl font-serif italic text-gray-800 mb-4">
                     {STORIES[active].quote}
                   </p>
                   <p className="text-green-600 font-bold">— {STORIES[active].author}</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;
