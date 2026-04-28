import { useState } from 'react';
import { FiStar, FiSend, FiZap } from 'react-icons/fi';
import { analyzeSentiment } from '../services/aiService';
import { submitFeedback } from '../services/firebaseService';
import { isDemoMode } from '../services/aiService';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const SENTIMENT_CONFIG = {
  Positive: { emoji: '😊', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20', label: 'Positive Sentiment' },
  Negative: { emoji: '😞', color: 'text-red-400',   bg: 'bg-red-500/10 border-red-500/20',   label: 'Negative Sentiment' },
  Neutral:  { emoji: '😐', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', label: 'Neutral Sentiment' },
};

export default function Feedback() {
  const [text, setText] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) { toast.error('Please write your feedback'); return; }
    if (rating === 0) { toast.error('Please give a star rating'); return; }
    setLoading(true);
    try {
      const sentiment = await analyzeSentiment(text);
      setAiResult(sentiment);
      await submitFeedback({ text, rating, sentiment: sentiment.sentiment, keyIssue: sentiment.keyIssue });
      setSubmitted(true);
      toast.success('Feedback submitted! Thank you.');
    } catch {
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setText(''); setRating(0); setAiResult(null); setSubmitted(false);
  };

  const sentCfg = aiResult ? SENTIMENT_CONFIG[aiResult.sentiment] : null;

  if (submitted && aiResult) {
    return (
      <div className="page-wrapper">
        <div className="page-container max-w-xl mx-auto text-center animate-fade-in">
          <div className="text-7xl mb-4">{sentCfg?.emoji}</div>
          <h1 className="text-3xl font-black text-white mb-2">Thank You!</h1>
          <p className="text-slate-400 mb-8">Your feedback has been recorded and analysed by AI.</p>

          <div className={`card border ${sentCfg?.bg} mb-6 text-left`}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-civic-500/20 rounded-lg flex items-center justify-center">
                <FiZap size={15} className="text-civic-400" />
              </div>
              <span className="text-civic-400 font-semibold text-sm">AI Sentiment Analysis</span>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div>
                <p className={`text-2xl font-black ${sentCfg?.color}`}>{aiResult.sentiment}</p>
                <p className="text-slate-400 text-sm">{aiResult.keyIssue}</p>
              </div>
              <span className="text-5xl">{sentCfg?.emoji}</span>
            </div>

            {/* Score bar */}
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Sentiment Score</span>
                <span className="font-mono font-bold text-civic-300">{aiResult.score}/100</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    aiResult.sentiment === 'Positive' ? 'bg-green-500' :
                    aiResult.sentiment === 'Negative' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}
                  style={{ width: `${aiResult.score}%` }}
                />
              </div>
            </div>
          </div>

          {/* Your rating */}
          <div className="card mb-6 text-left">
            <p className="text-slate-400 text-sm mb-2">Your Rating</p>
            <div className="flex gap-1">
              {[1,2,3,4,5].map(s => (
                <span key={s} className={`text-2xl ${s <= rating ? 'text-yellow-400' : 'text-slate-600'}`}>★</span>
              ))}
              <span className="text-slate-400 text-sm ml-2 self-center">{rating}/5</span>
            </div>
          </div>

          <button onClick={reset} className="btn-primary w-full">Submit Another Feedback</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="page-container max-w-xl mx-auto">
        <div className="mb-8 animate-fade-in">
          <h1 className="section-title text-4xl">💬 Share Feedback</h1>
          <p className="text-slate-400">Help us improve. AI analyses your feedback to drive better government response.</p>
          {isDemoMode && (
            <div className="mt-3 inline-flex items-center gap-2 glass px-3 py-1.5 rounded-full text-xs text-yellow-300 border border-yellow-500/30">
              <FiZap size={12} /> Demo Mode – Using mock AI sentiment
            </div>
          )}
        </div>

        {loading ? (
          <div className="card animate-fade-in">
            <LoadingSpinner text="AI is analysing your feedback..." size="lg" />
          </div>
        ) : (
          <div className="card animate-slide-up space-y-6">
            {/* Star Rating */}
            <div>
              <label className="text-slate-300 font-medium text-sm block mb-3">⭐ Overall Experience</label>
              <div className="flex gap-2">
                {[1,2,3,4,5].map(s => (
                  <button
                    key={s}
                    onMouseEnter={() => setHoverRating(s)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(s)}
                    className="transition-transform hover:scale-125 active:scale-95"
                  >
                    <span className={`text-4xl transition-colors ${s <= (hoverRating || rating) ? 'text-yellow-400' : 'text-slate-700'}`}>★</span>
                  </button>
                ))}
                {rating > 0 && (
                  <span className="text-slate-400 text-sm self-center ml-2">
                    {['', 'Very Poor', 'Poor', 'Okay', 'Good', 'Excellent'][rating]}
                  </span>
                )}
              </div>
            </div>

            {/* Feedback text */}
            <div>
              <label className="text-slate-300 font-medium text-sm block mb-2">📝 Your Feedback</label>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                rows={5}
                className="input resize-none"
                placeholder="Tell us about your experience with the service, complaint resolution speed, or anything you'd like the government to know..."
              />
              <p className="text-slate-500 text-xs mt-1 text-right">{text.length} characters</p>
            </div>

            {/* Quick responses */}
            <div>
              <p className="text-slate-400 text-xs font-medium mb-2">💬 Quick responses:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  'The issue was resolved quickly!',
                  'No action taken despite multiple complaints.',
                  'Good initiative but needs faster response.',
                  'The team was professional and efficient.',
                ].map(q => (
                  <button
                    key={q}
                    onClick={() => setText(q)}
                    className="text-xs glass border border-slate-700 hover:border-civic-500/40 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!text.trim() || rating === 0}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiSend /> Analyse & Submit Feedback
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
