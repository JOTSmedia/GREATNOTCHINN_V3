/**
 * THE GREAT NOTCH INN — Web Audio Soundboard & Ambient Blues Engine
 * Synthesizes vintage blues chords, overdriven guitar licks, and tavern atmosphere.
 */

class RoadhouseSoundboard {
  constructor() {
    this.ctx = null;
    this.isPlayingAmbient = false;
    this.ambientNodes = [];
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Synthesize an overdriven blues guitar lick using oscillators + waveshaper distortion
  playBluesLick(type = 'pentatonic') {
    this.init();
    const now = this.ctx.currentTime;

    // Guitar lick frequencies (Key of E Blues)
    const licks = {
      pentatonic: [164.81, 196.00, 220.00, 233.08, 246.94, 293.66, 329.63], // E3 Blues Scale
      riff: [164.81, 246.94, 293.66, 329.63, 293.66, 246.94, 164.81],
      powerchord: [82.41, 123.47, 164.81], // E5 Power Chord
      harmonica: [587.33, 659.25, 783.99], // D5, E5, G5 harmonica trill
      crowd: 'cheer'
    };

    if (type === 'powerchord') {
      this.playDistortedChord(licks.powerchord, 1.8);
      return;
    }

    if (type === 'harmonica') {
      this.playHarmonicaTrill(licks.harmonica, 1.5);
      return;
    }

    const notes = licks[type] || licks.pentatonic;
    const noteDuration = 0.18;

    notes.forEach((freq, idx) => {
      const startTime = now + (idx * noteDuration);
      this.synthesizeGuitarNote(freq, startTime, noteDuration * 1.5);
    });
  }

  synthesizeGuitarNote(freq, startTime, duration) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    const distortion = this.createDistortionCurve(25);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, startTime);
    // Slight pitch bend for authentic blues feel
    osc.frequency.exponentialRampToValueAtTime(freq * 1.03, startTime + 0.05);
    osc.frequency.exponentialRampToValueAtTime(freq, startTime + 0.12);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1800, startTime);
    filter.frequency.exponentialRampToValueAtTime(600, startTime + duration);

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(0.22, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    const shaper = this.ctx.createWaveShaper();
    shaper.curve = distortion;
    shaper.oversample = '4x';

    osc.connect(shaper);
    shaper.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  playDistortedChord(frequencies, duration = 2.0) {
    const now = this.ctx.currentTime;
    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(0.3, now);
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    const shaper = this.ctx.createWaveShaper();
    shaper.curve = this.createDistortionCurve(40);
    shaper.oversample = '4x';

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2200, now);
    filter.frequency.exponentialRampToValueAtTime(800, now + duration);

    shaper.connect(filter);
    filter.connect(masterGain);
    masterGain.connect(this.ctx.destination);

    frequencies.forEach(freq => {
      const osc = this.ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);
      osc.connect(shaper);
      osc.start(now);
      osc.stop(now + duration);
    });
  }

  playHarmonicaTrill(frequencies, duration = 1.6) {
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(frequencies[0], now);

    // Vibrato LFO
    lfo.frequency.setValueAtTime(6.5, now);
    lfoGain.gain.setValueAtTime(14, now);
    lfo.connect(osc.frequency);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    lfo.start(now);
    osc.start(now);
    lfo.stop(now + duration);
    osc.stop(now + duration);
  }

  createDistortionCurve(amount = 20) {
    const k = typeof amount === 'number' ? amount : 50;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }

  toggleAmbientTavern() {
    this.init();
    const miniBar = document.querySelector('.audio-mini-bar');
    const playIcon = document.getElementById('ambientPlayIcon');

    if (this.isPlayingAmbient) {
      // Stop
      this.ambientNodes.forEach(node => {
        try { node.stop(); } catch(e){}
        try { node.disconnect(); } catch(e){}
      });
      this.ambientNodes = [];
      this.isPlayingAmbient = false;
      if (miniBar) miniBar.classList.remove('playing');
      if (playIcon) playIcon.className = 'fas fa-play';
      return false;
    } else {
      // Start roadhouse blues warm drone & amp hum
      const now = this.ctx.currentTime;
      
      // Bass amp drone (Root E 41.2Hz / 82.4Hz)
      const droneOsc = this.ctx.createOscillator();
      const droneGain = this.ctx.createGain();
      droneOsc.type = 'triangle';
      droneOsc.frequency.setValueAtTime(82.41, now);
      droneGain.gain.setValueAtTime(0.08, now);

      // Warm analog filter
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, now);

      droneOsc.connect(filter);
      filter.connect(droneGain);
      droneGain.connect(this.ctx.destination);

      droneOsc.start(now);
      this.ambientNodes.push(droneOsc);

      // Periodic blues guitar lick loop
      const lickInterval = setInterval(() => {
        if (!this.isPlayingAmbient) {
          clearInterval(lickInterval);
          return;
        }
        const lickTypes = ['pentatonic', 'riff', 'powerchord'];
        const randomLick = lickTypes[Math.floor(Math.random() * lickTypes.length)];
        this.playBluesLick(randomLick);
      }, 5500);

      this.isPlayingAmbient = true;
      if (miniBar) miniBar.classList.add('playing');
      if (playIcon) playIcon.className = 'fas fa-pause';
      return true;
    }
  }
}

// Global Soundboard Instance
window.roadhouseSoundboard = new RoadhouseSoundboard();
