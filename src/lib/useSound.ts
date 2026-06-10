"use client";

import { useCallback } from "react";

export type SoundType =
  | "click"
  | "hover"
  | "success"
  | "error"
  | "xp"
  | "levelup"
  | "achievement"
  | "timerStart"
  | "timerEnd"
  | "timerTick"
  | "messageSent"
  | "messageReceived"
  | "streak"
  | "quizCorrect"
  | "quizIncorrect"
  | "focusStart"
  | "focusEnd"
  | "notifications";

let audioCtx: AudioContext | null = null;
let enabled = true;
let volume = 0.3;

type WindowWithWebkitAudio = Window & {
  webkitAudioContext?: typeof AudioContext;
};

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextCtor =
      window.AudioContext || (window as WindowWithWebkitAudio).webkitAudioContext;
    if (!AudioContextCtor) {
      throw new Error("Web Audio API is not available in this browser");
    }
    audioCtx = new AudioContextCtor();
  }
  return audioCtx;
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = "sine",
  gainValue = volume,
  delay = 0
) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume();

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime + delay);

    gainNode.gain.setValueAtTime(0, ctx.currentTime + delay);
    gainNode.gain.linearRampToValueAtTime(gainValue, ctx.currentTime + delay + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(ctx.currentTime + delay);
    oscillator.stop(ctx.currentTime + delay + duration);
  } catch {
    // Audio not available
  }
}

function playNoise(duration: number, gainValue = volume * 0.3) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume();

    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(gainValue, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.setValueAtTime(1000, ctx.currentTime);

    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    source.start();
  } catch {
    // Audio not available
  }
}

const sounds: Record<SoundType, () => void> = {
  click: () => {
    playTone(800, 0.05, "sine", volume * 0.5);
  },
  hover: () => {
    playTone(600, 0.03, "sine", volume * 0.2);
  },
  success: () => {
    playTone(523, 0.15, "sine", volume * 0.6);
    playTone(659, 0.15, "sine", volume * 0.6, 0.1);
    playTone(784, 0.2, "sine", volume * 0.6, 0.2);
  },
  error: () => {
    playTone(200, 0.3, "sawtooth", volume * 0.4);
    playTone(150, 0.4, "sawtooth", volume * 0.3, 0.15);
  },
  xp: () => {
    playTone(600, 0.1, "sine", volume * 0.4);
    playTone(800, 0.1, "sine", volume * 0.4, 0.08);
    playTone(1000, 0.15, "sine", volume * 0.4, 0.16);
  },
  levelup: () => {
    playTone(523, 0.2, "sine", volume * 0.5);
    playTone(659, 0.2, "sine", volume * 0.5, 0.15);
    playTone(784, 0.2, "sine", volume * 0.5, 0.3);
    playTone(1047, 0.4, "sine", volume * 0.6, 0.45);
    playNoise(0.3, volume * 0.15);
  },
  achievement: () => {
    playTone(784, 0.15, "sine", volume * 0.5);
    playTone(988, 0.15, "sine", volume * 0.5, 0.12);
    playTone(1175, 0.15, "sine", volume * 0.5, 0.24);
    playTone(1319, 0.3, "sine", volume * 0.6, 0.36);
    playNoise(0.2, volume * 0.1);
  },
  timerStart: () => {
    playTone(440, 0.1, "sine", volume * 0.5);
    playTone(880, 0.15, "sine", volume * 0.4, 0.1);
  },
  timerEnd: () => {
    playTone(880, 0.3, "sine", volume * 0.6);
    playTone(660, 0.3, "sine", volume * 0.6, 0.3);
    playTone(440, 0.3, "sine", volume * 0.6, 0.6);
    playTone(880, 0.5, "sine", volume * 0.7, 0.9);
  },
  timerTick: () => {
    playTone(1000, 0.02, "sine", volume * 0.15);
  },
  messageSent: () => {
    playTone(900, 0.08, "sine", volume * 0.4);
    playTone(1200, 0.08, "sine", volume * 0.3, 0.06);
  },
  messageReceived: () => {
    playTone(600, 0.1, "sine", volume * 0.4);
    playTone(800, 0.08, "sine", volume * 0.3, 0.08);
  },
  streak: () => {
    playTone(523, 0.12, "triangle", volume * 0.4);
    playTone(659, 0.12, "triangle", volume * 0.4, 0.1);
    playTone(784, 0.12, "triangle", volume * 0.4, 0.2);
    playTone(1047, 0.25, "triangle", volume * 0.5, 0.3);
  },
  quizCorrect: () => {
    playTone(523, 0.1, "sine", volume * 0.5);
    playTone(784, 0.15, "sine", volume * 0.5, 0.1);
  },
  quizIncorrect: () => {
    playTone(300, 0.2, "sawtooth", volume * 0.3);
    playTone(200, 0.3, "sawtooth", volume * 0.2, 0.15);
  },
  focusStart: () => {
    playTone(330, 0.2, "triangle", volume * 0.4);
    playTone(440, 0.3, "triangle", volume * 0.4, 0.15);
    playNoise(0.5, volume * 0.08);
  },
  focusEnd: () => {
    playTone(523, 0.3, "triangle", volume * 0.5);
    playTone(392, 0.3, "triangle", volume * 0.4, 0.3);
    playTone(523, 0.5, "triangle", volume * 0.5, 0.6);
  },
  notifications: () => {
    playTone(800, 0.1, "sine", volume * 0.4);
    playTone(600, 0.1, "sine", volume * 0.4, 0.12);
    playTone(800, 0.15, "sine", volume * 0.4, 0.24);
  },
};

export function useSound() {
  const playSound = useCallback((type: SoundType) => {
    sounds[type]?.();
  }, []);

  return { playSound };
}

export function setSoundEnabled(value: boolean) {
  enabled = value;
}

export function setSoundVolume(value: number) {
  volume = Math.max(0, Math.min(1, value));
}

export function isSoundEnabled(): boolean {
  return enabled;
}

export function initSoundOnInteraction() {
  const handler = () => {
    getAudioContext();
    document.removeEventListener("click", handler);
    document.removeEventListener("keydown", handler);
  };
  document.addEventListener("click", handler);
  document.addEventListener("keydown", handler);
}
