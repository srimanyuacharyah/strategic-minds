import { useEffect, useRef, useState } from 'react';

export default function StatsCounter({ value, label, icon, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 1500;
        const steps = 50;
        const increment = value / steps;
        let current = 0;
        const timer = setInterval(() => {
          current += increment;
          if (current >= value) { setCount(value); clearInterval(timer); }
          else setCount(Math.floor(current));
        }, duration / steps);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="stat-card text-center p-8 border-civic-500/20 bg-slate-900/50 group hover:scale-105 transition-transform duration-500">
      <div className="text-5xl mb-4 group-hover:animate-bounce">{icon}</div>
      <div className="text-6xl md:text-7xl font-black text-white glow-text mb-2">
        {count}{suffix}
      </div>
      <div className="text-slate-400 text-lg font-bold uppercase tracking-widest">{label}</div>
    </div>
  );
}
