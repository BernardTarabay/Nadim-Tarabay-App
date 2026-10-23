import { trackEvent } from '@/analytics/track';

const GESTURES = ['pointerdown', 'pointerup', 'keydown', 'touchend'];

const CONTROL_SELECTOR = '[data-audio-control]';

// A preview fades out over its last seconds instead of stopping abruptly.
const FADE_SECONDS = 4;

export class AudioEngine {
  #audio = null;
  #fadeFrame = 0;
  #listeners = new Set();
  #progressListeners = new Set();
  #state = {
    currentTrack: null,
    status: 'idle',
    isPlaying: false,
    preview: false,
    soundOn: true,
    muted: false,
  };
  #progress = { currentTime: 0, duration: NaN };
  #userMuted = false;
  #gestureArmed = false;

  /**
   * `playlist` is the order tracks play in, starting with the first; tracks listed in
   * `preview.trackIds` play only their first `preview.seconds` before moving on to the next.
   */
  constructor(playlist = [], preview = { seconds: Infinity, trackIds: [] }) {
    this.playlist = playlist;
    this.defaultTrack = playlist[0];
    this.preview = { seconds: preview.seconds, trackIds: new Set(preview.trackIds) };
  }

  subscribe = (listener) => {
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  };

  getState = () => this.#state;

  subscribeProgress = (listener) => {
    this.#progressListeners.add(listener);
    return () => this.#progressListeners.delete(listener);
  };

  getProgress = () => this.#progress;

  #set(patch) {
    const next = { ...this.#state, ...patch };
    next.isPlaying = next.status === 'playing';
    next.preview = this.preview.trackIds.has(next.currentTrack?.id);
    this.#state = next;
    this.#listeners.forEach((listener) => listener());
  }

  #setProgress() {
    const audio = this.#audio;
    this.#progress = { currentTime: audio.currentTime, duration: audio.duration };
    this.#progressListeners.forEach((listener) => listener());
  }

  attach = (element) => {
    if (!element || element === this.#audio) return;
    this.#audio = element;
    element.addEventListener(
      'loadstart',
      () => this.#state.status !== 'blocked' && this.#set({ status: 'loading' }),
    );
    element.addEventListener('waiting', () => this.#set({ status: 'loading' }));
    element.addEventListener('playing', () => this.#set({ status: 'playing' }));
    element.addEventListener(
      'pause',
      () => !element.ended && !element.error && this.#set({ status: 'paused' }),
    );
    element.addEventListener('ended', this.#playNext);
    element.addEventListener('error', () => this.#set({ status: 'error' }));
    element.addEventListener('timeupdate', () => {
      this.#setProgress();
      this.#fade();
      this.#endPreview();
    });
    element.addEventListener('durationchange', () => this.#setProgress());
    this.#autoplay();
  };

  /** A preview track that has played its share moves on, as if it had ended. */
  #endPreview() {
    const { preview, status } = this.#state;
    if (!preview || status !== 'playing') return;
    if (this.#audio.currentTime >= this.preview.seconds) this.#playNext();
  }

  /** Sets the volume for the preview fade-out (full volume everywhere else). */
  #fade = () => {
    const audio = this.#audio;
    if (!audio) return;
    const end = this.preview.seconds;
    const inFade = this.#state.preview && audio.currentTime >= end - FADE_SECONDS;
    const volume = inFade ? Math.max(0, (end - audio.currentTime) / FADE_SECONDS) : 1;
    try {
      if (audio.volume !== volume) audio.volume = volume;
    } catch {
      // Some browsers (iOS Safari) don't let pages set the volume; the preview then just ends.
    }
    // timeupdate fires only about four times a second, so steps in between keep the fade smooth.
    cancelAnimationFrame(this.#fadeFrame);
    if (inFade && !audio.paused && audio.currentTime < end) {
      this.#fadeFrame = requestAnimationFrame(this.#fade);
    }
  };

  #autoplay() {
    this.#load(this.defaultTrack);
    this.#tryPlay().then((ok) => {
      if (!ok && !this.#userMuted && this.#state.status !== 'error') {
        this.#set({ status: 'blocked', soundOn: false });
        this.#armGesture();
      }
    });
  }

  #armGesture() {
    if (this.#gestureArmed) return;
    this.#gestureArmed = true;
    GESTURES.forEach((type) => document.addEventListener(type, this.#onGesture, { capture: true }));
  }

  #disarmGesture() {
    this.#gestureArmed = false;
    GESTURES.forEach((type) =>
      document.removeEventListener(type, this.#onGesture, { capture: true }),
    );
  }

  #onGesture = (event) => {
    if (event.target instanceof Element && event.target.closest(CONTROL_SELECTOR)) return;
    if (event instanceof KeyboardEvent && (event.key === 'Escape' || event.key === 'Tab')) return;
    if (this.#userMuted) {
      this.#disarmGesture();
      return;
    }
    this.#set({ soundOn: true });
    this.#tryPlay().then((ok) => ok && this.#disarmGesture());
  };

  #load(track) {
    const audio = this.#audio;
    if (!audio) return;
    audio.src = track.src;
    audio.loop = Boolean(track.loop);
    audio.load();
    this.#fade();
    this.#progress = { currentTime: 0, duration: NaN };
    this.#set({ currentTrack: track, status: 'loading' });
  }

  async #tryPlay() {
    if (!this.#audio) return false;
    try {
      await this.#audio.play();
      return true;
    } catch (error) {
      if (error?.name !== 'NotAllowedError' && error?.name !== 'AbortError')
        this.#set({ status: 'error' });
      return false;
    }
  }

  /** Plays at a visitor's request (counted in the studio's stats). */
  play = (track) => {
    trackEvent('play', (track ?? this.#state.currentTrack ?? this.defaultTrack).id);
    return this.#start(track);
  };

  async #start(track) {
    const target = track ?? this.#state.currentTrack ?? this.defaultTrack;
    this.#userMuted = false;
    this.#disarmGesture();
    if (target.id !== this.#state.currentTrack?.id || this.#state.status === 'error')
      this.#load(target);
    this.#set({ soundOn: true });
    const ok = await this.#tryPlay();
    if (!ok && this.#state.status !== 'error') this.#set({ status: 'paused' });
  }

  #nextTrack() {
    const index = this.playlist.findIndex((track) => track.id === this.#state.currentTrack?.id);
    return this.playlist[(index + 1) % this.playlist.length];
  }

  #playNext = () => {
    const next = this.#nextTrack();
    if (next) this.#start(next);
    else this.#set({ status: 'paused' });
  };

  /** Skips to the next track, at a visitor's request. */
  next = () => {
    const next = this.#nextTrack();
    if (next) this.play(next);
  };

  pause = () => {
    this.#audio?.pause();
  };

  static isAudible = (state) =>
    state.soundOn && (state.status === 'playing' || state.status === 'loading');

  toggleSound = () => {
    if (AudioEngine.isAudible(this.#state)) {
      this.#userMuted = true;
      this.#disarmGesture();
      this.#set({ soundOn: false });
      this.pause();
    } else {
      this.play();
    }
  };

  toggleMute = () => {
    if (!this.#audio) return;
    this.#audio.muted = !this.#audio.muted;
    this.#set({ muted: this.#audio.muted });
  };

  /** The furthest a visitor can seek: a preview stops at the start of its fade-out. */
  #seekLimit = () =>
    this.#state.preview ? this.preview.seconds - FADE_SECONDS : (this.#audio?.duration ?? 0);

  seek = (seconds) => {
    const audio = this.#audio;
    if (!audio || !Number.isFinite(audio.duration)) return;
    audio.currentTime = Math.min(Math.max(seconds, 0), audio.duration, this.#seekLimit());
    this.#setProgress();
    this.#fade();
  };
}
