export class Envelope {
  private container: HTMLElement;
  private onOpen: () => void;

  constructor(container: HTMLElement, onOpen: () => void) {
    this.container = container;
    this.onOpen = onOpen;
    this.init();
  }

  private init() {
    this.container.className = 'envelope';
    this.container.innerHTML = `
      <div class="envelope__wrapper" tabindex="0" role="button" aria-label="Open your surprise">
        <div class="envelope__back"></div>
        <div class="envelope__letter">
          <div class="envelope__letter-content">
            <div class="envelope__letter-line"></div>
            <div class="envelope__letter-line"></div>
            <div class="envelope__letter-line short"></div>
          </div>
        </div>
        <div class="envelope__front"></div>
        <div class="envelope__flap"></div>
      </div>
      <button class="envelope__button" aria-label="Open your surprise">Open your surprise</button>
    `;
    
    const wrapper = this.container.querySelector('.envelope__wrapper') as HTMLElement;
    const button = this.container.querySelector('.envelope__button') as HTMLElement;
    
    const open = () => {
      this.container.classList.add('envelope--opening');
      setTimeout(() => {
        this.onOpen();
      }, 800);
    };
    
    wrapper.addEventListener('click', open);
    button.addEventListener('click', open);
    
    wrapper.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
      }
    });
  }
}
