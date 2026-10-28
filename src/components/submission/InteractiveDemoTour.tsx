import React, { useState, useEffect } from 'react';
import { useHotel } from '../../context/HotelContext';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  X,
  Sparkles,
  CheckCircle,
  Video,
  Volume2,
  VolumeX,
  ExternalLink,
} from 'lucide-react';

interface TourStep {
  title: string;
  subtitle: string;
  tab: 'guest-rooms' | 'admin-dashboard' | 'admin-rooms' | 'admin-housekeeping' | 'submission-hub';
  narration: string;
  durationSeconds: number;
}

const TOUR_STEPS: TourStep[] = [
  {
    title: 'Welcome to HotelPro Hospitality Suite',
    subtitle: 'MERN Full-Stack Hotel Booking & Operations Architecture',
    tab: 'guest-rooms',
    narration:
      'HotelPro is an end-to-end hotel reservation and property management system designed for boutique hotels and luxury resorts. It connects guest-facing booking with real-time staff operations.',
    durationSeconds: 7,
  },
  {
    title: 'Guest Discovery & Live Room Inventory',
    subtitle: 'Filter by stay dates, capacity, luxury tiers & amenities',
    tab: 'guest-rooms',
    narration:
      'Guests can filter by check-in/out dates, guest count, and room tiers. Live availability tracking ensures zero double-booking, with multi-currency pricing and photo galleries.',
    durationSeconds: 8,
  },
  {
    title: 'Staff Command Center & Real-Time KPIs',
    subtitle: 'Occupancy rate, gross revenue, guest arrivals & departures',
    tab: 'admin-dashboard',
    narration:
      'Hotel managers monitor property health in real time: today’s occupancy rate, live revenue, arrivals/departures queue, and an instant visual room rack across all floors.',
    durationSeconds: 8,
  },
  {
    title: 'Visual Room Rack & Inventory Control',
    subtitle: 'Floor matrix with instantaneous status transitions',
    tab: 'admin-rooms',
    narration:
      'The Room Rack displays each room across 4 floors. Front-desk staff can instantly switch room statuses between Available, Occupied, Cleaning, and Maintenance with full audit trails.',
    durationSeconds: 8,
  },
  {
    title: 'Housekeeping & Room Turnaround Kanban',
    subtitle: 'Departure clean, sanitization, inspection & staff assignment',
    tab: 'admin-housekeeping',
    narration:
      'Operational workflow board tracks rooms from Dirty to Cleaning In-Progress, Cleaned, and Inspected. Housekeepers are assigned with priority tags for incoming arrivals.',
    durationSeconds: 8,
  },
  {
    title: 'SkillWallet Demo Link & Video Submission',
    subtitle: 'Everything needed to submit to your mentor and score 100%',
    tab: 'submission-hub',
    narration:
      'You are now in the submission center. Copy your live deployed Demo Link, preview the interactive video walkthrough, and copy the complete GitHub MERN repository documentation!',
    durationSeconds: 8,
  },
];

export const InteractiveDemoTour: React.FC = () => {
  const { isDemoTourActive, setIsDemoTourActive, setActiveTab } = useHotel();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const step = TOUR_STEPS[currentStepIndex];

  // Sync tab with step
  useEffect(() => {
    if (!isDemoTourActive) return;
    setActiveTab(step.tab);
    setProgress(0);
  }, [currentStepIndex, isDemoTourActive]);

  // Timer loop for auto tour
  useEffect(() => {
    if (!isDemoTourActive || !isPlaying) return;

    const intervalTime = 100; // ms
    const stepDurationMs = step.durationSeconds * 1000;
    const progressIncrement = (intervalTime / stepDurationMs) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentStepIndex < TOUR_STEPS.length - 1) {
            setCurrentStepIndex((curr) => curr + 1);
            return 0;
          } else {
            setIsPlaying(false);
            return 100;
          }
        }
        return prev + progressIncrement;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isDemoTourActive, isPlaying, currentStepIndex, step]);

  if (!isDemoTourActive) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-2xl w-[94%] bg-slate-950/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-slate-700/80 p-5 animate-in slide-in-from-bottom-5 duration-300">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
            <Video className="w-3.5 h-3.5" /> Interactive Demo Tour
          </span>
          <span className="text-xs text-slate-400">
            ({currentStepIndex + 1}/{TOUR_STEPS.length})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
            title={soundEnabled ? 'Mute captions audio' : 'Unmute captions audio'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsDemoTourActive(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Exit Tour"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="py-3">
        <div className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider">
          {step.subtitle}
        </div>
        <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">{step.title}</h3>
        <p className="text-xs text-slate-300 mt-2 leading-relaxed bg-slate-900/80 p-3 rounded-xl border border-slate-800 italic">
          "{step.narration}"
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-3">
        <div
          className="bg-gradient-to-r from-blue-500 to-indigo-400 h-1.5 transition-all duration-100 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (currentStepIndex > 0) {
                setCurrentStepIndex((curr) => curr - 1);
              }
            }}
            disabled={currentStepIndex === 0}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-40 transition-colors"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlaying ? 'Pause' : 'Resume'}</span>
          </button>

          <button
            onClick={() => {
              if (currentStepIndex < TOUR_STEPS.length - 1) {
                setCurrentStepIndex((curr) => curr + 1);
              }
            }}
            disabled={currentStepIndex === TOUR_STEPS.length - 1}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-40 transition-colors"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={() => {
            setIsDemoTourActive(false);
            setActiveTab('submission-hub');
          }}
          className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
        >
          <span>Jump to Submission Hub</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
