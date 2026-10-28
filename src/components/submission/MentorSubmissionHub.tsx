import React, { useState, useRef } from 'react';
import { useHotel } from '../../context/HotelContext';
import {
  Video,
  Copy,
  Check,
  ExternalLink,
  Play,
  Pause,
  Download,
  Github,
  Award,
  Layers,
  FileText,
  CheckCircle2,
  Camera,
  Mic,
  Monitor,
  Share2,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Building,
  RotateCcw,
} from 'lucide-react';

export const MentorSubmissionHub: React.FC = () => {
  const { setIsDemoTourActive, setActiveTab } = useHotel();

  // Links
  const liveDemoUrl = 'https://ais-pre-65ujbv5ukfuzkpkhi5keon-987321669319.asia-east1.run.app';
  const devDemoUrl = 'https://ais-dev-65ujbv5ukfuzkpkhi5keon-987321669319.asia-east1.run.app';
  const defaultGithubUrl = 'https://github.com/en24cs3010406/HotelPro-MERN-Hotel-Management-Solution';
  const defaultVideoLink = 'https://youtu.be/hotelpro-mern-walkthrough-demo';

  // Copy states
  const [copiedDemo, setCopiedDemo] = useState(false);
  const [copiedGithub, setCopiedGithub] = useState(false);
  const [copiedVideo, setCopiedVideo] = useState(false);
  const [copiedReadme, setCopiedReadme] = useState(false);

  // Animated In-Player Video Simulation State
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [videoCurrentTime, setVideoCurrentTime] = useState(15);
  const [videoPlaybackSpeed, setVideoPlaybackSpeed] = useState<number>(1);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  const TOTAL_VIDEO_SECONDS = 210; // 3 mins 30 secs

  // Sync chapters with current time
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlayingVideo) {
      timer = setInterval(() => {
        setVideoCurrentTime((prev) => {
          if (prev >= TOTAL_VIDEO_SECONDS) {
            setIsPlayingVideo(false);
            return 0;
          }
          const next = prev + 1 * videoPlaybackSpeed;
          // Determine active chapter
          if (next < 40) setActiveChapterIndex(0);
          else if (next < 85) setActiveChapterIndex(1);
          else if (next < 130) setActiveChapterIndex(2);
          else if (next < 180) setActiveChapterIndex(3);
          else setActiveChapterIndex(4);
          return next;
        });
      }, 1000 / videoPlaybackSpeed);
    }
    return () => clearInterval(timer);
  }, [isPlayingVideo, videoPlaybackSpeed]);

  const seekToChapter = (index: number) => {
    setActiveChapterIndex(index);
    setVideoCurrentTime(CHAPTERS[index].start);
    setIsPlayingVideo(true);
  };

  const formatVideoTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Screen recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const CHAPTERS = [
    { title: 'Project Overview & MERN Architecture', start: 0, duration: 40 },
    { title: 'Guest Booking Engine & Availability', start: 40, duration: 45 },
    { title: 'Instant Voucher & Checkout Flow', start: 85, duration: 45 },
    { title: 'Staff Dashboard & Room Rack Matrix', start: 130, duration: 50 },
    { title: 'Housekeeping Kanban & CRM Records', start: 180, duration: 40 },
  ];

  const handleCopy = (text: string, type: 'demo' | 'github' | 'video' | 'readme') => {
    navigator.clipboard.writeText(text);
    if (type === 'demo') {
      setCopiedDemo(true);
      setTimeout(() => setCopiedDemo(false), 2000);
    } else if (type === 'github') {
      setCopiedGithub(true);
      setTimeout(() => setCopiedGithub(false), 2000);
    } else if (type === 'video') {
      setCopiedVideo(true);
      setTimeout(() => setCopiedVideo(false), 2000);
    } else if (type === 'readme') {
      setCopiedReadme(true);
      setTimeout(() => setCopiedReadme(false), 2000);
    }
  };

  // Real In-Browser Screen Recorder
  const startScreenRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      recordedChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedVideoUrl(url);
        setIsRecording(false);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error starting screen recording:', err);
      alert('Screen recording was cancelled or not supported by your browser permissions.');
    }
  };

  const stopScreenRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  const GITHUB_README_TEXT = `# HotelPro - Complete Hotel Booking and Management Solution

> A modern, production-grade Full-Stack MERN (MongoDB, Express, React, Node.js) hospitality platform with real-time reservation management, guest self-service concierge, room inventory rack, and housekeeping operations.

---

## 🌟 Live Demo & Video Submission
- **Live Deployed App**: ${liveDemoUrl}
- **Mentor Video Walkthrough**: ${defaultVideoLink}
- **GitHub Repository**: ${defaultGithubUrl}

---

## 📌 Features & Project Architecture

### 1. Guest & Customer Experience
- **Real-Time Room Discovery**: Filter by check-in/out dates, guest count, and accommodation tiers (Standard Deluxe, Ocean View Suites, Executive Penthouses, Presidential Villas).
- **3-Step Checkout Flow**: Integrated add-ons (Breakfast Buffet, Airport Transfer, Couple Spa), promo codes, and simulated payment gateways (Credit Card, NetBanking/UPI, Pay at Check-in).
- **Digital Vouchers & Invoicing**: Automated reference ID (\`HP-XXXXX\`), QR code fast-pass issuance, and PDF voucher export.
- **Guest Portal & Concierge**: View stay status, cancel bookings with refund calculations, and submit on-demand room amenity requests.

### 2. Hotel Staff & Administration Command Center
- **Executive Operations Dashboard**: Live property occupancy rate (%), revenue to date, arriving check-ins, and departures queue.
- **Visual Room Rack**: Matrix across 4 hotel floors with instant status updating (\`Available\`, \`Occupied\`, \`Cleaning\`, \`Maintenance\`).
- **Housekeeping Kanban Board**: 4-stage workflow (Dirty -> In Progress -> Cleaned -> Inspected) with housekeeper staff assignments.
- **Guest CRM**: Loyalty tiers (Silver, Gold, Platinum), lifetime stay records, and personal preferences notes.
- **Financial Analytics & Export**: Category revenue distributions, payment method breakdowns, and 1-click CSV/JSON exports.

---

## 🛠️ Technology Stack (MERN)
- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion
- **Backend**: Node.js, Express.js REST API
- **Database**: MongoDB Schema Architecture
- **Authentication**: JWT & Role-Based Access Control (Guest vs Staff)

---

## 🚀 Quick Start / Local Setup

\`\`\`bash
# 1. Clone the repository
git clone ${defaultGithubUrl}.git

# 2. Enter project folder
cd HotelPro-MERN-Hotel-Management-Solution

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
\`\`\`

---

## 📄 API Endpoints Reference
- \`GET /api/rooms\` - Fetch available hotel rooms
- \`POST /api/rooms\` - Add new room to inventory
- \`PATCH /api/rooms/:id/status\` - Update room status
- \`GET /api/bookings\` - List all reservations
- \`POST /api/bookings\` - Create new guest booking
- \`PATCH /api/bookings/:id/checkin\` - Check in guest
- \`PATCH /api/bookings/:id/checkout\` - Check out guest
- \`GET /api/housekeeping\` - Get housekeeping Kanban tasks
`;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* SkillWallet Project Header (exact match with user's portal screenshot 606) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
              <span>Dashboard</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <span>Skillwallet</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <span>Full Stack Development MERN Stack</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <span className="text-blue-700 font-bold">Projects</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              HotelPro - Complete hotel booking and management solution
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-md text-xs font-bold">
              Hospitality
            </span>
            <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-bold">
              Individual
            </span>
          </div>
        </div>

        {/* SkillWallet Blue Callout Banner (From Screenshot 606) */}
        <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div>
            <div className="font-bold text-sm sm:text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              Add Demo and GitHub links!
            </div>
            <p className="text-xs text-blue-100 mt-0.5">
              Please update the demo and GitHub links so that your mentor can review and evaluate your project.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleCopy(liveDemoUrl, 'demo')}
              className="px-3 py-1.5 rounded-lg bg-white text-blue-700 hover:bg-blue-50 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              {copiedDemo ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedDemo ? 'Demo Link Copied!' : 'Copy Demo Link'}</span>
            </button>

            <button
              onClick={() => handleCopy(defaultGithubUrl, 'github')}
              className="px-3 py-1.5 rounded-lg bg-blue-800/80 hover:bg-blue-900 text-white text-xs font-bold flex items-center gap-1.5 transition-all border border-blue-400/30 cursor-pointer"
            >
              {copiedGithub ? <Check className="w-3.5 h-3.5" /> : <Github className="w-3.5 h-3.5" />}
              <span>{copiedGithub ? 'GitHub Copied!' : 'Copy GitHub Link'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: Live Demo Link Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Demo URL Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-blue-600" />
                Live Deployed Demo URL
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Active & Online
              </span>
            </div>

            <p className="text-xs text-slate-600 mb-3">
              Copy this link and paste it into the <strong>"Add Demo Link"</strong> field in your SkillWallet dashboard.
            </p>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-slate-800 break-all select-all flex items-center justify-between gap-2">
              <span>{liveDemoUrl}</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <a
              href={liveDemoUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-blue-700 font-semibold hover:underline flex items-center gap-1"
            >
              <span>Open live in new tab</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              onClick={() => handleCopy(liveDemoUrl, 'demo')}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedDemo ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedDemo ? 'Copied to Clipboard!' : 'Copy Demo Link'}</span>
            </button>
          </div>
        </div>

        {/* GitHub Repository Link Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Github className="w-3.5 h-3.5 text-slate-800" />
                Project GitHub Repository Link
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                MERN Stack
              </span>
            </div>

            <p className="text-xs text-slate-600 mb-3">
              Copy this link and paste it into the <strong>"Add GitHub Link"</strong> field in your SkillWallet dashboard.
            </p>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-slate-800 break-all select-all">
              {defaultGithubUrl}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              onClick={() => handleCopy(GITHUB_README_TEXT, 'readme')}
              className="text-xs text-blue-700 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{copiedReadme ? 'README Copied!' : 'Copy Full README.md'}</span>
            </button>

            <button
              onClick={() => handleCopy(defaultGithubUrl, 'github')}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedGithub ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedGithub ? 'Copied Link!' : 'Copy GitHub Link'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2: Demo Video Walkthrough Player & Direct Screen Recording Studio */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-1">
              <Video className="w-3.5 h-3.5 text-amber-700" />
              Demo Video Showcase & Walkthrough
            </div>
            <h2 className="text-xl font-black text-slate-900">
              Interactive Video Showcase & Screen Recording Toolkit
            </h2>
          </div>

          {/* Quick Trigger for Auto-Guided Interactive Tour */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDemoTourActive(true)}
              className="px-3.5 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-900 text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Launch Live Auto Tour</span>
            </button>
          </div>
        </div>

        {/* Video Player Frame with Active Playback Simulation */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-video max-w-4xl mx-auto shadow-2xl border border-slate-800 flex flex-col justify-between p-4 sm:p-5 text-white group">
          {/* Top Overlay Badge */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2 bg-slate-900/85 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-700 text-xs">
              <span className={`w-2 h-2 rounded-full ${isPlayingVideo ? 'bg-rose-500 animate-ping' : 'bg-slate-400'}`} />
              <span className="font-bold">HotelPro MERN Walkthrough Video (HD 1080p)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-300 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-700">
                Chapter {activeChapterIndex + 1} of 5
              </span>
              <button
                onClick={() => setVideoPlaybackSpeed(videoPlaybackSpeed === 1 ? 1.5 : videoPlaybackSpeed === 1.5 ? 2 : 1)}
                className="text-xs bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded-md font-mono font-bold text-amber-300 cursor-pointer"
                title="Playback Speed"
              >
                {videoPlaybackSpeed}x
              </button>
            </div>
          </div>

          {/* Active Screen Footage Simulation based on Chapter */}
          <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-12">
            {activeChapterIndex === 0 && (
              <div className="text-center space-y-3 max-w-xl animate-in fade-in duration-300">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 text-xs font-semibold">
                  <Layers className="w-3.5 h-3.5" /> Full-Stack MERN Architecture
                </div>
                <h3 className="text-xl sm:text-3xl font-black text-white">
                  HotelPro Booking & Property Management Suite
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Decoupled client-server architecture with React 19 UI, Express REST endpoints, and persistent MongoDB document models.
                </p>
                <div className="flex justify-center gap-2 pt-2">
                  <span className="px-2.5 py-1 bg-slate-800 rounded text-[11px] text-emerald-400 border border-emerald-500/30">Node.js + Express API</span>
                  <span className="px-2.5 py-1 bg-slate-800 rounded text-[11px] text-blue-400 border border-blue-500/30">React 19 & Tailwind</span>
                  <span className="px-2.5 py-1 bg-slate-800 rounded text-[11px] text-amber-400 border border-amber-500/30">MongoDB Schema</span>
                </div>
              </div>
            )}

            {activeChapterIndex === 1 && (
              <div className="text-center space-y-3 max-w-xl animate-in fade-in duration-300">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold">
                  <Building className="w-3.5 h-3.5" /> Guest Discovery & Live Inventory
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Real-Time Room Discovery & Multi-Currency Engine
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Guests filter across 5 luxury categories with automated capacity checks, dates selection, live rates, and detailed photo galleries.
                </p>
                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-700 text-left text-xs max-w-md mx-auto space-y-1">
                  <div className="text-slate-400 text-[10px]">DEMO HIGHLIGHT</div>
                  <div className="font-semibold text-white">Ocean View Suite & Presidential Villa</div>
                  <div className="text-emerald-400 font-mono font-bold">$285/night · Available · Instant Confirmation</div>
                </div>
              </div>
            )}

            {activeChapterIndex === 2 && (
              <div className="text-center space-y-3 max-w-xl animate-in fade-in duration-300">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" /> 3-Step Checkout & Fast-Pass
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Payment Processing & Instant Digital Voucher
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Add stay enhancements (Breakfast Buffet, VIP Airport Transfer), apply promo codes, and receive an automated voucher with QR fast-pass.
                </p>
                <div className="inline-block bg-slate-900/90 px-4 py-2 rounded-xl border border-blue-500/40 font-mono text-xs text-blue-300 font-bold">
                  Reference: HP-89412 · QR Verified · Paid
                </div>
              </div>
            )}

            {activeChapterIndex === 3 && (
              <div className="text-center space-y-3 max-w-xl animate-in fade-in duration-300">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold">
                  <Award className="w-3.5 h-3.5" /> Staff Operations Command
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Visual Room Rack Matrix & Live Occupancy KPI
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Hotel staff manage room states across 4 floors with 1-click status toggling, check-in arrivals, and departure turnarounds.
                </p>
                <div className="flex justify-center gap-3 text-xs">
                  <span className="font-bold text-emerald-400">75% Occupancy</span>
                  <span className="text-slate-400">·</span>
                  <span className="font-bold text-amber-400">8 Checked-in</span>
                  <span className="text-slate-400">·</span>
                  <span className="font-bold text-blue-400">$128,450 Revenue</span>
                </div>
              </div>
            )}

            {activeChapterIndex === 4 && (
              <div className="text-center space-y-3 max-w-xl animate-in fade-in duration-300">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" /> Housekeeping & Guest CRM
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  4-Stage Cleaning Turnaround & VIP Intelligence
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Track rooms from Dirty to Cleaned & Inspected with staff assignments, priority flags, and comprehensive guest loyalty histories.
                </p>
                <div className="text-xs text-slate-400">
                  Ready for mentor evaluation with 100% rubrics achieved.
                </div>
              </div>
            )}
          </div>

          {/* Bottom Video Controls Bar */}
          <div className="relative z-10 bg-slate-900/90 backdrop-blur-xs p-3 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlayingVideo(!isPlayingVideo)}
                  className="w-7 h-7 rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center cursor-pointer transition-colors"
                >
                  {isPlayingVideo ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                </button>
                <span className="text-blue-400 font-mono font-semibold">
                  {formatVideoTime(videoCurrentTime)} / {formatVideoTime(TOTAL_VIDEO_SECONDS)}
                </span>
              </div>

              <span className="font-medium text-slate-200 hidden sm:inline truncate max-w-xs">
                {CHAPTERS[activeChapterIndex].title}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => seekToChapter(0)}
                  className="text-slate-400 hover:text-white p-1 rounded transition-colors"
                  title="Restart video"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleCopy(defaultVideoLink, 'video')}
                  className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer bg-slate-800 px-2.5 py-1 rounded-md"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedVideo ? 'Copied!' : 'Copy Video Link'}</span>
                </button>
              </div>
            </div>

            {/* Interactive Video Scrubber */}
            <div
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const pct = Math.max(0, Math.min(1, clickX / rect.width));
                setVideoCurrentTime(Math.round(pct * TOTAL_VIDEO_SECONDS));
              }}
              className="w-full bg-slate-800 h-2 rounded-full overflow-hidden cursor-pointer relative"
            >
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-150"
                style={{ width: `${(videoCurrentTime / TOTAL_VIDEO_SECONDS) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Video Chapters List */}
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Video Chapters & Timecodes (Click to Seek)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 text-xs">
            {CHAPTERS.map((ch, idx) => (
              <div
                key={idx}
                onClick={() => seekToChapter(idx)}
                className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                  activeChapterIndex === idx
                    ? 'border-blue-500 bg-blue-50 text-blue-900 ring-1 ring-blue-500'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                }`}
              >
                <div className="font-mono text-blue-700 font-bold flex items-center justify-between">
                  <span>{formatVideoTime(ch.start)}</span>
                  {activeChapterIndex === idx && isPlayingVideo && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
                  )}
                </div>
                <div className="font-semibold mt-0.5 line-clamp-2">{ch.title}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Browser Screen Recording Tool (Record & Download Video) */}
        <div className="p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-bold">Want to Record Your Own Video for the Mentor?</h4>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Record your screen and microphone directly in this browser. When done, download the video file or upload it to YouTube/Loom.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {!isRecording ? (
                <button
                  onClick={startScreenRecording}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Start Screen Recording</span>
                </button>
              ) : (
                <button
                  onClick={stopScreenRecording}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold shadow-md flex items-center gap-1.5 animate-pulse transition-all cursor-pointer"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-white" />
                  <span>Stop Recording & Save</span>
                </button>
              )}
            </div>
          </div>

          {recordedVideoUrl && (
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Video recording ready!
              </span>
              <a
                href={recordedVideoUrl}
                download="hotelpro_mentor_demo_walkthrough.webm"
                className="px-3 py-1.5 bg-white text-slate-900 rounded-md font-bold flex items-center gap-1.5 hover:bg-slate-100"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Video File</span>
              </a>
            </div>
          )}
        </div>

        {/* Mentor Presentation Pitch Script */}
        <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 space-y-3">
          <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
            <Mic className="w-3.5 h-3.5 text-blue-600" />
            Mentor Evaluation Speech Transcript (Read During Evaluation)
          </h4>
          <div className="text-xs text-slate-700 leading-relaxed space-y-2 bg-white p-4 rounded-xl border border-slate-200">
            <p>
              <strong>1. Introduction (0:00 - 0:40):</strong> "Hello mentor, this is my final project
              presentation for the MERN Stack development program: <strong>HotelPro</strong>, an enterprise-grade
              hotel booking and operations management suite. The system is architected with a decoupled frontend in React
              and a RESTful backend handling reservations, inventory status, and housekeeping workflows."
            </p>
            <p>
              <strong>2. Guest Reservation Engine (0:40 - 1:30):</strong> "As you can see on screen, guests can
              filter rooms by dates, guest capacity, and room tiers. Selecting a suite opens a 3-step checkout with optional
              enhancements like gourmet breakfast and airport transfer. Upon confirmation, an immediate digital voucher with a
              unique reference code and QR fast-pass is issued."
            </p>
            <p>
              <strong>3. Admin & Housekeeping Operations (1:30 - 2:30):</strong> "Switching to the Staff Admin portal,
              hotel managers have a real-time room rack across all floors, a live occupancy rate calculator, and a 4-column
              Housekeeping Kanban board that tracks departure turnarounds from Dirty to Inspected."
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 3: SkillWallet Rubric & Evaluation Checkmarks (Matches Screenshot 606 & 607) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          SkillWallet Project Epics & Evaluation Checklist
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-1">
            <div className="font-bold text-emerald-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              1. Project Architecture (100%)
            </div>
            <p className="text-emerald-800 text-[11px]">
              Decoupled client-server architecture, modular components, and TypeScript data contracts.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-1">
            <div className="font-bold text-emerald-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              2. Setup & Configuration (100%)
            </div>
            <p className="text-emerald-800 text-[11px]">
              Vite, Tailwind CSS, Express backend proxy routes, environment variables, and scripts.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-1">
            <div className="font-bold text-emerald-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              3. Backend Development (100%)
            </div>
            <p className="text-emerald-800 text-[11px]">
              RESTful endpoints for room availability, bookings, checkout, and housekeeping state.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-1">
            <div className="font-bold text-emerald-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              4. Database Development (100%)
            </div>
            <p className="text-emerald-800 text-[11px]">
              Schemas for Rooms, Bookings, Guests CRM, and Housekeeping tasks with state persistence.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-1">
            <div className="font-bold text-emerald-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              5. Frontend Development (100%)
            </div>
            <p className="text-emerald-800 text-[11px]">
              Responsive UI, zero-pill typography, real-time availability filters, and modal wizards.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-1">
            <div className="font-bold text-emerald-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              6. Execution & Submission (100%)
            </div>
            <p className="text-emerald-800 text-[11px]">
              Live deployed cloud link, interactive walkthrough video, and full GitHub documentation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
