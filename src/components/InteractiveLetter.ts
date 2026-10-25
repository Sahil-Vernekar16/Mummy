export class InteractiveLetter {
  private container: HTMLElement;
  private title: string;
  private content: string;

  constructor(container: HTMLElement, title: string, content: string) {
    this.container = container;
    this.title = title;
    this.content = content;
    this.init();
  }

  private init() {
    this.container.className = 'interactive-letter';
    this.container.innerHTML = `
      <button class="interactive-letter__trigger" aria-expanded="false">
        <div class="interactive-letter__envelope">
          <div class="interactive-letter__envelope-back"></div>
          <div class="interactive-letter__envelope-front"></div>
          <div class="interactive-letter__envelope-flap"></div>
        </div>
        <span class="interactive-letter__title">${this.title}</span>
      </button>
    `;
    
    // Create modal and append to body
    const modalId = this.getId();
    const modal = document.createElement('div');
    modal.className = 'interactive-letter__modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', `letter-title-${modalId}`);
    modal.innerHTML = `
      <div class="interactive-letter__backdrop"></div>
      <div class="interactive-letter__content">
        <div class="interactive-letter__paper">
          <button class="interactive-letter__close" aria-label="Close letter">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <h3 class="interactive-letter__modal-title" id="letter-title-${modalId}">${this.title}</h3>
          <div class="interactive-letter__text">
            ${this.content.split('\n').map(line => {
              if (line.trim() === '') return '<br>';
              return `<p>${line.replace(/\n/g, '<br>')}</p>`;
            }).join('')}
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    
    const trigger = this.container.querySelector('.interactive-letter__trigger') as HTMLButtonElement;
    const backdrop = modal.querySelector('.interactive-letter__backdrop') as HTMLElement;
    const closeBtn = modal.querySelector('.interactive-letter__close') as HTMLButtonElement;
    
    const open = () => {
      modal.classList.add('interactive-letter__modal--open');
      trigger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      closeBtn.focus();
    };
    
    const close = () => {
      modal.classList.remove('interactive-letter__modal--open');
      trigger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
      trigger.focus();
    };
    
    trigger.addEventListener('click', open);
    backdrop.addEventListener('click', close);
    closeBtn.addEventListener('click', close);
    
    modal.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        close();
      }
      // Trap focus
      if (e.key === 'Tab') {
        const focusableElements = modal.querySelectorAll('button');
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
        
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    });
  }
  
  private getId() {
    return Math.random().toString(36).substr(2, 9);
  }
}
