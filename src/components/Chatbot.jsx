import { useState, useRef, useEffect } from 'react';
import { FiMessageCircle, FiX, FiSend, FiZap } from 'react-icons/fi';

const QUICK_OPTIONS = [
  '📸 How to report an issue?',
  '📊 Track my complaint',
  '🧭 Find government service',
  '🏛️ Government schemes',
  '📞 Emergency helplines',
  '🤖 What is CivicAI?',
];

const KNOWLEDGE_BASE = {
  'report': {
    keywords: ['report', 'complaint', 'issue', 'submit', 'photo', 'problem', 'file'],
    response: `📸 **How to Report an Issue:**\n\n1. Go to **Report Issue** page\n2. Describe your problem in detail\n3. Upload a photo (optional but recommended)\n4. Select or type your location\n5. Click **"Analyze with AI"** — our AI will:\n   • Auto-classify (Road/Water/Electricity/Waste)\n   • Route to correct department\n   • Generate a summary\n6. Confirm & submit!\n\nYou'll get a complaint ID (e.g., CMP-2026-001) to track status.`
  },
  'track': {
    keywords: ['track', 'status', 'check', 'follow', 'progress', 'where', 'complaint id'],
    response: `📊 **Track Your Complaint:**\n\n1. Go to **Track Status** page\n2. Enter your Complaint ID (e.g., CMP-2026-001)\n3. Or browse all complaints by category/status\n4. View detailed timeline: Pending → In Progress → Resolved\n\n**Status meanings:**\n• 🟡 Pending – Received, awaiting assignment\n• 🔵 In Progress – Being worked on\n• 🟢 Resolved – Issue fixed!`
  },
  'service': {
    keywords: ['service', 'find', 'navigate', 'guide', 'department', 'who to contact', 'where to go'],
    response: `🧭 **Find the Right Service:**\n\n1. Go to **Find Service** page\n2. Answer simple questions about your issue\n3. Get guided to the exact department\n4. See contact details, steps to follow, and pro tips\n\n**Available departments:**\n• 🛣️ Public Works Department (PWD)\n• 💧 Municipal Water Board\n• ⚡ State Electricity Board\n• ♻️ Solid Waste Management\n• 🏛️ General Municipal Services\n• 🏥 Health Department\n• 📚 Education Department\n• 🌳 Environment & Forest`
  },
  'scheme': {
    keywords: ['scheme', 'schemes', 'government scheme', 'welfare', 'benefit', 'yojana', 'subsidy', 'pension'],
    response: `🏛️ **Government Schemes:**\n\n**Central Schemes:**\n• PM Awas Yojana – Housing for all\n• Ayushman Bharat – Health insurance ₹5L\n• PM Kisan – ₹6000/year for farmers\n• Ujjwala Yojana – Free LPG connections\n• Digital India – e-Governance services\n\n**State Schemes:**\n• Ladki Bahin Yojana – Women empowerment\n• Mahatma Phule Jan Arogya – Health coverage\n• Mukhyamantri Rozgar Yojana – Employment\n\n👉 Visit **Find Service** → **Government Schemes** for full details and application links.`
  },
  'helpline': {
    keywords: ['helpline', 'emergency', 'phone', 'call', 'number', 'customer care', 'toll free', 'contact'],
    response: `📞 **Emergency & Helpline Numbers:**\n\n🚨 **Emergency:**\n• Police: **100**\n• Fire: **101**\n• Ambulance: **108**\n• Women Helpline: **1091**\n• Child Helpline: **1098**\n\n🏛️ **Government Services:**\n• Municipal Corp: **1800-180-4325**\n• Water Board: **1800-180-5678**\n• Electricity (DISCOM): **1912**\n• Waste Management: **1800-180-9988**\n• RTI Helpline: **1800-110-001**\n• Anti-corruption: **1800-110-025**\n\n💡 All helplines are toll-free and available 24/7.`
  },
  'civicai': {
    keywords: ['civicai', 'what is', 'about', 'platform', 'how does', 'features'],
    response: `🤖 **About CivicAI:**\n\nCivicAI is an AI-powered Smart Citizen-Government Bridge that:\n\n✅ **Report Issues** – Submit with photo & location\n✅ **AI Classification** – Auto-categorize & route complaints\n✅ **Track Status** – Real-time complaint tracking\n✅ **Find Services** – Guided navigation to right department\n✅ **Give Feedback** – Rate government services\n✅ **Admin Dashboard** – Heatmaps, charts & analytics\n\n**Powered by:**\n• AI for classification & sentiment analysis\n• Interactive maps for issue heatmaps\n• Real-time analytics dashboard\n\nBuilt for the TechFusion Hackathon 🚀`
  },
  'feedback': {
    keywords: ['feedback', 'rate', 'review', 'experience', 'rating'],
    response: `💬 **Give Feedback:**\n\n1. Go to **Feedback** page\n2. Rate your experience (1-5 stars)\n3. Describe your experience\n4. Upload a photo (optional)\n5. AI analyzes sentiment automatically\n\nYour feedback helps improve government services and response times!`
  },
  'admin': {
    keywords: ['admin', 'dashboard', 'analytics', 'government', 'official'],
    response: `🏛️ **Admin Dashboard Features:**\n\n• 📍 Interactive issue heatmap (Leaflet)\n• 📊 Charts – by category, status, and trends\n• 🤖 AI-generated complaint summaries\n• 📋 Full complaint table with status management\n• 🔄 Real-time data refresh\n\nGovernment officials can update complaint status directly from the dashboard.`
  },
};

