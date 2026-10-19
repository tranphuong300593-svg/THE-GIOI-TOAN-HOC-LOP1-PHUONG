/**
 * Pure Web Audio API Synthesizer and Web Speech API Unified Audio System
 * Safe, reliable, zero external MP3 dependencies.
 * Specially optimized for Mobile Safari (iOS iPhone/iPad) & Mobile Chrome (Android).
 */

export interface AudioState {
  soundEnabled: boolean;
  volume: number;
  isUnlocked: boolean;
  isSpeechSupported: boolean;
  hasViVoice: boolean;
  ctxState: string;
}

type AudioStateListener = (state: AudioState) => void;

class SoundController {
  private audioCtx: AudioContext | null = null;
  private masterCompressor: DynamicsCompressorNode | null = null;
  private masterGain: GainNode | null = null;
  private _soundEnabled = true;
  private _volume = 1.0;
  private isUnlocked = false;
  private unlockListenersAttached = false;
  private activeVictoryOscillators: { stop: () => void }[] = [];
  private victoryPlaybackId = 0;
  private lastPopTime = 0;
  private lastSpokenText = '';
  private cachedVoices: SpeechSynthesisVoice[] = [];
  private listeners: Set<AudioStateListener> = new Set();

  constructor() {
    // Automatically attach capture listeners on script load
    if (typeof window !== 'undefined') {
      this.setupGlobalUnlock();
      this.initVoiceCache();
    }
  }

  // -------------------------------------------------------------
  // Getters & Setters
  // -------------------------------------------------------------
  public get soundEnabled(): boolean {
    return this._soundEnabled;
  }

  public set soundEnabled(enabled: boolean) {
    this._soundEnabled = enabled;
    this.updateMasterGain();
    this.notifyState();
  }

  public get volume(): number {
    return this._volume;
  }

  public set volume(val: number) {
    this._volume = Math.max(0, Math.min(1, val));
    this.updateMasterGain();
    this.notifyState();
  }

  private updateMasterGain(): void {
    if (this.masterGain && this.audioCtx) {
      try {
        const target = this._soundEnabled ? this._volume : 0.0;
        this.masterGain.gain.cancelScheduledValues(this.audioCtx.currentTime);
        this.masterGain.gain.setValueAtTime(target, this.audioCtx.currentTime);
      } catch {}
    }
  }

