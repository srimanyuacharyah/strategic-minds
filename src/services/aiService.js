// AI Service – uses OpenAI API with mock fallback for demo mode
import { DEPARTMENTS } from '../data/mockData';

const OPENAI_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const DEMO_MODE = !OPENAI_KEY;

const MOCK_CLASSIFICATIONS = {
  road: { category: 'Road', confidence: 96, reasoning: 'Keywords indicate infrastructure / road surface issue.' },
  pothole: { category: 'Road', confidence: 98, reasoning: 'Pothole is a clear road infrastructure issue.' },
  water: { category: 'Water', confidence: 97, reasoning: 'Complaint relates to water supply or pipeline.' },
  pipe: { category: 'Water', confidence: 99, reasoning: 'Pipe issues fall under water department.' },
  light: { category: 'Electricity', confidence: 95, reasoning: 'Street light / power issue.' },
  electricity: { category: 'Electricity', confidence: 98, reasoning: 'Direct electricity complaint.' },
  power: { category: 'Electricity', confidence: 97, reasoning: 'Power supply issue.' },
  garbage: { category: 'Waste', confidence: 98, reasoning: 'Solid waste management issue.' },
  waste: { category: 'Waste', confidence: 96, reasoning: 'Waste disposal or collection problem.' },
  trash: { category: 'Waste', confidence: 97, reasoning: 'Trash collection complaint.' },
};

function mockClassify(text) {
  const lower = text.toLowerCase();
  for (const [keyword, result] of Object.entries(MOCK_CLASSIFICATIONS)) {
    if (lower.includes(keyword)) return result;
  }
  const categories = ['Road','Water','Electricity','Waste'];
  const category = categories[Math.floor(Math.random() * categories.length)];
  return { category, confidence: Math.floor(Math.random() * 10) + 88, reasoning: 'AI classified based on complaint context.' };
}

function mockSummarize(text) {
  const words = text.split(' ').slice(0, 12).join(' ');
  return words + (text.split(' ').length > 12 ? '...' : '');
}

function mockSentiment(text) {
  const lower = text.toLowerCase();
  if (lower.includes('good') || lower.includes('great') || lower.includes('fast') || lower.includes('excellent')) {
    return { sentiment: 'Positive', keyIssue: 'Satisfied with resolution speed', score: 85 };
  }
  if (lower.includes('bad') || lower.includes('terrible') || lower.includes('no action') || lower.includes('disappoint')) {
    return { sentiment: 'Negative', keyIssue: 'Dissatisfied with response time', score: 20 };
  }
  return { sentiment: 'Neutral', keyIssue: 'Moderate satisfaction with services', score: 55 };
}

async function callOpenAI(prompt) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 200,
    }),
  });
  if (!response.ok) throw new Error('OpenAI API error');
  const data = await response.json();
  return data.choices[0].message.content.trim();
}

export async function classifyIssue(text) {
  if (DEMO_MODE) {
    await new Promise(r => setTimeout(r, 1200)); // simulate API delay
    return mockClassify(text);
  }
  try {
    const prompt = `Classify this citizen complaint into EXACTLY one category from: Road, Water, Electricity, Waste, Other.
Complaint: "${text}"
Respond in JSON format only: {"category": "...", "confidence": <number 80-100>, "reasoning": "..."}`;
    const raw = await callOpenAI(prompt);
    return JSON.parse(raw);
  } catch {
    return mockClassify(text);
  }
}

export async function summarizeComplaint(text) {
  if (DEMO_MODE) {
    await new Promise(r => setTimeout(r, 800));
    return mockSummarize(text);
  }
  try {
    const prompt = `Summarize this citizen complaint in ONE concise sentence (max 20 words) for government officials:\n"${text}"\nRespond with just the summary sentence.`;
    return await callOpenAI(prompt);
  } catch {
    return mockSummarize(text);
  }
}

export async function analyzeSentiment(text) {
  if (DEMO_MODE) {
    await new Promise(r => setTimeout(r, 900));
    return mockSentiment(text);
  }
  try {
    const prompt = `Analyze sentiment of this citizen feedback and identify the key issue.
Feedback: "${text}"
Respond in JSON: {"sentiment": "Positive|Negative|Neutral", "keyIssue": "...", "score": <0-100>}`;
    const raw = await callOpenAI(prompt);
    return JSON.parse(raw);
  } catch {
    return mockSentiment(text);
  }
}

export function routeToDepartment(category) {
  return DEPARTMENTS[category] || DEPARTMENTS['Other'];
}

export function generateComplaintId() {
  const year = new Date().getFullYear();
  const num = String(Math.floor(Math.random() * 900) + 100).padStart(3, '0');
  return `CMP-${year}-${num}`;
}

export const isDemoMode = DEMO_MODE;
