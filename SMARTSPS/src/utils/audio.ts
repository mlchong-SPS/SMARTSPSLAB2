/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Modern, robust browser-synthesized audio effects using the Web Audio API.
// No static files required, preventing 404 bugs or volume issues in different environments.

let audioCtx: AudioContext | null = null;
let isMuted = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  return audioCtx;
}

export function toggleMute(): boolean {
  isMuted = !isMuted;
  return isMuted;
}

export function getMuteState(): boolean {
  return isMuted;
}

/**
 * Play a synthesized sound effect based on parameters
 */
function playTone(
  frequencies: number[],
  durationSec: number,
  type: OscillatorType = 'sine',
  staggerMs = 0
) {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  // Resume context if suspended (browser security autoplays)
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const now = ctx.currentTime;

  frequencies.forEach((freq, idx) => {
    const startTime = now + (idx * staggerMs) / 1000;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    // Dynamic smoothing volume envelope to prevent crackling popping
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.18, startTime + 0.03);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + durationSec);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + durationSec + 0.1);
  });
}

/**
 * Sounds API
 */
export const sfx = {
  // Clear, celebratory double ping
  playCorrect: () => {
    playTone([523.25, 659.25], 0.4, 'sine', 80); // C5 then E5 notes
  },

  // Deep, warning buzzer
  playIncorrect: () => {
    playTone([160, 110], 0.35, 'sawtooth', 0); // Dischordant low saw waves
  },

  // Subtle clean tap
  playTap: () => {
    playTone([400], 0.08, 'triangle');
  },

  // Level up fanfare: C4 -> E4 -> G4 -> C5 rapid ascending arpeggio!
  playLevelUp: () => {
    playTone([261.63, 329.63, 392.00, 523.25], 0.7, 'sine', 100);
  },

  // Badge unlocked: mystical sparkling major chord
  playBadgeUnlock: () => {
    playTone([392.00, 493.88, 587.33, 783.99], 0.9, 'triangle', 75); // G4, B4, D5, G5
  }
};
