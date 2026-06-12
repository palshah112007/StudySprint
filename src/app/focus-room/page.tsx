"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Music,
  Maximize2,
  Minimize2,
  Sparkles,
  Brain,
  BarChart3,
  Cloud,
  Waves,
  TreePine,
  Flame,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { useSound } from "@/lib/useSound";
import { toast } from "@/components/ui/Toaster";
import { saveSessionLog } from "@/lib/persistence";

const focusDurations = [
  { label: "Sprint", mins: 25, desc: "Standard focus" },
  { label: "Deep", mins: 45, desc: "Deep work" },
  { label: "Marathon", mins: 60, desc: "Extended focus" },
];

const backgrounds = [
  { id: "default", name: "Deep Space", icon: Sparkles, gradient: "from-surface-950 via-primary-950/30 to-surface-950", orb: "orb-deep-space" },
  { id: "ocean", name: "Ocean Depths", icon: Waves, gradient: "from-surface-950 via-blue-950/30 to-surface-950", orb: "orb-ocean" },
  { id: "forest", name: "Forest", icon: TreePine, gradient: "from-surface-950 via-emerald-950/30 to-surface-950", orb: "orb-forest" },
  { id: "clouds", name: "Clouds", icon: Cloud, gradient: "from-surface-950 via-surface-800/50 to-surface-950", orb: "orb-deep-space" },
];

const sounds = [
  { name: "Rain", icon: Cloud, active: false },
  { name: "Waves", icon: Waves, active: false },
  { name: "Lofi", icon: Music, active: true },
  { name: "Nature", icon: TreePine, active: false },
];

const particles = Array.from({ length: 20 }, (_, id) => ({
  id,
  left: `${(id * 37) % 100}%`,
  top: `${(id * 53) % 100}%`,
  duration: 3 + (id % 5),
  delay: (id % 6) * 0.35,
}));

const sessionStatTextClasses = {
  primary: "text-primary-400",
  accent: "text-accent-400",
  amber: "text-amber-400",
  purple: "text-purple-400",
} as const;

// Ambient sound generator using Web Audio API
let ambientCtx: AudioContext | null = null;
let ambientNodes: { source?: AudioBufferSourceNode; gain?: GainNode; filter?: BiquadFilterNode } = {};
let ambientPlaying = false;

type WindowWithWebkitAudio = Window & {
  webkitAudioContext?: typeof AudioContext;
};

