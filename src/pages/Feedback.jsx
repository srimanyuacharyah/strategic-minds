import { useState } from 'react';
import { FiStar, FiSend, FiZap, FiPhone, FiImage, FiX } from 'react-icons/fi';
import { analyzeSentiment } from '../services/aiService';
import { submitFeedback } from '../services/dbService';
import { isDemoMode } from '../services/aiService';
import toast from 'react-hot-toast';

const HELPLINES = [
  { label: 'Police', number: '100', icon: '🚔' },
  { label: 'Fire', number: '101', icon: '🚒' },
  { label: 'Ambulance', number: '108', icon: '🚑' },
  { label: 'Women Helpline', number: '1091', icon: '👩' },
  { label: 'Child Helpline', number: '1098', icon: '👶' },
  { label: 'Municipal Corp', number: '1800-180-4325', icon: '🏛️' },
  { label: 'Water Board', number: '1800-180-5678', icon: '💧' },
  { label: 'Electricity (DISCOM)', number: '1912', icon: '⚡' },
  { label: 'Waste Management', number: '1800-180-9988', icon: '♻️' },
  { label: 'Anti-Corruption', number: '1800-110-025', icon: '⚖️' },
  { label: 'RTI Helpline', number: '1800-110-001', icon: '📄' },
  { label: 'Consumer Forum', number: '1800-114-000', icon: '🛡️' },
];

export default function Feedback() {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [text, setText] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !text.trim()) {
      toast.error('Please provide a rating and feedback text.');
      return;
    }
    setLoading(true);
    try {
      const sentiment = await analyzeSentiment(text);
      setResult(sentiment);
      await submitFeedback({ text, rating, sentiment: sentiment.sentiment, photo: photo?.name || null });
      setSubmitted(true);
      toast.success('Feedback submitted successfully!');
    } catch {
      toast.error('Failed to submit feedback.');
    }
    setLoading(false);
  };

  const sentimentColor = {
    Positive: 'text-green-400 bg-green-500/20 border-green-500/30',
    Negative: 'text-red-400 bg-red-500/20 border-red-500/30',
    Neutral:  'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
  };

  const sentimentEmoji = { Positive: '😊', Negative: '😞', Neutral: '😐' };

  if (submitted && result) {
    return (
      <div className="page-wrapper">
        <div className="max-w-xl mx-auto text-center animate-fade-in">
          <div className="card bg-gradient-to-br from-civic-900/40 to-slate-900/40 border border-civic-500/20">
            <div className="text-6xl mb-4">{sentimentEmoji[result.sentiment]}</div>
            <h2 className="text-2xl font-bold text-white mb-2">Thank You for Your Feedback!</h2>
            <p className="text-slate-400 mb-6">Your voice helps improve government services.</p>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold mb-4 ${sentimentColor[result.sentiment]}`}>
              <FiZap size={14} /> AI Sentiment: {result.sentiment}
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 mb-4 text-left">
              <p className="text-xs text-slate-400 mb-1">Key Issue Identified:</p>
              <p className="text-slate-200 text-sm">{result.keyIssue}</p>
            </div>
            <div className="flex items-center justify-center gap-1 mb-6">
              {[1,2,3,4,5].map(s => (
                <FiStar key={s} size={24} className={s <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'} />
              ))}
            </div>
            <div className="flex gap-3 justify-center">
              <button onClick={() => { setSubmitted(false); setResult(null); setRating(0); setText(''); setPhoto(null); setPhotoPreview(null); }} className="btn-secondary text-sm">
                Submit Another
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="page-container">
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-4xl font-black text-white mb-2">💬 Give Feedback</h1>
          <p className="text-slate-400 max-w-xl mx-auto">Rate your experience. AI analyzes your sentiment to help improve government responsiveness.</p>
          {isDemoMode && <p className="text-civic-400/70 text-xs mt-2">🟢 Demo mode – using mock AI sentiment analysis</p>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Feedback Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="card animate-slide-up space-y-6">
              {/* Star Rating */}
              <div>
                <label className="text-sm text-slate-300 font-medium block mb-3">How was your experience? *</label>
                <div className="flex items-center gap-2">
                  {[1,2,3,4,5].map(s => (
                    <button key={s} type="button" onClick={() => setRating(s)} onMouseEnter={() => setHovered(s)} onMouseLeave={() => setHovered(0)}
                      className="transition-transform hover:scale-125 active:scale-95">
                      <FiStar size={36} className={`transition-colors ${s <= (hovered || rating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600 hover:text-slate-400'}`} />
                    </button>
                  ))}
                  {rating > 0 && <span className="text-sm text-slate-400 ml-2">{['', 'Terrible', 'Poor', 'Average', 'Good', 'Excellent'][rating]}</span>}
                </div>
              </div>

              {/* Feedback Text */}
              <div>
                <label className="text-sm text-slate-300 font-medium block mb-2">Your Feedback *</label>
                <textarea value={text} onChange={e => setText(e.target.value)} rows={4} placeholder="Describe your experience with the government service..." className="input resize-none" />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="text-sm text-slate-300 font-medium block mb-2">
                  <FiImage className="inline mr-1" size={14} /> Attach Photo (optional)
                </label>
                {photoPreview ? (
                  <div className="relative inline-block">
                    <img src={photoPreview} alt="Preview" className="w-32 h-32 object-cover rounded-xl border border-slate-700" />
                    <button type="button" onClick={removePhoto} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-400 transition-colors">
                      <FiX size={12} />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center gap-3 glass-dark border border-dashed border-slate-600 hover:border-civic-500/50 rounded-xl px-4 py-4 cursor-pointer transition-all group">
                    <div className="w-10 h-10 bg-civic-500/10 rounded-lg flex items-center justify-center group-hover:bg-civic-500/20 transition-colors">
                      <FiImage className="text-civic-400" size={18} />
                    </div>
                    <div>
                      <p className="text-slate-300 text-sm font-medium">Click to upload photo</p>
                      <p className="text-slate-500 text-xs">JPG, PNG up to 5MB</p>
                    </div>
                    <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                  </label>
                )}
              </div>

              <button type="submit" disabled={loading || !rating || !text.trim()} className="btn-primary w-full flex items-center justify-center gap-2">
                {loading ? (
                  <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyzing...</>
                ) : (
                  <><FiSend size={16} /> Submit Feedback</>
                )}
              </button>
            </form>
          </div>

          {/* Helplines Sidebar */}
          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="card bg-gradient-to-br from-red-900/20 to-slate-900/40 border border-red-500/20">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <FiPhone size={15} className="text-red-400" />
                </div>
                <h3 className="text-white font-semibold text-sm">Government Helplines</h3>
              </div>
              <p className="text-slate-500 text-xs mb-4">Toll-free 24/7 helpline numbers</p>
              <div className="space-y-2">
                {HELPLINES.map(h => (
                  <a key={h.number} href={`tel:${h.number}`} className="flex items-center gap-3 bg-slate-800/40 hover:bg-slate-800/70 rounded-xl px-3 py-2.5 transition-colors group">
                    <span className="text-lg">{h.icon}</span>
                    <div className="flex-1">
                      <p className="text-slate-300 text-xs font-medium">{h.label}</p>
                    </div>
                    <span className="text-civic-400 font-mono text-xs font-bold group-hover:text-white transition-colors">{h.number}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
