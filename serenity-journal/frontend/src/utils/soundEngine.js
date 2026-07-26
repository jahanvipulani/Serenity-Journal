// Serenity Journal's "music" is generated locally with the Web Audio API.
// This sidesteps licensing entirely (nothing is downloaded or streamed)
// while still giving a genuinely playable ambient soundscape for each track.
// Swap this out for real royalty-free .mp3 files in /public/audio if you'd
// rather ship pre-recorded tracks — see the README for instructions.

let ctx = null;
let masterGain = null;
let activeNodes = [];

const getCtx = () => {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = ctx.createGain();
    masterGain.connect(ctx.destination);
  }
  return ctx;
};

const whiteNoiseBuffer = (audioCtx) => {
  const bufferSize = audioCtx.sampleRate * 2;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
};

const makeNoiseSource = (audioCtx, filterFreq, filterType = "lowpass") => {
  const source = audioCtx.createBufferSource();
  source.buffer = whiteNoiseBuffer(audioCtx);
  source.loop = true;
  const filter = audioCtx.createBiquadFilter();
  filter.type = filterType;
  filter.frequency.value = filterFreq;
  source.connect(filter);
  return { source, filter };
};

const TRACKS = {
  rain: (audioCtx, out) => {
    const { source, filter } = makeNoiseSource(audioCtx, 1200);
    filter.connect(out);
    source.start();
    return [source];
  },
  ocean: (audioCtx, out) => {
    const { source, filter } = makeNoiseSource(audioCtx, 500);
    const lfo = audioCtx.createOscillator();
    const lfoGain = audioCtx.createGain();
    lfo.frequency.value = 0.15;
    lfoGain.gain.value = 300;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    filter.connect(out);
    lfo.start();
    source.start();
    return [source, lfo];
  },
  forest: (audioCtx, out) => {
    const { source, filter } = makeNoiseSource(audioCtx, 2200, "bandpass");
    filter.connect(out);
    source.start();
    return [source];
  },
  wind: (audioCtx, out) => {
    const { source, filter } = makeNoiseSource(audioCtx, 800);
    const lfo = audioCtx.createOscillator();
    const lfoGain = audioCtx.createGain();
    lfo.frequency.value = 0.08;
    lfoGain.gain.value = 500;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    filter.connect(out);
    lfo.start();
    source.start();
    return [source, lfo];
  },
  fireplace: (audioCtx, out) => {
    const { source, filter } = makeNoiseSource(audioCtx, 1800, "lowpass");
    filter.connect(out);
    source.start();
    return [source];
  },
  piano: (audioCtx, out) => {
    // A slow, soft chord pad instead of literal piano samples
    const freqs = [220, 277.18, 329.63, 440]; // A minor-ish pad
    const oscs = freqs.map((f) => {
      const osc = audioCtx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = f;
      const g = audioCtx.createGain();
      g.gain.value = 0.15;
      osc.connect(g);
      g.connect(out);
      osc.start();
      return osc;
    });
    return oscs;
  },
  meditation: (audioCtx, out) => {
    const osc = audioCtx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 136.1; // "Om" frequency often used in meditation apps
    osc.connect(out);
    osc.start();
    return [osc];
  },
  night: (audioCtx, out) => {
    const { source, filter } = makeNoiseSource(audioCtx, 300);
    filter.connect(out);
    source.start();
    return [source];
  },
};

export const TRACK_LIST = [
  { id: "none", label: "No music" },
  { id: "rain", label: "Rain" },
  { id: "ocean", label: "Ocean waves" },
  { id: "forest", label: "Forest" },
  { id: "fireplace", label: "Fireplace" },
  { id: "wind", label: "Wind" },
  { id: "piano", label: "Piano pad" },
  { id: "meditation", label: "Meditation tone" },
  { id: "night", label: "Night ambience" },
];

export const stopSound = () => {
  activeNodes.forEach((n) => {
    try {
      n.stop();
    } catch {
      /* already stopped */
    }
  });
  activeNodes = [];
};

export const playSound = (trackId, volume = 0.5) => {
  stopSound();
  if (trackId === "none" || !TRACKS[trackId]) return;
  const audioCtx = getCtx();
  if (audioCtx.state === "suspended") audioCtx.resume();
  masterGain.gain.value = volume;
  activeNodes = TRACKS[trackId](audioCtx, masterGain);
};

export const setVolume = (volume) => {
  if (masterGain) masterGain.gain.value = volume;
};
