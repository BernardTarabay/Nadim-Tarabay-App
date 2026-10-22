const GESTURES = ['pointerdown', 'pointerup', 'keydown', 'touchend'];

const CONTROL_SELECTOR = '[data-audio-control]';

export class AudioEngine {
  #audio = null;
  #listeners = new Set();
  #progressListeners = new Set();
  #state = { currentTrack: null, status: 'idle', isPlaying: false, soundOn: true, muted: false };
  #progress = { currentTime: 0, duration: NaN };
  #userMuted = false;
  #gestureArmed = false;

  constructor(defaultTrack, playlist = []) {
    this.defaultTrack = defaultTrack;
    this.playlist = playlist;
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
    element.addEventListener('timeupdate', () => this.#setProgress());
    element.addEventListener('durationchange', () => this.#setProgress());
    this.#autoplay();
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

  play = async (track) => {
    const target = track ?? this.#state.currentTrack ?? this.defaultTrack;
    this.#userMuted = false;
    this.#disarmGesture();
    if (target.id !== this.#state.currentTrack?.id || this.#state.status === 'error')
      this.#load(target);
    this.#set({ soundOn: true });
    const ok = await this.#tryPlay();
    if (!ok && this.#state.status !== 'error') this.#set({ status: 'paused' });
  };

  #playNext = () => {
    const index = this.playlist.findIndex((track) => track.id === this.#state.currentTrack?.id);
    const next = this.playlist[(index + 1) % this.playlist.length];
    if (next) this.play(next);
    else this.#set({ status: 'paused' });
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

  seek = (seconds) => {
    const audio = this.#audio;
    if (!audio || !Number.isFinite(audio.duration)) return;
    audio.currentTime = Math.min(Math.max(seconds, 0), audio.duration);
    this.#setProgress();
  };
}
