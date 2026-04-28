import { Link } from 'react-router-dom';
import { FiArrowRight, FiShield, FiMapPin, FiZap, FiBarChart2, FiUsers } from 'react-icons/fi';

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-civic-600/20 to-transparent blur-[120px] pointer-events-none" />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-civic-500/30 mb-8 animate-fade-in">
            <span className="w-2 h-2 bg-civic-400 rounded-full animate-pulse" />
            <span className="text-civic-300 text-sm font-semibold">Transforming Civic Engagement</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight animate-slide-up">
            The Smart Bridge Between <br />
            <span className="gradient-text glow-text">Citizens & Government</span>
          </h1>
          
          <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '100ms' }}>
            Empowering communities with AI-driven reporting, real-time tracking, and automated routing. 
            Report issues, track progress, and build a better city together.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <Link to="/signup" className="btn-primary w-full sm:w-auto px-8 py-4 text-lg flex items-center justify-center gap-2 group">
              Join CivicAI <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/home" className="btn-secondary w-full sm:w-auto px-8 py-4 text-lg">
              Explore Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Smart Bridge Visualization */}
      <section className="relative py-24 overflow-hidden bg-slate-900/50 border-y border-civic-500/10">
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
            {/* Citizen Side */}
            <div className="flex flex-col items-center gap-4 group">
              <div className="relative">
                <div className="absolute -inset-4 bg-civic-500/20 rounded-full blur-xl group-hover:bg-civic-500/40 transition-all duration-500" />
                <div className="relative w-24 h-24 bg-slate-800 rounded-3xl flex items-center justify-center border border-civic-500/30 shadow-glow">
                  <FiUsers size={40} className="text-civic-400" />
                </div>
              </div>
              <p className="text-white font-bold tracking-widest uppercase text-xs">Citizens</p>
            </div>

            {/* The Bridge (Flow) */}
            <div className="flex-1 w-full h-32 relative hidden md:block">
              {/* Bridge Line */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-civic-500/20 via-civic-400 to-sky-500/20 rounded-full" />
              
              {/* Flowing Elements */}
              {[
                { icon: '🚗', label: 'Roads', delay: '0s' },
                { icon: '💧', label: 'Water', delay: '1.5s' },
                { icon: '⚡', label: 'Power', delay: '3s' },
                { icon: '♻️', label: 'Waste', delay: '4.5s' }
              ].map((item, i) => (
                <div key={i} className="absolute top-1/2 -translate-y-1/2 animate-bridge" style={{ animationDelay: item.delay }}>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center border border-civic-400/50 shadow-lg">
                      <span className="text-xl">{item.icon}</span>
                    </div>
                    <span className="text-[10px] text-civic-400 font-bold uppercase tracking-tighter">{item.label}</span>
                  </div>
                </div>
              ))}
              
              {/* Pulse Signal */}
              <div className="absolute top-1/2 left-0 w-4 h-4 bg-civic-400 rounded-full -translate-y-1/2 blur-sm animate-ping" />
            </div>

            {/* Government Side */}
            <div className="flex flex-col items-center gap-4 group">
              <div className="relative">
                <div className="absolute -inset-4 bg-sky-500/20 rounded-full blur-xl group-hover:bg-sky-500/40 transition-all duration-500" />
                <div className="relative w-24 h-24 bg-slate-800 rounded-3xl flex items-center justify-center border border-sky-500/30 shadow-glow">
                  <FiShield size={40} className="text-sky-400" />
                </div>
              </div>
              <p className="text-white font-bold tracking-widest uppercase text-xs">Government</p>
            </div>
          </div>

          {/* Central Orbiting Services (Mobile view/Accent) */}
          <div className="mt-16 text-center">
            <h2 className="text-3xl font-black text-white mb-12">Seamless Civic Intelligence</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {[
                { icon: <FiZap />, label: 'AI Routing' },
                { icon: <FiMapPin />, label: 'GIS Mapping' },
                { icon: <FiBarChart2 />, label: 'Analytics' },
                { icon: <FiUsers />, label: 'Community' },
                { icon: <FiShield />, label: 'Accountability' },
                { icon: <FiArrowRight />, label: 'Feedback' },
              ].map((service, i) => (
                <div key={i} className="card bg-slate-900/50 border-slate-800 hover:border-civic-500/30 transition-all group animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="w-10 h-10 bg-civic-500/10 rounded-xl flex items-center justify-center text-civic-400 mb-4 group-hover:scale-110 transition-transform mx-auto">
                    {service.icon}
                  </div>
                  <p className="text-slate-300 font-bold text-xs uppercase tracking-widest">{service.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<FiZap className="text-civic-400" />}
              title="AI Classification"
              description="Our advanced AI automatically categorizes reports into water, waste, roads, and more with 95% accuracy."
            />
            <FeatureCard 
              icon={<FiMapPin className="text-sky-400" />}
              title="Smart Geolocation"
              description="Precise issue tracking with interactive heatmaps, helping officials prioritize high-impact zones."
            />
            <FeatureCard 
              icon={<FiShield className="text-accent-400" />}
              title="Verified Governance"
              description="Transparent tracking from submission to resolution, ensuring accountability at every step."
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto card bg-gradient-to-r from-civic-900/40 to-slate-900/40 border border-civic-500/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StatItem label="Active Users" value="12k+" />
            <StatItem label="Issues Resolved" value="8,400+" />
            <StatItem label="Avg Response" value="2.4h" />
            <StatItem label="Departments" value="15+" />
          </div>
        </div>
      </section>

      {/* Footer-like CTA */}
      <section className="py-32 px-4 text-center">
        <h2 className="text-4xl font-bold text-white mb-8">Ready to make an impact?</h2>
        <Link to="/report" className="btn-primary px-10 py-5 text-xl font-bold rounded-2xl shadow-glow transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-3">
          Report Your First Issue <FiArrowRight />
        </Link>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="card hover:border-civic-500/40 transition-all duration-300 group">
      <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function StatItem({ label, value }) {
  return (
    <div>
      <p className="text-3xl md:text-4xl font-black text-white mb-1">{value}</p>
      <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">{label}</p>
    </div>
  );
}
