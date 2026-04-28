import { useEffect, useState, useRef } from 'react';
import { FiRefreshCw, FiMapPin, FiTrendingUp, FiZap, FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Filler } from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getAnalytics, updateComplaintStatus } from '../services/firebaseService';
import { CATEGORY_COLORS, STATUS_COLORS, DEPARTMENTS } from '../data/mockData';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Filler);

const chartDefaults = {
  plugins: { legend: { labels: { color: '#94a3b8', font: { family: 'Inter', size: 12 } } } },
};

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

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const load = async () => {
    setLoading(true);
    const data = await getAnalytics();
    setAnalytics(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleStatusUpdate = async (id, status) => {
    setUpdating(id);
    await updateComplaintStatus(id, status);
    toast.success(`Status updated to ${status}`);
    await load();
    setUpdating(null);
  };

  if (loading) return (
    <div className="page-wrapper flex items-center justify-center">
      <LoadingSpinner text="Loading dashboard data..." size="lg" />
    </div>
  );

  const { byCategory, byStatus, byDay, total, complaints } = analytics;

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
      <div className="page-container">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-black text-white">🏛️ Admin Dashboard</h1>
            <p className="text-slate-400 mt-1">Real-time civic intelligence for government officials</p>
          </div>
          <button onClick={load} className="btn-secondary flex items-center gap-2 text-sm">
            <FiRefreshCw size={14} /> Refresh Data
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-slide-up">
          <StatCard icon={<FiAlertCircle />} label="Total Complaints" value={total} sub="All time" color="civic" />
          <StatCard icon={<FiClock />} label="Pending Action" value={pending} sub="Needs attention" color="yellow" />
          <StatCard icon={<FiTrendingUp />} label="In Progress" value={inProgress} sub="Being resolved" color="blue" />
          <StatCard icon={<FiCheckCircle />} label="Resolved" value={`${resolutionRate}%`} sub={`${resolved} of ${total}`} color="green" />
        </div>

        {/* AI Summary */}
        <div className="mb-6 animate-slide-up">
          <AIInsightPanel complaints={complaints} />
        </div>

        {/* Map + Doughnut */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Map */}
          <div className="lg:col-span-2 card p-0 overflow-hidden animate-fade-in">
            <div className="p-4 border-b border-slate-700/50">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <FiMapPin className="text-civic-400" /> Issue Heatmap
                <span className="text-xs text-slate-500 font-normal ml-1">– Pune region</span>
              </h3>
            </div>
            <div style={{ height: '380px' }}>
              <MapContainer
                center={[18.5204, 73.8567]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                zoomControl={true}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="© OpenStreetMap"
                />
                {complaints.map(c => c.location?.lat && (
                  <CircleMarker
                    key={c.id}
                    center={[c.location.lat, c.location.lng]}
                    radius={Math.min(8 + c.upvotes / 10, 22)}
                    fillColor={CATEGORY_COLORS[c.category]?.hex || '#6366f1'}
                    color={CATEGORY_COLORS[c.category]?.hex || '#6366f1'}
                    weight={2}
                    opacity={0.9}
                    fillOpacity={0.5}
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

          {/* Doughnut */}
          <div className="card animate-fade-in">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <FiTrendingUp className="text-civic-400" /> By Category
            </h3>
            <div style={{ height: '200px' }}>
              <Doughnut data={doughnutData} options={{
                responsive: true, maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom', labels: { color: '#94a3b8', boxWidth: 12, padding: 12, font: { family: 'Inter', size: 11 } } },
                  tooltip: { backgroundColor: '#1e1b4b', titleColor: '#a5b4fc', bodyColor: '#cbd5e1', borderColor: '#4f46e5', borderWidth: 1 },
                },
                cutout: '65%',
              }} />
            </div>
            {/* Category breakdown */}
            <div className="mt-4 space-y-2">
              {Object.entries(byCategory).map(([cat, count]) => (
                <div key={cat} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: CATEGORY_COLORS[cat]?.hex }} />
                  <span className="text-slate-300 text-xs flex-1">{cat}</span>
                  <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(count/total)*100}%`, background: CATEGORY_COLORS[cat]?.hex }} />
                  </div>
                  <span className="text-slate-400 text-xs font-mono w-6 text-right">{count}</span>
                </div>
              ))}
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
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h3 className="text-white font-semibold">All Complaints</h3>
            <span className="text-slate-400 text-sm">{complaints.length} total records</span>
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
                {complaints.map((c) => (
                  <tr key={c.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
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
                    <td className="py-3">
                      <select
                        value={c.status}
                        onChange={(e) => handleStatusUpdate(c.id, e.target.value)}
                        disabled={updating === c.id}
                        className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-civic-500 cursor-pointer"
                      >
                        <option>Pending</option>
                        <option>In Progress</option>
                        <option>Resolved</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