  // -------------------------------------------------------------
  // AudioContext Singleton Management
  // -------------------------------------------------------------
  private initCtx(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    if (this.audioCtx && this.audioCtx.state === 'closed') {
      this.audioCtx = null;
      this.masterCompressor = null;
      this.masterGain = null;
      this.isUnlocked = false;
    }

    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        try {
          this.audioCtx = new AudioContextClass();
        } catch (e) {
          console.warn('AudioContext creation failed:', e);
        }
      }
    }

    if (this.audioCtx && !this.masterCompressor) {
      try {
        // Dynamics compressor prevents harsh clipping / distortion on tiny phone speakers
        this.masterCompressor = this.audioCtx.createDynamicsCompressor();
        this.masterCompressor.threshold.setValueAtTime(-16, this.audioCtx.currentTime);
        this.masterCompressor.knee.setValueAtTime(30, this.audioCtx.currentTime);
        this.masterCompressor.ratio.setValueAtTime(12, this.audioCtx.currentTime);
        this.masterCompressor.attack.setValueAtTime(0.003, this.audioCtx.currentTime);
        this.masterCompressor.release.setValueAtTime(0.25, this.audioCtx.currentTime);

        this.masterGain = this.audioCtx.createGain();
        this.masterGain.gain.setValueAtTime(this._soundEnabled ? this._volume : 0.0, this.audioCtx.currentTime);

        this.masterCompressor.connect(this.masterGain);
        this.masterGain.connect(this.audioCtx.destination);
      } catch (e) {
        console.warn('Compressor setup fallback:', e);
      }
    }

    return this.audioCtx;
  }

  public getDestination(ctx: AudioContext): AudioNode {
    return this.masterCompressor || ctx.destination;
  }

  // -------------------------------------------------------------
  // Mobile Unlocking Handshake
  // -------------------------------------------------------------
  public setupGlobalUnlock(): void {
    if (typeof window === 'undefined' || this.unlockListenersAttached) return;
    this.unlockListenersAttached = true;

    const handleUserGesture = () => {
      this.unlockAudio();
    };

    // Use capture phase so stopPropagation in child elements won't block audio unlocking
    const gestureEvents = ['touchstart', 'touchend', 'pointerdown', 'mousedown', 'keydown', 'click'];
    gestureEvents.forEach(evt => {
      window.addEventListener(evt, handleUserGesture, { capture: true, passive: true });
    });

    // Handle iOS & Android backgrounding/foregrounding (interrupted / suspended states)
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          this.resumeIfSuspended();
        }
      });
    }

    window.addEventListener('pageshow', () => {
      this.resumeIfSuspended();
    });
  }

  public unlockAudio(): Promise<boolean> {
    if (typeof window === 'undefined') return Promise.resolve(false);

    return new Promise(resolve => {
      try {
        const ctx = this.initCtx();
        if (!ctx) {
          resolve(false);
          return;
        }

        const handleRunning = () => {
          this.isUnlocked = true;
          this.notifyState();
          resolve(true);
        };

        if (ctx.state === 'suspended' || (ctx.state as any) === 'interrupted') {
          ctx.resume().then(() => {
            handleRunning();
          }).catch(() => {
            resolve(false);
          });
        } else if (ctx.state === 'running') {
          handleRunning();
        }

        // iOS WebKit will not output oscillator sound unless a buffer is played inside user gesture
        if (!this.isUnlocked) {
          try {
            const buffer = ctx.createBuffer(1, 1, 22050);
            const source = ctx.createBufferSource();
            source.buffer = buffer;
            // Direct destination connection fulfills WebKit requirements
            source.connect(ctx.destination);
            source.start(0);

            if (ctx.state === 'running') {
              this.isUnlocked = true;
              this.notifyState();
            }
          } catch {
            // Ignore
          }
        }

        // Also warm up Web Speech API for mobile
        if ('speechSynthesis' in window) {
          try {
            if (window.speechSynthesis.paused) {
              window.speechSynthesis.resume();
            }
          } catch {}
        }
      } catch {
        resolve(false);
      }
    });
  }

  public resumeIfSuspended(): void {
    if (this.audioCtx && (this.audioCtx.state === 'suspended' || (this.audioCtx.state as any) === 'interrupted')) {
      this.audioCtx.resume().then(() => {
        this.isUnlocked = true;
        this.notifyState();
      }).catch(() => {});
    }
  }

  private ensureRunning(callback: (ctx: AudioContext) => void): void {
    if (!this._soundEnabled) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    if (ctx.state === 'suspended' || (ctx.state as any) === 'interrupted') {
      ctx.resume()
        .then(() => {
          this.isUnlocked = true;
          this.notifyState();
          try {
            callback(ctx);
          } catch (e) {
            console.warn('Audio playback error:', e);
          }
        })
        .catch(() => {
          try {
            callback(ctx);
          } catch {}
        });
    } else {
      try {
        callback(ctx);
      } catch (e) {
        console.warn('Audio playback error:', e);
      }
    }
  }

  // -------------------------------------------------------------
  // State Observation API
  // -------------------------------------------------------------
  public getAudioState(): AudioState {
    const isSpeechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
    const hasViVoice = this.cachedVoices.some(v => v.lang.includes('vi') || v.lang.includes('VI'));
    return {
      soundEnabled: this._soundEnabled,
      volume: this._volume,
      isUnlocked: this.isUnlocked || (this.audioCtx?.state === 'running'),
      isSpeechSupported,
      hasViVoice,
      ctxState: this.audioCtx?.state || 'uninitialized'
    };
  }

  public subscribe(listener: AudioStateListener): () => void {
    this.listeners.add(listener);
    listener(this.getAudioState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyState(): void {
    const state = this.getAudioState();
    this.listeners.forEach(fn => {
      try {
        fn(state);
      } catch {}
    });
  }

  // -------------------------------------------------------------
  // Synthesized Sound Effects (Pure Web Audio API)
  // -------------------------------------------------------------

  /**
   * Happy success chime (C5 - E5 - G5 - C6 arpeggio)
   */
  playSuccess() {
    this.ensureRunning(ctx => {
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      const dest = this.getDestination(ctx);

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.25, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(dest);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.4);
      });
    });
  }

  playCorrect() {
    this.playSuccess();
  }

  /**
   * Gentle encouraging "try again" sound (warm dual notes)
   */
  playTryAgain() {
    this.ensureRunning(ctx => {
      const now = ctx.currentTime;
      const notes = [440, 392]; // A4 -> G4
      const dest = this.getDestination(ctx);

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0, now + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.24, now + idx * 0.12 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.28);

        osc.connect(gain);
        gain.connect(dest);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.3);
      });
    });
  }

  playWrong() {
    this.playTryAgain();
  }

  /**
   * Crisp star reward sparkle sound
   */
  playStar() {
    this.ensureRunning(ctx => {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const dest = this.getDestination(ctx);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1174.66, now); // D6
      osc.frequency.exponentialRampToValueAtTime(1760.00, now + 0.2); // A6

      gain.gain.setValueAtTime(0.24, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(now);
      osc.stop(now + 0.3);
    });
  }

  /**
   * Celebration Fanfare when completing a round/lesson
   */
  playFanfare() {
    this.ensureRunning(ctx => {
      const now = ctx.currentTime;
      const dest = this.getDestination(ctx);
      const chords = [
        { freq: 523.25, time: 0 },
        { freq: 659.25, time: 0.1 },
        { freq: 783.99, time: 0.2 },
        { freq: 1046.50, time: 0.35 },
        { freq: 1318.51, time: 0.5 },
      ];

      chords.forEach(({ freq, time }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + time);

        gain.gain.setValueAtTime(0.28, now + time);
        gain.gain.exponentialRampToValueAtTime(0.001, now + time + 0.6);

        osc.connect(gain);
        gain.connect(dest);

        osc.start(now + time);
        osc.stop(now + time + 0.65);
      });
    });
  }

  playVictory() {
    this.playFanfare();
  }

  /**
   * Card click / button tap (throttled to avoid sound pileup on rapid tapping)
   */
  playPop() {
    const nowPerf = typeof performance !== 'undefined' ? performance.now() : Date.now();
    if (nowPerf - this.lastPopTime < 35) return;
    this.lastPopTime = nowPerf;

    this.ensureRunning(ctx => {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const dest = this.getDestination(ctx);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(650, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.06);

      gain.gain.setValueAtTime(0.20, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(now);
      osc.stop(now + 0.07);
    });
  }

  playClick() {
    this.playPop();
  }

  /**
   * Friendly robot companion (Robi) greeting arpeggio
   */
  playRobotGreeting() {
    this.ensureRunning(ctx => {
      const now = ctx.currentTime;
      const dest = this.getDestination(ctx);
      const robotNotes = [
        { freq: 1046.50, time: 0 },    // C6
        { freq: 1318.51, time: 0.08 }, // E6
        { freq: 1567.98, time: 0.16 }, // G6
        { freq: 2093.00, time: 0.24 }  // C7
      ];

      robotNotes.forEach(({ freq, time }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + time);

        gain.gain.setValueAtTime(0.18, now + time);
        gain.gain.exponentialRampToValueAtTime(0.001, now + time + 0.15);

        osc.connect(gain);
        gain.connect(dest);

        osc.start(now + time);
        osc.stop(now + time + 0.18);
      });
    });
  }

  /**
   * Short cute electronic robot beep
   */
  playRobotBeep() {
    this.ensureRunning(ctx => {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const dest = this.getDestination(ctx);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now); // A5
      osc.frequency.setValueAtTime(1320, now + 0.05); // E6

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(now);
      osc.stop(now + 0.13);
    });
  }

  /**
   * Card flipping sound
   */
  playCardFlip() {
    this.ensureRunning(ctx => {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const dest = this.getDestination(ctx);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(now);
      osc.stop(now + 0.1);
    });
  }

  /**
   * Card match celebration chime
   */
  playCardMatch() {
    this.ensureRunning(ctx => {
      const now = ctx.currentTime;
      const dest = this.getDestination(ctx);
      [783.99, 1046.50, 1318.51].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.22, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.25);

        osc.connect(gain);
        gain.connect(dest);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.3);
      });
    });
  }

  /**
   * Balloon pop sound
   */
  playBalloonPop() {
    this.ensureRunning(ctx => {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const dest = this.getDestination(ctx);

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.08);

      gain.gain.setValueAtTime(0.24, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(now);
      osc.stop(now + 0.1);
    });
  }

  /**
   * Fruit caught in basket chime
   */
  playCatch() {
    this.ensureRunning(ctx => {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const dest = this.getDestination(ctx);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.12); // C6

      gain.gain.setValueAtTime(0.24, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(now);
      osc.stop(now + 0.2);
    });
  }

  /**
   * Bowling strike pin crash & triumphant ping
   */
  playBowlingStrike() {
    this.ensureRunning(ctx => {
      const now = ctx.currentTime;
      const dest = this.getDestination(ctx);

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      const gain2 = ctx.createGain();

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(150, now);
      osc1.frequency.exponentialRampToValueAtTime(40, now + 0.35);

      gain1.gain.setValueAtTime(0.26, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc1.connect(gain1);
      gain1.connect(dest);
      osc1.start(now);
      osc1.stop(now + 0.42);

      // High sparkle ping
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1046.5, now + 0.05);
      osc2.frequency.exponentialRampToValueAtTime(1567.98, now + 0.3);

      gain2.gain.setValueAtTime(0.22, now + 0.05);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc2.connect(gain2);
      gain2.connect(dest);
      osc2.start(now + 0.05);
      osc2.stop(now + 0.45);
    });
  }

  /**
   * Level / Round start chime
   */
  playLevelStart() {
    this.ensureRunning(ctx => {
      const now = ctx.currentTime;
      const dest = this.getDestination(ctx);
      [440, 554.37, 659.25].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);

        gain.gain.setValueAtTime(0.20, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.3);

        osc.connect(gain);
        gain.connect(dest);

        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.35);
      });
    });
  }

  stopVictoryGrandMusic() {
    this.victoryPlaybackId++;
    this.activeVictoryOscillators.forEach(item => {
      try {
        item.stop();
      } catch {
        // ignore
      }
    });
    this.activeVictoryOscillators = [];
  }

  /**
   * 10-15s celebratory victory fanfare music with Ting! Ting! Ting! bells & trumpets
   */
  playVictoryGrandMusic() {
    if (!this._soundEnabled) return;
    this.stopVictoryGrandMusic();
    const currentId = ++this.victoryPlaybackId;

    this.ensureRunning(ctx => {
      // If user stopped playback while context was resuming, abort
      if (currentId !== this.victoryPlaybackId) return;

      const now = ctx.currentTime;
      const dest = this.getDestination(ctx);

      const scheduleNote = (
        freq: number, 
        startTime: number, 
        duration: number, 
        type: OscillatorType = 'triangle', 
        gainVal: number = 0.16,
        isBell: boolean = false
      ) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, startTime);

        if (isBell) {
          gain.gain.setValueAtTime(0, startTime);
          gain.gain.linearRampToValueAtTime(gainVal, startTime + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
        } else {
          gain.gain.setValueAtTime(0, startTime);
          gain.gain.linearRampToValueAtTime(gainVal, startTime + 0.04);
          gain.gain.setValueAtTime(gainVal * 0.85, startTime + duration * 0.6);
          gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
        }

        osc.connect(gain);
        gain.connect(dest);

        osc.start(startTime);
        osc.stop(startTime + duration + 0.05);

        this.activeVictoryOscillators.push({
          stop: () => {
            try {
              gain.gain.cancelScheduledValues(ctx.currentTime);
              gain.gain.setValueAtTime(0, ctx.currentTime);
              osc.stop(ctx.currentTime);
            } catch {}
          }
        });
      };

      // 1. TING! TING! TING! Crystal bells intro (0.0s - 0.8s)
      const bells = [
        { freq: 2093.00, time: 0.05, dur: 0.35 }, // C7
        { freq: 2637.02, time: 0.28, dur: 0.35 }, // E7
        { freq: 3135.96, time: 0.50, dur: 0.40 }, // G7
        { freq: 4186.01, time: 0.72, dur: 0.60 }  // C8
      ];
      bells.forEach(b => scheduleNote(b.freq, now + b.time, b.dur, 'sine', 0.20, true));

      // 2. Brass Trumpet Fanfare (0.9s - 2.8s)
      const fanfare = [
        { freq: 261.63, time: 0.90, dur: 0.18 }, // C4
        { freq: 329.63, time: 1.10, dur: 0.18 }, // E4
        { freq: 392.00, time: 1.30, dur: 0.20 }, // G4
        { freq: 523.25, time: 1.55, dur: 0.22 }, // C5
        { freq: 659.25, time: 1.80, dur: 0.22 }, // E5
        { freq: 783.99, time: 2.05, dur: 0.26 }, // G5
        { freq: 1046.50, time: 2.35, dur: 0.65 } // C6 (grand hold)
      ];
      fanfare.forEach(f => scheduleNote(f.freq, now + f.time, f.dur, 'sawtooth', 0.15));

      scheduleNote(523.25, now + 2.35, 0.65, 'triangle', 0.16);
      scheduleNote(659.25, now + 2.35, 0.65, 'triangle', 0.14);
      scheduleNote(783.99, now + 2.35, 0.65, 'triangle', 0.14);

      // 3. Cheerful Joyful Victory Melody (approx 3.0s to 12.0s)
      const melodyNotes = [
        { freq: 659.25, time: 3.10, dur: 0.25 },
        { freq: 659.25, time: 3.40, dur: 0.25 },
        { freq: 698.46, time: 3.70, dur: 0.25 },
        { freq: 783.99, time: 4.00, dur: 0.40 },
        { freq: 783.99, time: 4.45, dur: 0.25 },
        { freq: 698.46, time: 4.75, dur: 0.25 },
        { freq: 659.25, time: 5.05, dur: 0.25 },
        { freq: 587.33, time: 5.35, dur: 0.35 },

        { freq: 523.25, time: 5.75, dur: 0.25 },
        { freq: 523.25, time: 6.05, dur: 0.25 },
        { freq: 587.33, time: 6.35, dur: 0.25 },
        { freq: 659.25, time: 6.65, dur: 0.45 },
        { freq: 659.25, time: 7.15, dur: 0.28 },
        { freq: 587.33, time: 7.45, dur: 0.55 },

        { freq: 659.25, time: 8.10, dur: 0.25 },
        { freq: 783.99, time: 8.40, dur: 0.25 },
        { freq: 880.00, time: 8.70, dur: 0.30 },
        { freq: 783.99, time: 9.05, dur: 0.30 },
        { freq: 1046.50, time: 9.40, dur: 0.40 },
        { freq: 1174.66, time: 9.85, dur: 0.35 },
        { freq: 1318.51, time: 10.25, dur: 0.65 },

        { freq: 523.25, time: 11.0, dur: 1.8 },
        { freq: 659.25, time: 11.0, dur: 1.8 },
        { freq: 783.99, time: 11.0, dur: 1.8 },
        { freq: 1046.50, time: 11.0, dur: 1.8 }
      ];

      melodyNotes.forEach(m => {
        scheduleNote(m.freq, now + m.time, m.dur, 'triangle', 0.18);
        if (m.dur >= 0.35) {
          scheduleNote(m.freq * 2, now + m.time, m.dur * 0.7, 'sine', 0.10, true);
        }
      });

      // 4. Bass Line
      const bassNotes = [
        { freq: 130.81, time: 3.1, dur: 0.5 },
        { freq: 196.00, time: 3.7, dur: 0.5 },
        { freq: 130.81, time: 4.4, dur: 0.5 },
        { freq: 174.61, time: 5.0, dur: 0.5 },
        { freq: 130.81, time: 5.7, dur: 0.5 },
        { freq: 196.00, time: 6.3, dur: 0.5 },
        { freq: 130.81, time: 7.1, dur: 0.6 },
        { freq: 196.00, time: 7.8, dur: 0.5 },
        { freq: 130.81, time: 8.4, dur: 0.5 },
        { freq: 174.61, time: 9.0, dur: 0.5 },
        { freq: 196.00, time: 9.8, dur: 0.5 },
        { freq: 130.81, time: 10.4, dur: 0.8 },
        { freq: 65.41, time: 11.0, dur: 2.0 }
      ];
      bassNotes.forEach(b => scheduleNote(b.freq, now + b.time, b.dur, 'sine', 0.20));

      // 5. Star chimes
      const sparkles = [3.5, 4.8, 6.2, 7.5, 8.8, 10.1, 11.3, 11.7, 12.1];
      sparkles.forEach((t, i) => {
        const bellFreq = [2637, 3136, 3520, 4186, 2637, 3136, 4186, 5274, 6272][i];
        scheduleNote(bellFreq, now + t, 0.4, 'sine', 0.12, true);
      });
    });
  }

  /**
   * Immediately stops all active celebratory sounds and cancels ongoing speech synthesis.
   * Useful when navigating away from a completed lesson or game.
   */
  public stopAll(): void {
    this.stopVictoryGrandMusic();
    this.stopSpeaking();
  }

  // -------------------------------------------------------------
  // Web Speech API – Vietnamese Voiceover for Grade 1
  // -------------------------------------------------------------
  private initVoiceCache(): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      this.cachedVoices = window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        try {
          this.cachedVoices = window.speechSynthesis.getVoices();
          this.notifyState();
        } catch {}
      };
    } catch {}
  }

  public stopSpeaking(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
  }

  /**
   * Reads Vietnamese instruction aloud clearly and gently for first-graders
   */
  speakVietnamese(text: string, onEnd?: () => void) {
    if (!this._soundEnabled || typeof window === 'undefined') return;

    this.lastSpokenText = text;

    if (!('speechSynthesis' in window)) {
      // Fallback: play friendly robot chime so child knows instruction was triggered
      this.playRobotGreeting();
      if (onEnd) setTimeout(onEnd, 600);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.90; // Gentle, clear speed for 6-7 year olds
      utterance.pitch = 1.08; // Warm, encouraging tone
      utterance.volume = this._volume;

      // Select Vietnamese voice
      const voices = this.cachedVoices.length > 0 ? this.cachedVoices : window.speechSynthesis.getVoices();
      const viVoices = voices.filter(v => v.lang.includes('vi') || v.lang.includes('VI'));
      
      if (viVoices.length > 0) {
        // Prioritize natural female Vietnamese voices if available
        const femaleVoice = viVoices.find(v => 
          /female|nữ|mai|linh|chi|hoa|an/i.test(v.name)
        );
        utterance.voice = femaleVoice || viVoices[0];
      }

      if (onEnd) {
        utterance.onend = () => {
          onEnd();
        };
        utterance.onerror = () => {
          onEnd();
        };
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      // Safe fallback if speech synthesis throws
      this.playRobotGreeting();
      if (onEnd) setTimeout(onEnd, 600);
    }
  }

  /**
   * Replays the last spoken instruction (for the "Đọc lại 🔊" button)
   */
  replayLastInstruction() {
    if (this.lastSpokenText) {
      this.speakVietnamese(this.lastSpokenText);
    } else {
      this.playRobotBeep();
    }
  }
}

export const soundManager = new SoundController();
