import type { Photo } from '../data/memories';

export class PhotoFrame {
  private container: HTMLElement;
  private photo: Photo;

  constructor(container: HTMLElement, photo: Photo) {
    this.container = container;
    this.photo = photo;
    this.init();
  }

  private async init() {
    this.container.className = 'photo-frame';
    if (this.photo.primary) {
      this.container.classList.add('photo-frame--primary');
    }

    // Create placeholder structure
    const frame = document.createElement('div');
    frame.className = 'photo-frame__border';
    
    const inner = document.createElement('div');
    inner.className = 'photo-frame__inner';
    
    // Check if image exists
    await this.checkAndLoadImage(inner);
    
    // Add caption if exists
    if (this.photo.caption) {
      const caption = document.createElement('figcaption');
      caption.className = 'photo-frame__caption';
      caption.textContent = this.photo.caption;
      inner.appendChild(caption);
    }
    
    frame.appendChild(inner);
    this.container.appendChild(frame);
  }

  private async checkAndLoadImage(inner: HTMLElement) {
    try {
      const response = await fetch(this.photo.path, { method: 'HEAD' });
      if (response.ok) {
        // Image exists, load it
        const img = document.createElement('img');
        img.src = this.photo.path;
        img.alt = this.photo.alt;
        img.className = 'photo-frame__image';
        img.loading = 'lazy';
        
        // Insert image before caption if caption exists
        const caption = inner.querySelector('.photo-frame__caption');
        if (caption) {
          inner.insertBefore(img, caption);
        } else {
          inner.appendChild(img);
        }
        
        // Make it clickable for photo viewer
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
          this.openPhotoViewer();
        });
        img.setAttribute('tabindex', '0');
        img.setAttribute('role', 'button');
        img.setAttribute('aria-label', `View larger image: ${this.photo.alt}`);
        img.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.openPhotoViewer();
          }
        });
      } else {
        this.createPlaceholder(inner);
      }
    } catch {
      this.createPlaceholder(inner);
    }
  }

  private createPlaceholder(inner: HTMLElement) {
    const placeholder = document.createElement('div');
    placeholder.className = 'photo-frame__placeholder';
    placeholder.setAttribute('aria-label', this.photo.alt);
    
    // Subtle decorative elements
    const decoration = document.createElement('div');
    decoration.className = 'photo-frame__placeholder-decoration';
    decoration.innerHTML = `
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="30" cy="30" r="2" fill="currentColor" opacity="0.3"/>
        <circle cx="20" cy="25" r="1.5" fill="currentColor" opacity="0.25"/>
        <circle cx="40" cy="25" r="1.5" fill="currentColor" opacity="0.25"/>
        <path d="M22 35 Q30 42 38 35" stroke="currentColor" stroke-width="1.5" fill="none" opacity="0.3" stroke-linecap="round"/>
      </svg>
    `;
    
    const text = document.createElement('div');
    text.className = 'photo-frame__placeholder-text';
    text.textContent = 'A treasured memory';
    
    placeholder.appendChild(decoration);
    placeholder.appendChild(text);
    
    const caption = inner.querySelector('.photo-frame__caption');
    if (caption) {
      inner.insertBefore(placeholder, caption);
    } else {
      inner.appendChild(placeholder);
    }
  }

  private openPhotoViewer() {
    // Create photo viewer modal
    const modal = document.createElement('div');
    modal.className = 'photo-viewer';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Photo viewer');
    
    modal.innerHTML = `
      <div class="photo-viewer__backdrop"></div>
      <div class="photo-viewer__content">
        <button class="photo-viewer__close" aria-label="Close photo viewer">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <img src="${this.photo.path}" alt="${this.photo.alt}" class="photo-viewer__image">
        ${this.photo.caption ? `<p class="photo-viewer__caption">${this.photo.caption}</p>` : ''}
      </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    // Focus management
    const closeBtn = modal.querySelector('.photo-viewer__close') as HTMLButtonElement;
    closeBtn.focus();
    
    const close = () => {
      document.body.removeChild(modal);
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    };
    
    modal.querySelector('.photo-viewer__backdrop')?.addEventListener('click', close);
    closeBtn.addEventListener('click', close);
    
    modal.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        close();
      }
    });
  }
}