function getResponse(input) {
  const lower = input.toLowerCase();
  let bestMatch = null;
  let bestScore = 0;

  for (const [, data] of Object.entries(KNOWLEDGE_BASE)) {
    const score = data.keywords.filter(k => lower.includes(k)).length;
    if (score > bestScore) {
      bestScore = score;
      bestMatch = data;
    }
  }

  if (bestMatch) return bestMatch.response;

  return `I can help you with:\n\n• 📸 Reporting issues\n• 📊 Tracking complaints\n• 🧭 Finding government services\n• 🏛️ Government schemes\n• 📞 Emergency helplines\n• 💬 Giving feedback\n\nTry asking about any of these topics!`;
}

const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;

async function callGemini(prompt) {
  if (!GEMINI_KEY) return null;
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `You are CivicAI Assistant, a smart city bridge. Use this knowledge base context if relevant: ${JSON.stringify(KNOWLEDGE_BASE)}. \n\nUser Question: ${prompt}` }] }]
      })
    });
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (e) {
    console.error('Gemini error:', e);
    return null;
  }
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: '👋 Hi! I\'m CivicAI Assistant. I\'m powered by Gemini AI to help you with anything related to our city services!\n\nHow can I help you today?', time: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEnd = useRef(null);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const userMsg = { role: 'user', text: text.trim(), time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    const geminiResponse = await callGemini(text);
    const response = geminiResponse || getResponse(text);
    
    setMessages(prev => [...prev, { role: 'bot', text: response, time: new Date() }]);
    setTyping(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-glow transition-all duration-300 hover:scale-110 ${
          open ? 'bg-red-500 hover:bg-red-400 rotate-90' : 'bg-gradient-to-br from-civic-500 to-sky-500 hover:from-civic-400 hover:to-sky-400'
        }`}
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        {open ? <FiX size={22} className="text-white" /> : <FiMessageCircle size={22} className="text-white" />}
      </button>

      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-8rem)] glass-dark rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-up border border-civic-500/30">
          {/* Header */}
          <div className="bg-gradient-to-r from-civic-600 to-sky-600 px-4 py-3 flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <FiZap className="text-white" size={18} />
            </div>
            <div className="flex-1">
              <h4 className="text-white font-bold text-sm">CivicAI Assistant</h4>
              <p className="text-white/70 text-xs">AI-powered help • Always available</p>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition-colors">
              <FiX size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-civic-600 text-white rounded-br-md'
                    : 'bg-slate-800/80 text-slate-200 border border-slate-700/50 rounded-bl-md'
                }`}>
                  <div className="whitespace-pre-line">{msg.text}</div>
                  <p className={`text-[10px] mt-1 ${msg.role === 'user' ? 'text-civic-200' : 'text-slate-500'}`}>
                    {msg.time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-slate-800/80 rounded-2xl rounded-bl-md px-4 py-3 border border-slate-700/50">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-civic-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-civic-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-civic-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEnd} />
          </div>

          {/* Quick Options */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5 shrink-0">
              {QUICK_OPTIONS.map(opt => (
                <button
                  key={opt}
                  onClick={() => sendMessage(opt)}
                  className="text-xs bg-slate-800/60 border border-slate-700/50 text-slate-300 hover:text-white hover:border-civic-500/40 px-2.5 py-1.5 rounded-lg transition-all"
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-slate-700/50 flex gap-2 shrink-0">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 bg-slate-800/60 border border-slate-700 text-sm text-white placeholder-slate-500 rounded-xl px-4 py-2.5 focus:outline-none focus:border-civic-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="w-10 h-10 bg-civic-600 hover:bg-civic-500 disabled:opacity-40 disabled:hover:bg-civic-600 text-white rounded-xl flex items-center justify-center transition-all shrink-0"
            >
              <FiSend size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