function startAmbientSound(type: string) {
  try {
    if (!ambientCtx) {
      const AudioContextCtor =
        window.AudioContext || (window as WindowWithWebkitAudio).webkitAudioContext;
      if (!AudioContextCtor) return;
      ambientCtx = new AudioContextCtor();
    }
    if (ambientCtx.state === "suspended") ambientCtx.resume();

    stopAmbientSound();

    const gainNode = ambientCtx.createGain();
    gainNode.gain.setValueAtTime(0.08, ambientCtx.currentTime);
    gainNode.connect(ambientCtx.destination);

    const filter = ambientCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(800, ambientCtx.currentTime);

    if (type === "rain") {
      // Rain: filtered noise with slow modulation
      const bufferSize = ambientCtx.sampleRate * 2;
      const buffer = ambientCtx.createBuffer(1, bufferSize, ambientCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const source = ambientCtx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      filter.frequency.setValueAtTime(2000, ambientCtx.currentTime);
      source.connect(filter);
      filter.connect(gainNode);
      source.start();
      ambientNodes = { source, gain: gainNode, filter };
      ambientPlaying = true;
    } else if (type === "waves") {
      // Waves: slow sine wave modulation
      const osc = ambientCtx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(60, ambientCtx.currentTime);
      const waveGain = ambientCtx.createGain();
      waveGain.gain.setValueAtTime(0.15, ambientCtx.currentTime);
      // LFO for wave effect
      const lfo = ambientCtx.createOscillator();
      lfo.frequency.setValueAtTime(0.1, ambientCtx.currentTime);
      const lfoGain = ambientCtx.createGain();
      lfoGain.gain.setValueAtTime(40, ambientCtx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      osc.connect(waveGain);
      waveGain.connect(ambientCtx.destination);
      osc.start();
      lfo.start();
      ambientNodes = { gain: waveGain };
      ambientPlaying = true;
    } else if (type === "lofi") {
      // Lofi: soft pad chord
      const frequencies = [261.63, 329.63, 392.00, 523.25];
      frequencies.forEach((freq) => {
        const o = ambientCtx!.createOscillator();
        o.type = "sine";
        o.frequency.setValueAtTime(freq, ambientCtx!.currentTime);
        const g = ambientCtx!.createGain();
        g.gain.setValueAtTime(0.03, ambientCtx!.currentTime);
        o.connect(g);
        g.connect(ambientCtx!.destination);
        o.start();
      });
      ambientPlaying = true;
    } else if (type === "nature") {
      // Nature: birds chirp-like tones
      const scheduleChirp = () => {
        if (!ambientPlaying || !ambientCtx) return;
        const delay = Math.random() * 3 + 1;
        setTimeout(() => {
          if (!ambientPlaying) return;
          const chirp = ambientCtx!.createOscillator();
          chirp.type = "sine";
          const chirpFreq = 2000 + Math.random() * 2000;
          chirp.frequency.setValueAtTime(chirpFreq, ambientCtx!.currentTime);
          const chirpGain = ambientCtx!.createGain();
          chirpGain.gain.setValueAtTime(0, ambientCtx!.currentTime);
          chirpGain.gain.linearRampToValueAtTime(0.05, ambientCtx!.currentTime + 0.05);
          chirpGain.gain.exponentialRampToValueAtTime(0.001, ambientCtx!.currentTime + 0.2);
          chirp.connect(chirpGain);
          chirpGain.connect(ambientCtx!.destination);
          chirp.start();
          chirp.stop(ambientCtx!.currentTime + 0.3);
          scheduleChirp();
        }, delay * 1000);
      };
      scheduleChirp();
      ambientPlaying = true;
    }
  } catch {
    // Ambient audio not available
  }
}

function stopAmbientSound() {
  ambientPlaying = false;
  try {
    if (ambientNodes.source) {
      ambientNodes.source.stop();
      ambientNodes.source.disconnect();
    }
  } catch { /* ignore */ }
  ambientNodes = {};
}

export default function FocusRoomPage() {
  const [mode, setMode] = useState<"focus" | "break">("focus");
  const [selectedDuration, setSelectedDuration] = useState(focusDurations[0]);
  const [timeLeft, setTimeLeft] = useState(selectedDuration.mins * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedBg, setSelectedBg] = useState(backgrounds[0]);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [selectedSound, setSelectedSound] = useState("lofi");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const tickRef = useRef<NodeJS.Timeout | null>(null);
  const { playSound } = useSound();

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = 1 - timeLeft / (selectedDuration.mins * 60);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setMode("break");
            const completed = sessionsCompleted + 1;
            setSessionsCompleted(completed);
            playSound("timerEnd");

            // Save session log
            saveSessionLog({
              date: new Date().toISOString().split("T")[0],
              focusMinutes: selectedDuration.mins,
              quizzesCompleted: 0,
              problemsSolved: 0,
              xpEarned: Math.round(selectedDuration.mins * 2),
              focusScore: Math.floor(80 + Math.random() * 15),
            });

            // Dispatch XP toast event
            const sessionXp = Math.round(selectedDuration.mins * 2);
            window.dispatchEvent(new CustomEvent("studysprint-xp-earned", {
              detail: { xp: sessionXp, message: `Focus Session Complete! +${sessionXp} XP` },
            }));

            toast("🎉 Session complete! Great focus! Take a 5-minute break.", "success");
            return 5 * 60;
          }
          return prev - 1;
        });
      }, 1000);

      // Tick sound every 10 seconds
      tickRef.current = setInterval(() => {
        playSound("timerTick");
      }, 10000);

      playSound("timerStart");
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [isRunning, selectedDuration.mins, sessionsCompleted, playSound]);

  const handleDurationSelect = (d: typeof focusDurations[0]) => {
    playSound("click");
    setSelectedDuration(d);
    setTimeLeft(d.mins * 60);
    setIsRunning(false);
    setMode("focus");
  };

  const handleReset = () => {
    playSound("click");
    setIsRunning(false);
    setTimeLeft(selectedDuration.mins * 60);
    setMode("focus");
  };

  const toggleFullscreen = () => {
    playSound("click");
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const toggleSound = useCallback((name: string) => {
    playSound("click");
    if (selectedSound === name) {
      setSelectedSound("");
      stopAmbientSound();
    } else {
      setSelectedSound(name);
      startAmbientSound(name.toLowerCase());
    }
  }, [selectedSound, playSound]);

  // Cleanup ambient on unmount
  useEffect(() => {
    return () => stopAmbientSound();
  }, []);

  return (
    <div
      className={cn(
        "min-h-screen transition-all duration-1000",
        isFullscreen ? "fixed inset-0 z-[999]" : "relative",
        `bg-gradient-to-b ${selectedBg.gradient}`
      )}
    >
      {/* Animated gradient orb */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={cn(
          "absolute top-1/3 left-1/3 w-[400px] h-[400px] rounded-full blur-[120px]",
          selectedBg.orb
        )} />

        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-primary-400/20 rounded-full"
            style={{
              left: particle.left,
              top: particle.top,
            }}
            animate={{
              opacity: [0.1, 0.5, 0.1],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-surface-100 flex items-center gap-3">
              <Timer className="w-6 h-6 text-primary-400" />
              Focus Room
            </h1>
            <p className="text-sm text-surface-400 mt-1">
              {sessionsCompleted} sessions completed today
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Timer section */}
          <div className="lg:col-span-2">
            <div className="flex flex-col items-center">
              {/* Mode indicator */}
              <Badge
                variant={mode === "focus" ? "primary" : "accent"}
                size="md"
                className="mb-6"
                pulse={isRunning}
              >
                <Brain className="w-3 h-3" />
                {mode === "focus" ? "Focus Time" : "Break Time"}
              </Badge>

              {/* Timer */}
              <div className="relative mb-8">
                <svg className="w-72 h-72 sm:w-80 sm:h-80 -rotate-90" viewBox="0 0 200 200">
                  <circle
                    cx="100"
                    cy="100"
                    r="88"
                    fill="none"
                    stroke="rgba(99,102,241,0.1)"
                    strokeWidth="6"
                  />
                  <motion.circle
                    cx="100"
                    cy="100"
                    r="88"
                    fill="none"
                    stroke={mode === "focus" ? "#6366f1" : "#2dd4bf"}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${progress * 552.92} 552.92`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.div
                    key={isRunning ? "running" : "paused"}
                    animate={isRunning ? { scale: [1, 1.03, 1] } : { scale: 1 }}
                    transition={{ duration: 2, repeat: isRunning ? Infinity : 0 }}
                    className="text-6xl sm:text-7xl font-bold text-surface-100 tabular-nums"
                  >
                    {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                  </motion.div>
                  <p className="text-sm text-surface-500 mt-2">
                    {selectedDuration.label} Session
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4 mb-8">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={handleReset}
                  className="w-14 h-14 !rounded-full !p-0"
                >
                  <RotateCcw className="w-5 h-5" />
                </Button>
                <Button
                  variant="gradient"
                  size="xl"
                  glow
                  onClick={() => {
                    playSound(isRunning ? "click" : "focusStart");
                    setIsRunning(!isRunning);
                  }}
                  className="w-20 h-20 !rounded-full !p-0"
                >
                  <motion.div
                    animate={isRunning ? { rotate: 360 } : { rotate: 0 }}
                    transition={{ duration: 2, repeat: isRunning ? Infinity : 0, ease: "linear" }}
                  >
                    {isRunning ? (
                      <Pause className="w-8 h-8" />
                    ) : (
                      <Play className="w-8 h-8 ml-1" />
                    )}
                  </motion.div>
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-14 h-14 !rounded-full !p-0"
                  onClick={() => {
                    playSound("streak");
                    toast("🔥 12-day streak! You're on fire! Keep studying daily to maintain it.", "success");
                  }}
                >
                  <Flame className="w-5 h-5" />
                </Button>
              </div>

              {/* Duration selector */}
              <div className="flex gap-3">
                {focusDurations.map((d) => (
                  <motion.button
                    key={d.label}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDurationSelect(d)}
                    className={cn(
                      "glass-card rounded-xl px-5 py-3 text-center cursor-pointer min-w-[100px]",
                      selectedDuration.label === d.label && "border-primary-500/30 ring-1 ring-primary-500/20"
                    )}
                  >
                    <p className="text-lg font-bold text-surface-200">{d.mins}</p>
                    <p className="text-[10px] text-surface-500">{d.label}</p>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Side panel */}
          <div className="space-y-6">
            {/* Session Stats */}
            <Card>
              <CardContent>
                <h3 className="text-sm font-semibold text-surface-200 mb-4">Session Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Today", value: `${sessionsCompleted}`, icon: Timer, color: "primary" },
                    { label: "Focus Time", value: "3.2h", icon: Brain, color: "accent" },
                    { label: "Streak", value: "12 days", icon: Flame, color: "amber" },
                    { label: "Productivity", value: "92%", icon: BarChart3, color: "purple" },
                  ].map((stat) => (
                    <div key={stat.label} className="glass-light rounded-lg p-3 text-center">
                      <stat.icon className={cn("w-4 h-4 mx-auto mb-1", sessionStatTextClasses[stat.color as keyof typeof sessionStatTextClasses])} />
                      <p className="text-lg font-bold text-surface-200">{stat.value}</p>
                      <p className="text-[10px] text-surface-500">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Background Themes */}
            <Card>
              <CardContent>
                <h3 className="text-sm font-semibold text-surface-200 mb-4">Ambiance</h3>
                <div className="grid grid-cols-2 gap-2">
                  {backgrounds.map((bg) => (
                    <button
                      key={bg.id}
                      onClick={() => { playSound("click"); setSelectedBg(bg); }}
                      className={cn(
                        "glass-light rounded-lg p-3 text-center transition-all cursor-pointer",
                        selectedBg.id === bg.id && "ring-1 ring-primary-500/30 bg-primary-500/10"
                      )}
                    >
                      <bg.icon className="w-4 h-4 mx-auto mb-1 text-surface-400" />
                      <p className="text-xs text-surface-400">{bg.name}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Sound Mixer with working ambient sounds */}
            <Card>
              <CardContent>
                <h3 className="text-sm font-semibold text-surface-200 mb-4">
                  <Volume2 className="w-4 h-4 inline mr-2 text-primary-400" />
                  Soundscape
                </h3>
                <div className="space-y-2">
                  {sounds.map((sound) => (
                    <button
                      key={sound.name}
                      onClick={() => toggleSound(sound.name)}
                      className={cn(
                        "glass-light rounded-lg px-3 py-2.5 flex items-center justify-between w-full cursor-pointer transition-all",
                        selectedSound === sound.name
                          ? "bg-primary-500/15 ring-1 ring-primary-500/30"
                          : "hover:bg-surface-700/30"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <sound.icon className={cn(
                          "w-3.5 h-3.5",
                          selectedSound === sound.name ? "text-primary-400" : "text-surface-400"
                        )} />
                        <span className={cn(
                          "text-sm",
                          selectedSound === sound.name ? "text-surface-200 font-medium" : "text-surface-300"
                        )}>{sound.name}</span>
                      </div>
                      <div
                        className={cn(
                          "w-8 h-4 rounded-full transition-colors relative",
                          selectedSound === sound.name ? "bg-primary-600" : "bg-surface-700"
                        )}
                      >
                        <div
                          className={cn(
                            "w-3 h-3 rounded-full bg-white mt-0.5 transition-all shadow-sm",
                            selectedSound === sound.name ? "translate-x-[18px]" : "translate-x-[2px]"
                          )}
                        />
                      </div>
                    </button>
                  ))}
                </div>
                {selectedSound && (
                  <p className="text-[10px] text-surface-600 mt-3 text-center">
                    ✦ {selectedSound} ambient playing — click to toggle
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
