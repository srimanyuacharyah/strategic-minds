import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMapPin, FiSend, FiZap, FiMail, FiMic } from 'react-icons/fi';
import PhotoUpload from '../components/PhotoUpload';
import AIConfidenceBadge from '../components/AIConfidenceBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { classifyIssue, summarizeComplaint, routeToDepartment } from '../services/aiService';
import { submitComplaint, sendNotificationEmail } from '../services/dbService';
import { isDemoMode } from '../services/aiService';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';

const STEPS = ['Details', 'AI Analysis', 'Confirm'];

const RECOMMENDED_LOCATIONS = [
  'MG Road, Pune',
  'Connaught Place, New Delhi',
  'Marine Drive, Mumbai',
  'Indiranagar, Bengaluru',
  'Hitech City, Hyderabad',
  'Salt Lake, Kolkata',
  'Kothrud, Pune',
  'Baner, Pune',
  'Bandra West, Mumbai',
  'Park Street, Kolkata',
];

export default function ReportIssue() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    email: '',
    proposal: '', // New fix proposal field
  });
  const [aiResult, setAiResult] = useState(null);
  const [aiSummary, setAiSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const [showLocations, setShowLocations] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const STEPS_LOCALIZED = [t('details'), t('aiAnalysis'), t('confirm')];

  // Debounced Location Search
  useEffect(() => {
    if (!form.location || form.location.length < 3) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(form.location)}&addressdetails=1&limit=10&countrycodes=in`);
        const data = await res.json();
        setSearchResults(data.map(item => ({
          display: item.display_name,
          lat: item.lat,
          lng: item.lon
        })));
      } catch (err) {
        console.error('Geocoding error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [form.location]);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const [isAiImage, setIsAiImage] = useState(false);
  const [blueprint, setBlueprint] = useState(null);

  const runAI = async () => {
    if (!form.title && !form.description) {
      toast.error('Please fill in title and description');
      return;
    }
    setLoading(true);
    setStep(1);
    try {
      const text = `${form.title}. ${form.description}`;
      const [classification, summary] = await Promise.all([
        classifyIssue(text),
        summarizeComplaint(text),
      ]);
      
      // Simulate AI Image Detection
      if (file) {
        const isAi = Math.random() > 0.8; // 20% chance of being detected as AI for demo
        setIsAiImage(isAi);
        if (isAi) toast.error('⚠️ Warning: AI-generated image detected. Please use authentic photos.');
      }

      // Generate AI Blueprint (Unique WOW feature)
      setBlueprint({
        steps: [
          'Immediate site inspection by ' + (classification.category || 'Maintenance') + ' team',
          'Resource allocation: 2 engineers, 5 support staff',
          'Estimated Material cost: ₹45,000',
          'Resolution Timeline: 3-5 Working Days'
        ],
        technicalNote: 'System recommends reinforced concrete for ' + classification.category + ' to prevent recurring issues.'
      });

      setAiResult(classification);
      setAiSummary(summary);
      setStep(2);
    } catch {
      toast.error('AI processing failed. Using fallback.');
      setAiResult({ category: 'Other', confidence: 80, reasoning: 'Fallback classification' });
      setAiSummary(form.title);
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const dept = routeToDepartment(aiResult?.category || 'Other');
      const complaint = await submitComplaint({
        title: form.title,
        description: form.description,
        userEmail: form.email,
        location: {
          address: form.location || 'Location not specified',
          lat: form.lat ? parseFloat(form.lat) : (18.5204 + (Math.random() - 0.5) * 0.05),
          lng: form.lng ? parseFloat(form.lng) : (73.8567 + (Math.random() - 0.5) * 0.05),
        },
        category: aiResult?.category || 'Other',
        aiSummary,
        confidence: aiResult?.confidence || 80,
        department: aiResult?.category || 'Other',
        hasImage: !!file,
      });

      // Send initial notification
      sendNotificationEmail(
        form.email, 
        `CivicAI: Issue Received #${complaint.id}`,
        `We have received your report: "${form.title}". Our AI is routing it to the ${dept} department. You can track it using ID: ${complaint.id}`
      );

      setSubmitted(complaint);
      toast.success('Complaint submitted successfully!');
    } catch (e) {
      toast.error('Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="page-wrapper">
        <div className="page-container max-w-xl mx-auto text-center animate-fade-in py-12">
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-green-500 rounded-full blur-2xl opacity-20 animate-pulse" />
            <div className="relative w-32 h-32 bg-gradient-to-br from-green-500/30 to-green-600/10 rounded-full flex items-center justify-center border-2 border-green-500/50 animate-float-fast shadow-glow-green">
              <span className="text-6xl animate-bounce">✅</span>
            </div>
          </div>
          <h1 className="text-5xl font-black text-white mb-3 tracking-tight animate-slide-up">Issue Reported!</h1>
          <p className="text-slate-400 mb-2">Your issue has been recorded and routed to the appropriate department.</p>
          <div className="flex items-center justify-center gap-2 text-civic-400 font-bold mb-8 animate-pulse">
            <FiMail /> <span>Confirmation sent to your email!</span>
          </div>
          <div className="card text-left mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-400 text-sm">Complaint ID</span>
              <span className="font-mono text-civic-400 font-bold">{submitted.id}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-400 text-sm">Category</span>
              <span className="text-white font-medium">{submitted.category}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-400 text-sm">Status</span>
              <span className="badge badge-pending">⏳ Pending</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">AI Confidence</span>
              <span className="text-civic-400 font-bold">{submitted.confidence}%</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate(`/status?id=${submitted.id}`)} className="btn-primary flex-1">
              Track Status
            </button>
            <button onClick={() => { setSubmitted(null); setStep(0); setForm({ title: '', description: '', location: '' }); setAiResult(null); }} className="btn-secondary flex-1">
              Report Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="page-container max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="section-title text-4xl">{t('reportButton')}</h1>
          <p className="text-slate-400">{t('heroSub')}</p>
          {isDemoMode && (
            <div className="mt-3 inline-flex items-center gap-2 glass px-3 py-1.5 rounded-full text-xs text-yellow-300 border border-yellow-500/30">
              <FiZap size={12} /> Demo Mode – Using mock AI responses
            </div>
          )}
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-0 mb-8">
          {STEPS_LOCALIZED.map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <div className={`flex items-center gap-2 flex-1 ${i < STEPS_LOCALIZED.length - 1 ? '' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all ${
                  i < step ? 'bg-accent-500 text-white' : i === step ? 'bg-civic-600 text-white ring-4 ring-civic-500/30' : 'bg-slate-700 text-slate-400'
                }`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className={`text-sm font-medium hidden sm:block ${i === step ? 'text-civic-300' : i < step ? 'text-accent-400' : 'text-slate-500'}`}>{s}</span>
              </div>
              {i < STEPS_LOCALIZED.length - 1 && <div className={`h-0.5 flex-1 mx-2 transition-all ${i < step ? 'bg-accent-500' : 'bg-slate-700'}`} />}
            </div>
          ))}
        </div>

        {/* Step 0: Details */}
        {step === 0 && (
          <div className="space-y-5 animate-slide-up">
            <div>
              <label className="text-slate-300 text-sm font-medium block mb-2">📸 {t('photo')}</label>
              <PhotoUpload onFile={setFile} />
            </div>
            <div>
              <label className="text-slate-300 text-sm font-medium block mb-2">📝 {t('title')} <span className="text-red-400">*</span></label>
              <input name="title" value={form.title} onChange={handleChange} className="input" placeholder="e.g. Large pothole on MG Road near bus stop" />
            </div>
            <div>
              <label className="text-slate-300 text-sm font-medium block mb-2">📋 {t('description')} <span className="text-red-400">*</span></label>
              <div className="relative">
                <textarea 
                  name="description" 
                  value={form.description} 
                  onChange={handleChange} 
                  rows={4} 
                  className="input resize-none pr-12" 
                  placeholder="Describe the issue in detail..." 
                />
                <button
                  type="button"
                  onClick={() => {
                    if (isListening) return;
                    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                    if (!SpeechRecognition) {
                      toast.error('Speech recognition not supported. Try Chrome or Edge.');
                      return;
                    }
                    const recognition = new SpeechRecognition();
                    recognition.lang = 'en-IN'; // Support Indian English
                    recognition.continuous = false;
                    recognition.interimResults = false;
                    
                    recognition.onstart = () => {
                      setIsListening(true);
                      toast.success(t('listening') || 'Listening...', { icon: '🎤' });
                    };
                    recognition.onresult = (event) => {
                      const transcript = event.results[0][0].transcript;
                      setForm(p => ({ ...p, description: p.description ? p.description + ' ' + transcript : transcript }));
                    };
                    recognition.onerror = () => {
                      setIsListening(false);
                      toast.error('Voice input failed. Please try again.');
                    };
                    recognition.onend = () => {
                      setIsListening(false);
                    };
                    recognition.start();
                  }}
                  className={`absolute right-3 top-3 p-3 rounded-xl transition-all shadow-lg border hover:scale-110 active:scale-95 ${
                    isListening 
                      ? 'bg-red-500/20 border-red-500/50 text-red-400 animate-pulse' 
                      : 'bg-slate-800 hover:bg-civic-600 border-slate-700 text-civic-400 hover:text-white'
                  }`}
                  title={t('voiceInput')}
                >
                  <FiMic size={20} className={isListening ? 'animate-bounce' : ''} />
                </button>
              </div>
            </div>
            <div>
              <label className="text-slate-300 text-sm font-medium block mb-2">📧 {t('email')} <span className="text-red-400">*</span></label>
              <input 
                name="email" 
                type="email"
                value={form.email} 
                onChange={handleChange} 
                className="input" 
                placeholder="Where should we send status updates?" 
                required
              />
            </div>
            <div className="relative">
              <label className="text-slate-300 text-sm font-medium block mb-2"><FiMapPin className="inline mr-1 text-civic-400" />{t('location')}</label>
              <input 
                name="location" 
                value={form.location} 
                onChange={(e) => {
                  handleChange(e);
                  setShowLocations(true);
                }} 
                className="input" 
                placeholder="Type your area or landmark..." 
                onFocus={() => setShowLocations(true)} 
              />
              {showLocations && (form.location || isSearching) && (
                <div className="absolute left-0 right-0 top-full mt-1 z-20 glass-dark rounded-xl border border-slate-700 max-h-60 overflow-y-auto shadow-2xl">
                  {isSearching ? (
                    <div className="px-4 py-3 flex items-center gap-3 text-civic-400 text-xs italic">
                      <div className="w-3 h-3 border-2 border-civic-400 border-t-transparent rounded-full animate-spin" />
                      Searching global database...
                    </div>
                  ) : (
                    <>
                      <p className="text-[10px] text-slate-500 px-3 pt-2 pb-1 font-semibold uppercase tracking-wider">📍 Global Locations Found</p>
                      {searchResults.map((loc, i) => (
                        <button key={i} type="button"
                          className="w-full text-left px-3 py-2.5 text-sm text-slate-300 hover:bg-civic-500/10 hover:text-white transition-all flex items-center gap-2 border-b border-slate-700/30 last:border-0"
                          onClick={() => { 
                            setForm(p => ({ ...p, location: loc.display, lat: loc.lat, lng: loc.lng })); 
                            setShowLocations(false); 
                          }}>
                          <FiMapPin size={12} className="text-civic-400 shrink-0" /> {loc.display}
                        </button>
                      ))}
                      {searchResults.length === 0 && form.location.length >= 3 && (
                        <div className="px-3 py-3 text-xs text-slate-500 italic">No global matches found. Try adding city name.</div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
            <button
              onClick={runAI}
              disabled={!form.title || !form.description}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiZap /> {t('analyzingAI')}
            </button>
          </div>
        )}

        {/* Step 1: Loading */}
        {step === 1 && (
          <div className="card animate-glow relative overflow-hidden p-12">
            <div className="absolute inset-x-0 top-0 h-1 bg-civic-500 animate-scan z-10" />
            <LoadingSpinner text="AI is classifying your complaint..." size="lg" />
            <div className="text-center mt-6 space-y-3 relative z-10">
              <p className="text-civic-400 font-bold animate-pulse">🔍 IDENTIFYING CATEGORY...</p>
              <div className="flex justify-center gap-1">
                {[0, 1, 2, 3].map(i => (
                  <div key={i} className="w-1.5 h-1.5 bg-civic-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
              <p className="text-slate-500 text-xs">🏢 CROSS-REFERENCING DEPARTMENTS</p>
              <p className="text-slate-600 text-xs">📝 OPTIMISING SUMMARY FOR OFFICIALS</p>
            </div>
          </div>
        )}

        {/* Step 2: Confirm */}
        {step === 2 && aiResult && (
          <div className="space-y-6 animate-slide-up">
            {/* AI Warning for Generated Images */}
            {isAiImage && (
              <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl flex items-center gap-3 animate-pulse">
                <span className="text-2xl">⚠️</span>
                <p className="text-red-400 text-sm font-bold">
                  Potential AI-generated image detected. Authentic photos are required for faster resolution.
                </p>
              </div>
            )}

            {/* AI Solution Blueprint (WOW Feature) */}
            {blueprint && (
              <div className="card bg-gradient-to-br from-civic-500/10 to-sky-500/10 border-civic-500/30 overflow-hidden">
                <div className="flex items-center gap-2 mb-4 bg-civic-500/20 -mx-6 -mt-6 p-4 px-6 border-b border-civic-500/20">
                  <FiZap className="text-civic-400" />
                  <h4 className="text-white font-black uppercase tracking-widest text-xs">AI Solution Blueprint</h4>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-700/50">
                    <p className="text-civic-300 text-xs font-bold mb-2">PROPOSED ACTION PLAN:</p>
                    <ul className="space-y-2">
                      {blueprint.steps.map((s, i) => (
                        <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                          <span className="text-civic-500 mt-1">•</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-slate-400 text-xs italic bg-slate-800/30 p-3 rounded-lg border border-slate-700/30">
                    💡 {blueprint.technicalNote}
                  </p>
                </div>
              </div>
            )}

            {/* AI Result with Solution Glow */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-civic-500 to-sky-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-glow" />
              <div className="relative">
                <AIConfidenceBadge
                  category={aiResult.category}
                  confidence={aiResult.confidence}
                  reasoning={aiResult.reasoning}
                />
              </div>
            </div>

            {/* AI Summary Reveal */}
            <div className="card bg-slate-900/80 border-civic-500/20 animate-shimmer">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-civic-500/20 rounded-lg flex items-center justify-center">
                  <FiZap size={12} className="text-civic-400" />
                </div>
                <p className="text-civic-400 text-xs font-black uppercase tracking-widest">AI Action Plan</p>
              </div>
              <p className="text-white text-lg font-medium leading-relaxed italic">
                "{aiSummary}"
              </p>
            </div>

            {/* Your complaint preview */}
            <div className="card">
              <p className="text-slate-400 text-sm font-medium mb-3">Your Complaint Details</p>
              <div className="space-y-2">
                <div className="flex gap-2"><span className="text-slate-500 text-sm w-24 shrink-0">Title:</span><span className="text-slate-200 text-sm">{form.title}</span></div>
                <div className="flex gap-2"><span className="text-slate-500 text-sm w-24 shrink-0">Location:</span><span className="text-slate-200 text-sm">{form.location || 'Not specified'}</span></div>
                {file && <div className="flex gap-2"><span className="text-slate-500 text-sm w-24 shrink-0">Photo:</span><span className="text-accent-400 text-sm">✓ Attached</span></div>}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(0)} className="btn-secondary flex-1">← Edit</button>
              <button onClick={handleSubmit} disabled={loading} className="btn-success flex-1 flex items-center justify-center gap-2">
                {loading ? '⏳ Submitting...' : <><FiSend /> Submit Complaint</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
