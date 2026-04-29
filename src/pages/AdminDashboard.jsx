import { useEffect, useState } from 'react';
import { FiRefreshCw, FiMapPin, FiTrendingUp, FiZap, FiCheckCircle, FiClock, FiAlertCircle, FiX, FiArrowUp, FiPhone, FiSearch } from 'react-icons/fi';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Filler } from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getAnalytics, updateComplaintStatus, getProfiles } from '../services/dbService';
import { CATEGORY_COLORS, STATUS_COLORS, DEPARTMENTS } from '../data/mockData';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { useLanguage } from '../context/LanguageContext';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Filler);

const chartDefaults = {
  plugins: { legend: { labels: { color: '#94a3b8', font: { family: 'Inter', size: 12 } } } },
};

function MapPanControls() {
  const map = useMap();
  const pan = (dx, dy) => {
    map.panBy([dx, dy], { animate: true, duration: 0.25 });
  };
  return (
    <div className="absolute bottom-6 right-6 z-[1000] flex flex-col gap-1 items-center bg-slate-900/80 p-2 rounded-2xl border border-slate-700/50 backdrop-blur-sm shadow-xl">
      <button onClick={() => pan(0, -100)} className="w-8 h-8 flex items-center justify-center bg-slate-800 text-slate-300 rounded-lg hover:bg-civic-500 hover:text-white transition-colors" title="Pan Up">↑</button>
      <div className="flex gap-1">
        <button onClick={() => pan(-100, 0)} className="w-8 h-8 flex items-center justify-center bg-slate-800 text-slate-300 rounded-lg hover:bg-civic-500 hover:text-white transition-colors" title="Pan Left">←</button>
        <button onClick={() => pan(0, 100)} className="w-8 h-8 flex items-center justify-center bg-slate-800 text-slate-300 rounded-lg hover:bg-civic-500 hover:text-white transition-colors" title="Pan Down">↓</button>
        <button onClick={() => pan(100, 0)} className="w-8 h-8 flex items-center justify-center bg-slate-800 text-slate-300 rounded-lg hover:bg-civic-500 hover:text-white transition-colors" title="Pan Right">→</button>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub, color = 'civic' }) {
  const colors = {
    civic: 'from-civic-500/20 to-civic-600/10 border-civic-500/30 text-civic-400',
    green: 'from-green-500/20 to-green-600/10 border-green-500/30 text-green-400',
    yellow: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30 text-yellow-400',
    blue:   'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400',
  };
  return (
    <div className={`card bg-gradient-to-br ${colors[color]} border`}>
      <div className="flex items-start justify-between mb-3">
        <span className={`text-2xl ${colors[color].split(' ')[3]}`}>{icon}</span>
        <div className="text-right">
          <p className="text-3xl font-black text-white">{value}</p>
          {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
        </div>
      </div>
      <p className="text-slate-300 font-medium text-sm">{label}</p>
    </div>
  );
}

function AIInsightPanel({ complaints }) {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const generateSummary = () => {
    setLoading(true);
    setTimeout(() => {
      const cats = {};
      complaints.forEach(c => { cats[c.category] = (cats[c.category] || 0) + 1; });
      const topCat = Object.entries(cats).sort((a, b) => b[1] - a[1])[0];
      const pending = complaints.filter(c => c.status === 'Pending').length;
      const resolved = complaints.filter(c => c.status === 'Resolved').length;
      const rate = complaints.length ? Math.round((resolved / complaints.length) * 100) : 0;
      setSummary(
        `AI Analysis: ${complaints.length} total complaints recorded. ` +
        `Top issue category is "${topCat?.[0]}" with ${topCat?.[1]} reports. ` +
        `${pending} complaints are pending immediate attention. ` +
        `Resolution rate stands at ${rate}%. ` +
        `Recommend prioritising water and road issues in central zones based on upvote density.`
      );
      setLoading(false);
    }, 1200);
  };

  useEffect(() => { if (complaints.length > 0) generateSummary(); }, [complaints.length]);

  return (
    <div className="card bg-gradient-to-br from-civic-900/40 to-slate-900/40 border border-civic-500/20">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-civic-500/20 rounded-lg flex items-center justify-center">
            <FiZap size={15} className="text-civic-400" />
          </div>
          <span className="text-civic-400 font-semibold text-sm">AI Complaint Summary</span>
        </div>
        <button onClick={generateSummary} className="text-slate-400 hover:text-white transition-colors p-1" title="Refresh">
          <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>
      {loading ? (
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <div className="w-4 h-4 border-2 border-civic-500 border-t-transparent rounded-full animate-spin" />
          Generating AI summary...
        </div>
      ) : (
        <p className="text-slate-300 text-sm leading-relaxed">{summary || 'Click refresh to generate AI summary.'}</p>
      )}
    </div>
  );
}

function ComplaintDetailModal({ complaint, onClose, onStatusUpdate, updating }) {
  if (!complaint) return null;
  const dept = DEPARTMENTS[complaint.department] || DEPARTMENTS.Other;
  const cat = CATEGORY_COLORS[complaint.category] || CATEGORY_COLORS.Other;
  const st = STATUS_COLORS[complaint.status] || STATUS_COLORS.Pending;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="glass-dark rounded-2xl border border-civic-500/30 w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between p-6 border-b border-slate-700/50">
          <div><p className="text-civic-400 font-mono text-sm mb-1">{complaint.id}</p><h2 className="text-xl font-bold text-white">{complaint.title}</h2></div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1"><FiX size={20} /></button>
        </div>
        <div className="p-6 space-y-5">
          <div className="flex flex-wrap gap-2">
            <span className={`badge ${cat.badge}`}>{dept.icon} {complaint.category}</span>
            <span className={`badge ${st.badge}`}><span className={`w-1.5 h-1.5 rounded-full ${st.dot} inline-block`} />{complaint.status}</span>
            <span className="badge bg-slate-700/50 text-slate-300 border border-slate-600/50"><FiArrowUp size={11} /> {complaint.upvotes} upvotes</span>
          </div>
          <div><h4 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Full Description</h4><p className="text-slate-200 text-sm leading-relaxed bg-slate-800/50 rounded-xl p-4 border border-slate-700/30">{complaint.description}</p></div>
          {complaint.aiSummary && (<div className="bg-civic-900/30 border border-civic-500/20 rounded-xl p-4"><h4 className="text-civic-400 text-xs font-semibold uppercase tracking-wider mb-2">🤖 AI Summary</h4><p className="text-slate-300 text-sm">{complaint.aiSummary}</p>{complaint.confidence && (<div className="mt-3 flex items-center gap-3"><div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-civic-500 to-sky-500 rounded-full" style={{ width: `${complaint.confidence}%` }} /></div><span className="text-civic-400 font-mono text-sm font-bold">{complaint.confidence}%</span></div>)}</div>)}
          {complaint.location?.address && (<div><h4 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">📍 Location</h4><p className="text-slate-200 text-sm flex items-center gap-2"><FiMapPin className="text-civic-400" size={14} />{complaint.location.address}</p></div>)}
          <div><h4 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">🏛️ Department</h4><div className="flex items-center gap-3 bg-slate-800/50 rounded-xl p-3 border border-slate-700/30"><span className="text-2xl">{dept.icon}</span><div><p className="text-white font-semibold text-sm">{dept.name}</p><p className="text-slate-400 text-xs flex items-center gap-2 mt-0.5"><FiPhone size={10} /> {dept.phone} • {dept.email}</p></div></div></div>
          <div className="grid grid-cols-2 gap-4"><div><h4 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Created</h4><p className="text-slate-300 text-sm">{new Date(complaint.createdAt).toLocaleString('en-IN')}</p></div><div><h4 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Updated</h4><p className="text-slate-300 text-sm">{new Date(complaint.updatedAt).toLocaleString('en-IN')}</p></div></div>
          <div className="pt-2 border-t border-slate-700/50"><h4 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Update Status</h4><div className="flex gap-2">{['Pending', 'In Progress', 'Resolved'].map(s => (<button key={s} disabled={updating || complaint.status === s} onClick={() => onStatusUpdate(complaint.id, s)} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${complaint.status === s ? s === 'Resolved' ? 'bg-green-500/30 text-green-300 border border-green-500/40' : s === 'In Progress' ? 'bg-blue-500/30 text-blue-300 border border-blue-500/40' : 'bg-yellow-500/30 text-yellow-300 border border-yellow-500/40' : 'bg-slate-800/60 text-slate-400 border border-slate-700/50 hover:border-civic-500/40 hover:text-white'}`}>{s}</button>))}</div></div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { t } = useLanguage();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [updating, setUpdating] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [mapMode, setMapMode] = useState('night');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [profiles, setProfiles] = useState([]);

  const load = async () => {
    setLoading(true);
    const [data, profileData] = await Promise.all([getAnalytics(), getProfiles()]);
    setAnalytics(data);
    if (profileData) setProfiles(profileData);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleStatusUpdate = async (id, status) => {
    setUpdating(id);
    await updateComplaintStatus(id, status);
    toast.success(`Status updated to ${status}`);
    
    // Simulate Email Notification
    if (status === 'Resolved') {
      setTimeout(() => {
        toast.success('🎉 Resolution email sent to user!', {
          icon: '📧',
          duration: 4000,
        });
      }, 500);
    } else {
      setTimeout(() => {
        toast.success(`Notification: Status is now ${status}`, {
          icon: '📧',
        });
      }, 500);
    }

    await load();
    setUpdating(null);
  };

  if (loading) return (
    <div className="page-wrapper flex items-center justify-center">
      <LoadingSpinner text="Loading dashboard data..." size="lg" />
    </div>
  );

  const { byCategory, byStatus, byDay, total, complaints } = analytics;

  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = c.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         c.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = catFilter === 'All' || c.category === catFilter;
    return matchesSearch && matchesCat;
  });

  // Chart data
  const doughnutData = {
    labels: Object.keys(byCategory),
    datasets: [{
      data: Object.values(byCategory),
      backgroundColor: Object.keys(byCategory).map(k => CATEGORY_COLORS[k]?.hex + '99' || '#6366f1'),
      borderColor: Object.keys(byCategory).map(k => CATEGORY_COLORS[k]?.hex || '#6366f1'),
      borderWidth: 2,
    }],
  };

  const barData = {
    labels: Object.keys(byStatus),
    datasets: [{
      label: 'Complaints',
      data: Object.values(byStatus),
      backgroundColor: ['rgba(251,191,36,0.7)', 'rgba(59,130,246,0.7)', 'rgba(34,197,94,0.7)'],
      borderColor: ['rgb(251,191,36)', 'rgb(59,130,246)', 'rgb(34,197,94)'],
      borderWidth: 2,
      borderRadius: 8,
    }],
  };

  const lineLabels = Object.keys(byDay).slice(-7);
  const lineData = {
    labels: lineLabels,
    datasets: [{
      label: 'Issues Reported',
      data: lineLabels.map(d => byDay[d] || 0),
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99,102,241,0.1)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#6366f1',
      pointRadius: 4,
    }],
  };

  const chartOpts = (title) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      ...chartDefaults.plugins,
      legend: { ...chartDefaults.plugins.legend, display: false },
      tooltip: { backgroundColor: '#1e1b4b', titleColor: '#a5b4fc', bodyColor: '#cbd5e1', borderColor: '#4f46e5', borderWidth: 1 },
    },
    scales: {
      x: { ticks: { color: '#64748b', font: { family: 'Inter', size: 11 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
      y: { ticks: { color: '#64748b', font: { family: 'Inter', size: 11 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
    },
  });

  const resolved = byStatus['Resolved'] || 0;
  const pending = byStatus['Pending'] || 0;
  const inProgress = byStatus['In Progress'] || 0;
  const resolutionRate = total ? Math.round((resolved / total) * 100) : 0;

  return (
    <div className="page-wrapper">
      <div className="page-container max-w-[1600px] px-6 md:px-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in flex-wrap gap-4">
          <div>
            <h1 className="text-5xl font-black text-white tracking-tight">🏛️ {t('admin')}</h1>
            <p className="text-slate-400 mt-2 text-lg">{t('heroSub')}</p>
          </div>
          <button onClick={load} className="btn-secondary flex items-center gap-2 px-6 py-3">
            <FiRefreshCw size={16} /> Refresh Intelligence
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-slide-up">
          <StatCard icon={<FiAlertCircle />} label={t('reports')} value={total} sub="All time" color="civic" />
          <StatCard icon={<FiClock />} label={t('pending')} value={pending} sub="Needs attention" color="yellow" />
          <StatCard icon={<FiTrendingUp />} label={t('inprogress')} value={inProgress} sub="Being resolved" color="blue" />
          <StatCard icon={<FiCheckCircle />} label={t('resolved')} value={`${resolutionRate}%`} sub={`${resolved} of ${total}`} color="green" />
        </div>

        {/* AI Summary & Strategic Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 animate-slide-up">
          <div className="lg:col-span-2">
            <AIInsightPanel complaints={complaints} />
          </div>
          <div className="card bg-gradient-to-br from-blue-600/20 to-sky-500/10 border-blue-500/30">
            <div className="flex items-center gap-2 mb-3">
              <FiZap className="text-blue-400" />
              <span className="text-white font-bold text-sm uppercase tracking-widest">AI Strategic Forecast</span>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-xs">Risk Level</span>
                <span className="text-green-400 text-xs font-bold px-2 py-0.5 bg-green-500/10 rounded-full">Low</span>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                Analysis suggests a <span className="text-white font-bold">15% increase</span> in water-related reports next week. Recommend pre-emptive maintenance in Zone 4.
              </p>
              <div className="pt-3 border-t border-slate-700/50">
                <p className="text-blue-400 text-[10px] font-black uppercase mb-2">Budget Recommendation</p>
                <p className="text-white text-xs font-medium italic">"Shift 5% of Road maintenance fund to Emergency Water Supply."</p>
              </div>
            </div>
          </div>
        </div>

        {/* Map + Doughnut */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Map */}
          <div className="lg:col-span-2 card p-0 overflow-hidden animate-fade-in">
            <div className="p-4 border-b border-slate-700/50 flex items-center justify-between flex-wrap gap-3">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <FiMapPin className="text-civic-400" /> Issue Heatmap
                <span className="text-xs text-slate-500 font-normal ml-1">– Real-time locations</span>
              </h3>
              {/* Map Mode Switcher */}
              <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
                {[
                  { key: 'normal', label: '☀️ Normal', icon: '☀️' },
                  { key: 'night', label: '🌙 Night', icon: '🌙' },
                  { key: 'satellite', label: '🛰️ Satellite', icon: '🛰️' },
                ].map(mode => (
                  <button
                    key={mode.key}
                    onClick={() => setMapMode(mode.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                      mapMode === mode.key
                        ? mode.key === 'night' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                        : mode.key === 'satellite' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                        : 'bg-civic-600 text-white shadow-lg shadow-civic-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>
            <div 
              id={mapMode === 'normal' ? 'map-light-mode' : undefined}
              style={{ height: '600px' }} 
              className="rounded-3xl overflow-hidden border-4 border-slate-800 shadow-2xl relative"
              onMouseMove={(e) => {
                if (mapMode === 'normal') {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                }
              }}
            >
              {mapMode === 'normal' && (
                <>
                  <style>{`
                    #map-light-mode, #map-light-mode * {
                      cursor: none !important;
                    }
                  `}</style>
                  <div 
                    className="absolute pointer-events-none z-[2000] w-5 h-5 bg-black border-2 border-white rounded-full -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                    style={{ left: mousePos.x, top: mousePos.y }}
                  >
                    <div className="w-1 h-1 bg-white rounded-full" />
                  </div>
                </>
              )}
              {/* Mode indicator badge */}
              <div className={`absolute top-4 right-4 z-[1000] glass px-4 py-2 rounded-xl border font-bold text-xs animate-pulse ${
                mapMode === 'night' ? 'border-indigo-500/30 text-indigo-300' :
                mapMode === 'satellite' ? 'border-emerald-500/30 text-emerald-300' :
                'border-amber-500/30 text-amber-300'
              }`}>
                {mapMode === 'night' ? '🌙 NIGHT MODE' : mapMode === 'satellite' ? '🛰️ SATELLITE VIEW' : '☀️ NORMAL MODE'}
              </div>
              <MapContainer
                center={[22.5, 82]}
                zoom={4.5}
                style={{ height: '100%', width: '100%' }}
                zoomControl={true}
                key={mapMode}
              >
                <TileLayer
                  url={
                    mapMode === 'night'
                      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                      : mapMode === 'satellite'
                      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
                  }
                  attribution={
                    mapMode === 'satellite'
                      ? '&copy; Esri, Maxar, Earthstar Geographics'
                      : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                  }
                />
                <MapPanControls />
                {complaints.map(c => c.location?.lat && (
                  <CircleMarker
                    key={c.id}
                    center={[c.location.lat, c.location.lng]}
                    radius={Math.min(8 + c.upvotes / 10, 22)}
                    fillColor={CATEGORY_COLORS[c.category]?.hex || '#6366f1'}
                    color={mapMode === 'satellite' ? '#ffffff' : (CATEGORY_COLORS[c.category]?.hex || '#6366f1')}
                    weight={mapMode === 'satellite' ? 3 : 2}
                    opacity={0.9}
                    fillOpacity={mapMode === 'satellite' ? 0.7 : 0.5}
                  >
                    <Popup>
                      <div className="text-sm">
                        <p className="font-bold text-civic-300">{c.id}</p>
                        <p className="font-semibold mt-1">{c.title}</p>
                        <p className="text-slate-400 mt-1">{c.aiSummary}</p>
                        <div className="flex gap-2 mt-2">
                          <span className="text-xs">{c.category}</span>
                          <span className="text-xs">• {c.status}</span>
                        </div>
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}
              </MapContainer>
            </div>
            {/* Map legend */}
            <div className="p-3 border-t border-slate-700/50 flex flex-wrap gap-3">
              {Object.entries(CATEGORY_COLORS).map(([cat, cfg]) => (
                <div key={cat} className="flex items-center gap-1.5 text-xs text-slate-400">
                  <span className="w-3 h-3 rounded-full" style={{ background: cfg.hex }} />
                  {cat}
                </div>
              ))}
              <span className="text-xs text-slate-500 ml-auto">Bubble size = upvotes</span>
            </div>
          </div>

        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-6">
          {/* Doughnut - Enlarged */}
          <div className="card animate-fade-in bg-slate-900/60 border-civic-500/20">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-3xl font-black text-white flex items-center gap-3">
                <FiTrendingUp className="text-civic-400" /> Issues by Category
              </h3>
              <div className="text-right">
                <p className="text-4xl font-black text-civic-400">{total}</p>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Total Classified</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div style={{ height: '400px' }} className="relative">
                <Doughnut data={doughnutData} options={{
                  responsive: true, maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'right', labels: { color: '#94a3b8', boxWidth: 15, padding: 20, font: { family: 'Inter', size: 14, weight: 'bold' } } },
                    tooltip: { backgroundColor: '#1e1b4b', titleColor: '#a5b4fc', bodyColor: '#cbd5e1', borderColor: '#4f46e5', borderWidth: 1, padding: 12 },
                  },
                  cutout: '70%',
                }} />
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-5xl font-black text-white">{total}</span>
                  <span className="text-slate-500 text-sm font-bold uppercase">Reports</span>
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-slate-400 text-lg font-medium leading-relaxed italic">
                  "Strategic analysis indicates that <span className="text-white font-bold">{Object.keys(byCategory)[0]}</span> remains the highest priority sector, accounting for <span className="text-civic-400 font-black">{Math.round((byCategory[Object.keys(byCategory)[0]]/total)*100)}%</span> of all citizen reports."
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(byCategory).map(([cat, count]) => (
                    <div key={cat} className="glass-dark p-4 rounded-2xl border border-slate-700/50 hover:border-civic-500/40 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <span className="w-3 h-3 rounded-full" style={{ background: CATEGORY_COLORS[cat]?.hex }} />
                        <span className="text-xl font-black text-white">{count}</span>
                      </div>
                      <p className="text-slate-400 text-sm font-bold uppercase tracking-tighter">{cat}</p>
                      <div className="mt-3 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${(count/total)*100}%`, background: CATEGORY_COLORS[cat]?.hex }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bar + Line */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="card animate-fade-in">
            <h3 className="text-white font-semibold mb-4">Status Distribution</h3>
            <div style={{ height: '200px' }}>
              <Bar data={barData} options={chartOpts('Status')} />
            </div>
          </div>
          <div className="card animate-fade-in">
            <h3 className="text-white font-semibold mb-4">Reports Over Time (Last 7 days)</h3>
            <div style={{ height: '200px' }}>
              <Line data={lineData} options={chartOpts('Trend')} />
            </div>
          </div>
        </div>

        {/* Complaints Table */}
        <div className="card animate-fade-in">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div>
              <h3 className="text-white font-semibold">{t('reports')}</h3>
              <p className="text-slate-500 text-xs mt-0.5">{t('all')}</p>
            </div>
            
            <div className="flex items-center gap-3 flex-1 max-w-2xl">
              <div className="relative flex-1">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="text" 
                  placeholder={t('search')} 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10 py-2 text-sm w-full"
                />
              </div>
              <select 
                className="input py-2 text-sm max-w-[150px]"
                value={catFilter}
                onChange={(e) => setCatFilter(e.target.value)}
              >
                <option value="All">{t('all')}</option>
                {Object.keys(CATEGORY_COLORS).map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <span className="text-slate-400 text-sm">{filteredComplaints.length} {t('reports')}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700/50">
                  {['ID', 'Title', 'Category', 'Status', 'Upvotes', 'AI Summary', 'Actions'].map(h => (
                    <th key={h} className="text-left text-slate-400 font-medium pb-3 pr-4 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.map((c) => (
                  <tr key={c.id} className="border-b border-slate-800/50 hover:bg-civic-500/5 transition-colors cursor-pointer" onClick={() => setSelectedComplaint(c)}>
                    <td className="py-3 pr-4 font-mono text-civic-400 text-xs whitespace-nowrap">{c.id}</td>
                    <td className="py-3 pr-4 text-slate-200 max-w-[160px] truncate">{c.title}</td>
                    <td className="py-3 pr-4">
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: CATEGORY_COLORS[c.category]?.hex + '33', color: CATEGORY_COLORS[c.category]?.hex }}>
                        {c.category}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`badge text-xs ${STATUS_COLORS[c.status]?.badge || 'badge-pending'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${STATUS_COLORS[c.status]?.dot} inline-block`} />
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-slate-400 text-xs">{c.upvotes}</td>
                    <td className="py-3 pr-4 text-slate-400 text-xs max-w-[200px] truncate">{c.aiSummary}</td>
                    <td className="py-3" onClick={e => e.stopPropagation()}>
                      <select
                        value={c.status}
                        onChange={(e) => handleStatusUpdate(c.id, e.target.value)}
                        disabled={updating === c.id}
                        className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-civic-500 cursor-pointer"
                      >
                        <option>Pending</option>
                        <option>In Progress</option>
                        <option>Resolved</option>
                        <option>Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Registered Citizens Table */}
        <div className="card animate-fade-in mt-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-white font-semibold">Registered Citizens</h3>
              <p className="text-slate-500 text-xs mt-0.5">Signups captured in the profiles table</p>
            </div>
            <span className="text-slate-400 text-sm">{profiles.length} Users</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="text-left text-slate-400 font-medium pb-3 pr-4 whitespace-nowrap">User ID</th>
                  <th className="text-left text-slate-400 font-medium pb-3 pr-4 whitespace-nowrap">Email Address</th>
                  <th className="text-left text-slate-400 font-medium pb-3 pr-4 whitespace-nowrap">Joined Date</th>
                </tr>
              </thead>
              <tbody>
                {profiles.length > 0 ? (
                  profiles.map((p) => (
                    <tr key={p.id} className="border-b border-slate-800/50 hover:bg-civic-500/5 transition-colors">
                      <td className="py-3 pr-4 font-mono text-civic-400 text-xs whitespace-nowrap">{p.id.split('-')[0]}...</td>
                      <td className="py-3 pr-4 text-slate-200">{p.email}</td>
                      <td className="py-3 pr-4 text-slate-400 text-xs">{new Date(p.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="py-6 text-center text-slate-500 text-sm">
                      No users found. Ensure your API key is correct and signups are happening.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {selectedComplaint && <ComplaintDetailModal complaint={selectedComplaint} onClose={() => setSelectedComplaint(null)} onStatusUpdate={handleStatusUpdate} updating={updating} />}
      </div>
    </div>
  );
}
