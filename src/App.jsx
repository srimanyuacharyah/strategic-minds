import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Login from './pages/Login';
import ReportIssue from './pages/ReportIssue';
import StatusTracker from './pages/StatusTracker';
import Navigator from './pages/Navigator';
import Feedback from './pages/Feedback';
import AdminDashboard from './pages/AdminDashboard';

import { LanguageProvider } from './context/LanguageContext';

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/"         element={<Landing />} />
            <Route path="/home"     element={<Home />} />
            <Route path="/signup"   element={<Signup />} />
            <Route path="/login"    element={<Login />} />
            <Route path="/report"   element={<ReportIssue />} />
            <Route path="/status"   element={<StatusTracker />} />
            <Route path="/navigator" element={<Navigator />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/admin"    element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
        <Chatbot />
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e1b4b',
            color: '#e2e8f0',
            border: '1px solid rgba(99,102,241,0.4)',
            borderRadius: '12px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
      </BrowserRouter>
    </LanguageProvider>
  );
}
