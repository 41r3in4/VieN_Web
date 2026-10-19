// Web Audio API Synthesizer for Authentic Heritage Ambiance & Sound Effects
// 100% self-contained, no external MP3 dependencies, works completely offline.

class HeritageAudioSystem {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private ambientOscillators: { osc: OscillatorNode; gain: GainNode }[] = [];
  private isAmbientPlaying: boolean = false;

  private initContext() {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.isAmbientPlaying) {
      this.stopAmbient();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Soft tactile click for UI buttons
  public playClick() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // AudioContext policy fallback
    }
  }

  // Pentatonic chime when unlocking checkpoint or correct answer
  public playSuccessChime() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      // Vietnamese traditional pentatonic pitches (C, D, F, G, A)
      const freqs = [523.25, 659.25, 783.99, 1046.5];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

        const startTime = ctx.currentTime + idx * 0.08;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.15, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.45);
      });
    } catch {
      // ignore
    }
  }

  // Deep resonant ancient temple gong
  public playGong() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const baseFreq = 110; // A2 deep bell
      const harmonics = [1, 1.42, 2.05, 2.76, 3.8];

      harmonics.forEach((mult, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = i === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(baseFreq * mult, ctx.currentTime);

        const duration = 2.5 - i * 0.3;
        gain.gain.setValueAtTime(0.2 / (i + 1), ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + duration);
      });
    } catch {
      // ignore
    }
  }

  // Scan QR / NFC laser sweep sound
  public playScanSuccess() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';

      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.15);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch {
      // ignore
    }
  }

  // Victory fanfare on badge acquisition
  public playFanfare() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const notes = [440, 554.37, 659.25, 880, 1108.73];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);

        const startTime = ctx.currentTime + idx * 0.1;
        gain.gain.setValueAtTime(0.18, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.65);
      });
    } catch {
      // ignore
    }
  }

  // Ambient cultural drone (harmonious bamboo flute-like warm soundscape)
  public toggleAmbient(): boolean {
    if (this.isAmbientPlaying) {
      this.stopAmbient();
      return false;
    } else {
      this.startAmbient();
      return true;
    }
  }

  public startAmbient() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    this.stopAmbient();

    try {
      const droneFreqs = [146.83, 220.0, 293.66, 440.0]; // D pentatonic drone
      droneFreqs.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Gentle volume for background meditation
        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.02, ctx.currentTime + 2.0);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        this.ambientOscillators.push({ osc, gain });
      });

      this.isAmbientPlaying = true;
    } catch {
      // ignore
    }
  }

  public stopAmbient() {
    if (this.ambientOscillators.length > 0 && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        this.ambientOscillators.forEach(({ osc, gain }) => {
          gain.gain.linearRampToValueAtTime(0.0001, now + 0.8);
          osc.stop(now + 0.85);
        });
      } catch {
        // ignore
      }
      this.ambientOscillators = [];
    }
    this.isAmbientPlaying = false;
  }

  public getIsAmbientPlaying(): boolean {
    return this.isAmbientPlaying;
  }
}

export const heritageAudio = new HeritageAudioSystem();
