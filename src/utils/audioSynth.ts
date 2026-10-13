/**
 * Procedural Audio Synthesizer for Roseram Video Studio
 * Generates UI clicks, keyboard clatter, success chimes, and lo-fi tech ambient background
 * using the native Web Audio API with zero external asset dependencies.
 */

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private bgGain: GainNode | null = null;
  private bgOsc1: OscillatorNode | null = null;
  private bgOsc2: OscillatorNode | null = null;
  private isBgPlaying: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Soft subtle mouse click blip
  playClick() {
    try {
      const ctx = this.initCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // Audio context might be restricted before user gesture
    }
  }

  // Keyboard key press tap
  playKeypress() {
    try {
      const ctx = this.initCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260 + Math.random() * 80, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.03);

      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } catch {}
  }

  // Uplifting chord chime for build success or proposal accepted
  playSuccessChime() {
    try {
      const ctx = this.initCtx();
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0.06, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.4);
      });
    } catch {}
  }

  // Gentle ambient electronic tech drone for tutorial background
  startAmbientMusic(volume = 0.02) {
    if (this.isBgPlaying) return;
    try {
      const ctx = this.initCtx();
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(380, ctx.currentTime);

      this.bgGain = ctx.createGain();
      this.bgGain.gain.setValueAtTime(0.001, ctx.currentTime);
      this.bgGain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 2);

      this.bgOsc1 = ctx.createOscillator();
      this.bgOsc1.type = 'sine';
      this.bgOsc1.frequency.setValueAtTime(110, ctx.currentTime); // A2

      this.bgOsc2 = ctx.createOscillator();
      this.bgOsc2.type = 'triangle';
      this.bgOsc2.frequency.setValueAtTime(164.81, ctx.currentTime); // E3

      this.bgOsc1.connect(filter);
      this.bgOsc2.connect(filter);
      filter.connect(this.bgGain);
      this.bgGain.connect(ctx.destination);

      this.bgOsc1.start();
      this.bgOsc2.start();
      this.isBgPlaying = true;
    } catch {}
  }

  stopAmbientMusic() {
    if (!this.isBgPlaying) return;
    try {
      if (this.bgGain && this.ctx) {
        this.bgGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);
      }
      setTimeout(() => {
        try {
          this.bgOsc1?.stop();
          this.bgOsc2?.stop();
          this.bgOsc1?.disconnect();
          this.bgOsc2?.disconnect();
          this.isBgPlaying = false;
        } catch {}
      }, 900);
    } catch {
      this.isBgPlaying = false;
    }
  }

  setAmbientVolume(vol: number) {
    if (this.bgGain && this.ctx) {
      this.bgGain.gain.setValueAtTime(Math.max(0, Math.min(0.1, vol)), this.ctx.currentTime);
    }
  }
}

export const audioSynth = new AudioSynthesizer();
