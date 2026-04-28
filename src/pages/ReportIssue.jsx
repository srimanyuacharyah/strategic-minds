import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMapPin, FiSend, FiZap } from 'react-icons/fi';
import PhotoUpload from '../components/PhotoUpload';
import AIConfidenceBadge from '../components/AIConfidenceBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { classifyIssue, summarizeComplaint, routeToDepartment } from '../services/aiService';
import { submitComplaint } from '../services/firebaseService';
import { isDemoMode } from '../services/aiService';
import toast from 'react-hot-toast';

const STEPS = ['Details', 'AI Analysis', 'Confirm'];

export default function ReportIssue() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', location: '' });
  const [aiResult, setAiResult] = useState(null);
  const [aiSummary, setAiSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(null);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

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
        location: {
          address: form.location || 'Location not specified',
          lat: 18.5204 + (Math.random() - 0.5) * 0.05,
          lng: 73.8567 + (Math.random() - 0.5) * 0.05,
        },
        category: aiResult?.category || 'Other',
        aiSummary,
        confidence: aiResult?.confidence || 80,
        department: aiResult?.category || 'Other',
        hasImage: !!file,
      });
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
        <div className="page-container max-w-xl mx-auto text-center animate-fade-in">
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
            <span className="text-5xl">✅</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Complaint Submitted!</h1>
          <p className="text-slate-400 mb-6">Your issue has been recorded and routed to the appropriate department.</p>
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
          <h1 className="section-title text-4xl">Report an Issue</h1>
          <p className="text-slate-400">Upload a photo, describe the problem — AI does the rest.</p>
          {isDemoMode && (
            <div className="mt-3 inline-flex items-center gap-2 glass px-3 py-1.5 rounded-full text-xs text-yellow-300 border border-yellow-500/30">
              <FiZap size={12} /> Demo Mode – Using mock AI responses
            </div>
          )}
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-0 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <div className={`flex items-center gap-2 flex-1 ${i < STEPS.length - 1 ? '' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all ${
                  i < step ? 'bg-accent-500 text-white' : i === step ? 'bg-civic-600 text-white ring-4 ring-civic-500/30' : 'bg-slate-700 text-slate-400'
                }`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className={`text-sm font-medium hidden sm:block ${i === step ? 'text-civic-300' : i < step ? 'text-accent-400' : 'text-slate-500'}`}>{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`h-0.5 flex-1 mx-2 transition-all ${i < step ? 'bg-accent-500' : 'bg-slate-700'}`} />}
            </div>
          ))}
        </div>

        {/* Step 0: Details */}
        {step === 0 && (
          <div className="space-y-5 animate-slide-up">
            <div>
              <label className="text-slate-300 text-sm font-medium block mb-2">📸 Photo (optional but recommended)</label>
              <PhotoUpload onFile={setFile} />
            </div>
            <div>
              <label className="text-slate-300 text-sm font-medium block mb-2">📝 Issue Title <span className="text-red-400">*</span></label>
              <input name="title" value={form.title} onChange={handleChange} className="input" placeholder="e.g. Large pothole on MG Road near bus stop" />
            </div>
            <div>
              <label className="text-slate-300 text-sm font-medium block mb-2">📋 Description <span className="text-red-400">*</span></label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="input resize-none" placeholder="Describe the issue in detail – location, severity, how long it's been there..." />
            </div>
            <div>
              <label className="text-slate-300 text-sm font-medium block mb-2"><FiMapPin className="inline mr-1 text-civic-400" />Location / Address</label>
              <input name="location" value={form.location} onChange={handleChange} className="input" placeholder="e.g. MG Road, near Bus Stop 12, Pune" />
            </div>
            <button
              onClick={runAI}
              disabled={!form.title || !form.description}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiZap /> Analyse with AI
            </button>
          </div>
        )}

        {/* Step 1: Loading */}
        {step === 1 && (
          <div className="card animate-fade-in">
            <LoadingSpinner text="AI is classifying your complaint..." size="lg" />
            <div className="text-center mt-4 space-y-2">
              <p className="text-slate-400 text-sm">🔍 Identifying issue category...</p>
              <p className="text-slate-500 text-xs">🏢 Routing to correct department...</p>
              <p className="text-slate-600 text-xs">📝 Generating summary for officials...</p>
            </div>
          </div>
        )}

        {/* Step 2: Confirm */}
        {step === 2 && aiResult && (
          <div className="space-y-5 animate-slide-up">
            {/* AI Result */}
            <AIConfidenceBadge
              category={aiResult.category}
              confidence={aiResult.confidence}
              reasoning={aiResult.reasoning}
            />

            {/* AI Summary */}
            <div className="card">
              <p className="text-slate-400 text-sm font-medium mb-2">🤖 AI-Generated Summary</p>
              <p className="text-white font-medium leading-relaxed">{aiSummary}</p>
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
