import React, { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '../config';
import { ImpactStat } from '../types';

const DEFAULT_STATS: ImpactStat[] = [
  { label: 'Households Reached', value: 35000, suffix: '+' },
  { label: 'Communities Served', value: 60, suffix: '' },
  { label: 'LGAs Covered', value: 8, suffix: '' },
  { label: 'Completed Projects', value: 10, suffix: '' },
];

const ImpactCounters: React.FC = () => {
  const [stats, setStats] = useState<ImpactStat[]>(DEFAULT_STATS);
  const [counts, setCounts] = useState<number[]>(DEFAULT_STATS.map(stat => stat.value));

  useEffect(() => {
    fetch(API_ENDPOINTS.STATS)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setStats(data);
          setCounts(data.map(stat => stat.value));
        }
      })
      .catch(err => {
        console.error("Failed to fetch impact stats, using defaults:", err);
      });
  }, []);

  useEffect(() => {
    if (stats.length === 0) return;

    const duration = 2000;
    const frameRate = 30;
    const totalFrames = duration / (1000 / frameRate);

    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const easeOutQuad = (t: number) => t * (2 - t);

      const newCounts = stats.map(stat => Math.floor(stat.value * easeOutQuad(progress)));
      setCounts(newCounts);

      if (frame >= totalFrames) {
        clearInterval(interval);
        setCounts(stats.map(stat => stat.value));
      }
    }, 1000 / frameRate);

    return () => clearInterval(interval);
  }, [stats]);

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {stats.map((stat, idx) => {
            const val = (counts[idx] !== undefined && counts[idx] > 0) ? counts[idx] : stat.value;
            return (
              <div key={idx} className="group text-center p-4 md:p-8 rounded-2xl md:rounded-[2rem] bg-white shadow-sm border border-gray-100 hover:shadow-2xl hover:border-green-100 transition-all duration-500 transform hover:-translate-y-2">
                <div className="text-3xl md:text-6xl font-black text-gray-900 mb-2 group-hover:text-green-700 transition-colors">
                  {val.toLocaleString()}{stat.suffix}
                </div>
                <div className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest md:tracking-[0.2em]">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ImpactCounters;
