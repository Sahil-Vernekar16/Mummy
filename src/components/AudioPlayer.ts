export class AudioPlayer {
  private container: HTMLElement;
  private audioFile: string;
  private title: string;

  constructor(container: HTMLElement, audioFile: string, title: string) {
    this.container = container;
    this.audioFile = audioFile;
    this.title = title;
    this.init();
  }

  private init() {
    this.container.className = 'audio-player';
    this.container.innerHTML = `
      <div class="audio-player__wrapper">
        <div class="audio-player__info">
          <div class="audio-player__icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
            </svg>
          </div>
          <span class="audio-player__title">${this.title}</span>
        </div>
        <button class="audio-player__button" aria-label="Play audio">
          <svg class="audio-player__play-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          <svg class="audio-player__pause-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="display: none;">
            <rect x="6" y="4" width="4" height="16"></rect>
            <rect x="14" y="4" width="4" height="16"></rect>
          </svg>
        </button>
      </div>
      <audio src="/audio/${this.audioFile}" preload="metadata"></audio>
    `;
    
    const button = this.container.querySelector('.audio-player__button') as HTMLButtonElement;
    const audio = this.container.querySelector('audio') as HTMLAudioElement;
    const playIcon = this.container.querySelector('.audio-player__play-icon') as HTMLElement;
    const pauseIcon = this.container.querySelector('.audio-player__pause-icon') as HTMLElement;
    
    button.addEventListener('click', () => {
      if (audio.paused) {
        audio.play().catch(() => {
          // Ignore autoplay errors
        });
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
        button.setAttribute('aria-label', 'Pause audio');
      } else {
        audio.pause();
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
        button.setAttribute('aria-label', 'Play audio');
      }
    });
    
    audio.addEventListener('ended', () => {
      playIcon.style.display = 'block';
      pauseIcon.style.display = 'none';
      button.setAttribute('aria-label', 'Play audio');
    });
  }
}
