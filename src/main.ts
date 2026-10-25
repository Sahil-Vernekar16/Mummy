import './styles/main.css';
import { Envelope } from './components/Envelope';
import { PhotoFrame } from './components/PhotoFrame';
import { InteractiveLetter } from './components/InteractiveLetter';
import { getPhotosBySection, konkaniPhrases } from './data/memories';

class MummyBirthdayApp {
  private app: HTMLElement;
  private birthdayAudio: HTMLAudioElement | null = null;

  constructor() {
    this.app = document.getElementById('app')!;
    this.init();
  }

  private init() {
    this.renderOpening();
  }

  private renderOpening() {
    this.app.innerHTML = `
      <section class="opening" aria-label="Opening screen">
        <div class="opening__content">
          <h1 class="opening__title">For My Mummy, With All My Love</h1>
          <p class="opening__subtitle">A little place on the internet, made just for you.</p>
          <div class="opening__envelope-container" id="envelope-container"></div>
        </div>
      </section>
    `;
    
    const envelopeContainer = document.getElementById('envelope-container')!;
    new Envelope(envelopeContainer, () => {
      this.renderMainContent();
    });
  }

  private renderMainContent() {
    const birthdayBg = localStorage.getItem('birthday-bg') !== 'off';
    this.app.innerHTML = `
      <div class="birthday-toggle ${birthdayBg ? 'birthday-toggle--on' : ''}" aria-label="Toggle birthday background">
        <button class="birthday-toggle__button" aria-pressed="${birthdayBg}">
          <span class="birthday-toggle__icon">🎂</span>
          <span class="birthday-toggle__label">${birthdayBg ? 'Turn off birthday tone' : 'Turn on birthday tone'}</span>
        </button>
      </div>
      <audio id="birthday-audio" src="/audio/birthday-tune.mp3" loop preload="auto"></audio>
      <main id="main-content" class="main-content main-content--visible" tabindex="-1">

        <!-- Featured: Best Photo -->
        <section class="story-section" id="featured">
          <div class="container">
            <header class="section-header reveal">
              <p class="section-header__subtitle">Me and Mummy</p>
            </header>
            <div id="featured-photos"></div>
          </div>
        </section>

        <!-- Section 1: Her Journey -->
        <section class="story-section" id="her-journey">
          <div class="container">
            <header class="section-header reveal">
              <h2 class="section-header__title">Her Journey</h2>
              <p class="section-header__subtitle">The beautiful story of how it all began</p>
            </header>
            <div class="story-content reveal">
              <p>Mummy was born on <strong>26 October 1975</strong> in Goa. I don't know all the little details of her childhood, but I know she grew up there with her parents and two brothers, went to school there, and grew into the kind hearted, gentle soul that she is.</p>
              <p>She chose to become a teacher and I think that's exactly who she was always meant to be. Because teaching isn't just a job for her, it's who she is at her core. Caring, patient, and always looking out for others.</p>
            </div>
            <div id="journey-photos"></div>
            <div class="timeline reveal">
              <div class="timeline-item">
                <div class="timeline-item__marker"></div>
                <div class="timeline-item__content">
                  <span class="timeline-item__year">1975</span>
                  <h3 class="timeline-item__title">Born in Goa</h3>
                  <p class="timeline-item__text">Into a loving family</p>
                </div>
              </div>
              <div class="timeline-item">
                <div class="timeline-item__marker"></div>
                <div class="timeline-item__content">
                  <span class="timeline-item__year">Growing Up</span>
                  <h3 class="timeline-item__title">Childhood in Goa</h3>
                  <p class="timeline-item__text">With her parents and two brothers</p>
                </div>
              </div>
              <div class="timeline-item">
                <div class="timeline-item__marker"></div>
                <div class="timeline-item__content">
                  <span class="timeline-item__year">Education</span>
                  <h3 class="timeline-item__title">Schooling in Goa</h3>
                  <p class="timeline-item__text">Laying the foundation for a life of caring</p>
                </div>
              </div>
              <div class="timeline-item">
                <div class="timeline-item__marker"></div>
                <div class="timeline-item__content">
                  <span class="timeline-item__year">Life's Calling</span>
                  <h3 class="timeline-item__title">Becoming a Teacher</h3>
                  <p class="timeline-item__text">Touching countless young hearts</p>
                </div>
              </div>
              <div class="timeline-item">
                <div class="timeline-item__marker"></div>
                <div class="timeline-item__content">
                  <span class="timeline-item__year">16 May 2002</span>
                  <h3 class="timeline-item__title">Becoming My Mother</h3>
                  <p class="timeline-item__text">The greatest gift of all</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Section 2: Before I could remember -->
        <section class="story-section" id="before-remember">
          <div class="container">
            <header class="section-header reveal">
              <h2 class="section-header__title">Before I Could Remember</h2>
              <p class="section-header__subtitle">The beginning of our journey together</p>
            </header>
            <div id="before-photos"></div>
            <div class="story-content reveal">
              <p>There was a time before I could remember... a time when you were already loving me more than I could ever know.</p>
              <p>I don't know what you were thinking or feeling then, but I know this from the very moment I came into your life, you loved me completely.</p>
              <p>And for that love that existed before I even knew it, I will always be grateful.</p>
            </div>
          </div>
        </section>

        <!-- Section 3: My Third Birthday -->
        <section class="story-section" id="third-birthday">
          <div class="container">
            <header class="section-header reveal">
              <h2 class="section-header__title">My Third Birthday</h2>
              <p class="section-header__subtitle">Treasured memories from so long ago</p>
            </header>
            <div class="photo-gallery photo-gallery--pair" id="birthday-photos"></div>
            <div class="story-content reveal">
              <p>I was quite the mischievous little one back then. I know there were times I didn't listen, and times I took your love and care for granted.</p>
              <p>But you never held that against me. You did everything you possibly could to make me happy even fulfilling the silliest of my wishes, just so I wouldn't feel disappointed.</p>
              <p>When I was sick, you took care of me completely. When I had the tiniest scratch, you worried more than I did. And if I ever asked for Maggi at 2 AM, you'd quietly get up and make it for me, without ever making me feel like a burden.</p>
              <p>Even when you were tired or in pain yourself, you still looked after me. That kind of love selfless, quiet, constant it's something I only truly understand now.</p>
            </div>
          </div>
        </section>

        <!-- Section 4: The Family Around Us -->
        <section class="story-section" id="family">
          <div class="container">
            <header class="section-header reveal">
              <h2 class="section-header__title">The Family Around Us</h2>
              <p class="section-header__subtitle">The love that surrounds us</p>
            </header>
            <div id="family-photos"></div>
            <div class="story-content reveal">
              <p>These pictures hold so many memories. Three generations, all together with so much love.</p>
              <p>You're the heart of it all, Mummy. And I'm so grateful for all of them, but most of all, for you.</p>
            </div>
          </div>
        </section>

        <!-- Section 5: A Mother Who Is Also A Beloved Teacher -->
        <section class="story-section" id="teacher">
          <div class="container">
            <header class="section-header reveal">
              <h2 class="section-header__title">A Mother Who Is Also A Beloved Teacher</h2>
              <p class="section-header__subtitle">Touching so many lives with kindness</p>
            </header>
            <div class="story-content reveal">
              <p>You don't just teach, you care. Deeply. And your students feel it.</p>
              <p>Nothing makes me prouder than when they come up to me and ask, "Is she your mother?" followed by, "She's so sweet and caring."</p>
              <p>In that moment, my heart swells with pride because I get to say - yes, she's my Mummy. And I'm so lucky to be her son.</p>
              <p>The love they have for you is just a glimpse of the love so many of us feel for you.</p>
            </div>
          </div>
        </section>

        <!-- Section 6: The Doctor and The Engineer -->
        <section class="story-section" id="doctor-engineer">
          <div class="container">
            <header class="section-header reveal">
              <h2 class="section-header__title">Your Doctor Became an Engineer</h2>
              <p class="section-header__subtitle">With love and laughter</p>
            </header>
            <div class="story-content reveal">
              <p>I know you hoped I'd become a doctor. And I became an engineer instead.</p>
              <p>But through it all, you never made me feel like I'd disappointed you. You just loved me, supported me, and cheered me on every step of the way.</p>
              <p>That's the kind of mother you are. And I couldn't be more grateful for it.</p>
            </div>
          </div>
        </section>

        <!-- Section 7: The Mumbai Award Ceremony -->
        <section class="story-section" id="mumbai-award">
          <div class="container">
            <header class="section-header reveal">
              <h2 class="section-header__title">The Mumbai Award Ceremony</h2>
              <p class="section-header__subtitle">A dream shared and achieved together</p>
            </header>
            <div id="award-photos"></div>
            <div class="story-content reveal">
              <p>When I started working on that project, there was a difficult period. But you and the family were there for me through all of it.</p>
              <p>I had one goal in my heart, earn an award on that project and bring you to Mumbai for the celebration.</p>
              <p>And I did it. Getting to bring you here for that moment... sharing that joy with you meant more to me than the award itself.</p>
              <p>You'd believed in me even on the days when I didn't believe in myself. Getting to share that victory with you is something I'll never forget.</p>
            </div>
          </div>
        </section>

        <!-- Section 8: The Little Things -->
        <section class="story-section" id="little-things">
          <div class="container">
            <header class="section-header reveal">
              <h2 class="section-header__title">The Little Things I Will Never Take For Granted</h2>
              <p class="section-header__subtitle">The everyday love that means everything</p>
            </header>
            <div class="story-content reveal">
              <p>You stay awake till I reach home, no matter how late even if it's 3 AM when you have to wake up at 5 AM for school.</p>
              <p>You worry about the tiniest scratch like it's the biggest thing in the world.</p>
              <p>I know I can tell you anything, and you'll listen, understand, and do your best to help.</p>
              <p>You take care of me when I'm sick with so much love and patience.</p>
              <p>Maggi at 2 AM, without a word of complaint. Just love, in the form of a warm bowl.</p>
              <p>These may seem like small things, but they're the things I love the most about you. And I'll never take them for granted.</p>
            </div>
          </div>
        </section>

        <!-- Section 9: Things I May Not Say Enough -->
        <section class="story-section" id="letter">
          <div class="container">
            <header class="section-header reveal">
              <h2 class="section-header__title">Things I May Not Say Enough</h2>
              <p class="section-header__subtitle">A letter from my heart</p>
            </header>
            <div class="letter-section reveal">
              <article class="letter-paper">
                <header class="letter-paper__header">
                  <div class="letter-paper__date">26 October 2026</div>
                  <div class="letter-paper__greeting">My Dearest Mummy,</div>
                </header>
                <div class="letter-paper__body">
                  <p>Happy Birthday, Mummy.</p>
                  <p>I don't say this enough, but thank you. For everything.</p>
                  <p>Thank you for loving me so selflessly, even when I was mischievous and didn't listen, even when I took your care for granted.</p>
                  <p>Thank you for all the sacrifices you made, big and small, without ever expecting anything in return.</p>
                  <p>Thank you for being my safe haven - someone I can always come to, no matter what time of day or night.</p>
                  <p>Thank you for your heart - so full of love, kindness and care that it touches everyone around you, especially me.</p>
                  <p>I'm so proud of you. I'm so grateful to have you as my mother.</p>
                  <p>You mean more to me than you'll ever know.</p>
                </div>
                <footer class="letter-paper__closing">
                  <div class="letter-paper__closing-line">With all my love and gratitude,</div>
                  <div class="letter-paper__signature">Your Son<br/>SoanPapdi</div>
                </footer>
              </article>
            </div>
          </div>
        </section>

        <!-- Section 10: Now It Is Your Turn, Mummy -->
        <section class="future-section" id="future">
          <div class="container">
            <header class="section-header reveal">
              <h2 class="section-header__title">Now It Is Your Turn, Mummy</h2>
              <p class="section-header__subtitle">Time to look after yourself too</p>
            </header>
            <div class="future-section__content reveal">
              <p>You've spent your whole life looking after me. And I want you to know now it's my turn to look after you too.</p>
              <p>I'm earning now, and I want to support you in every way I can - both emotionally and financially.</p>
              <p>Please don't feel guilty about spending on yourself. Do the things that make you happy.</p>
              <p>Worry a little less about me, Mummy. I want you to enjoy your life, take care of yourself, and do things just for you.</p>
              <p>You deserve all the happiness in the world. You deserve to be looked after too.</p>
              <p>Your care has always been my greatest blessing. Now, let me share some of that care back with you.</p>
            </div>
          </div>
        </section>

        <!-- Section 11: Open When You Need Me -->
        <section class="story-section" id="open-when">
          <div class="container">
            <header class="section-header reveal">
              <h2 class="section-header__title">Open When You Need Me</h2>
              <p class="section-header__subtitle">Little notes for different moments</p>
            </header>
            <div class="interactive-letters reveal">
              <div id="letter-missing"></div>
              <div id="letter-tired"></div>
              <div id="letter-worrying"></div>
              <div id="letter-happiness"></div>
              <div id="letter-love"></div>
            </div>
          </div>
        </section>

        <!-- Section 12: Konkani Phrases & My Real Voice -->
        <section class="story-section" id="konkani-voice">
          <div class="container">
            <header class="section-header reveal">
              <h2 class="section-header__title">In Our Own Words</h2>
              <p class="section-header__subtitle">From the heart, in our language</p>
            </header>
            <div class="story-content reveal">
            </div>
            <div id="konkani-phrases"></div>
          </div>
        </section>

        <!-- Section 12: Collage of Memories -->
        <section class="story-section" id="collage">
          <div class="container">
            <header class="section-header reveal">
              <h2 class="section-header__title">A Collage of Memories</h2>
              <p class="section-header__subtitle">More treasured moments</p>
            </header>
            <div id="collage-photos"></div>
          </div>
        </section>

        <!-- Section 13: Final Birthday Letter -->
        <section class="final-section" id="final">
          <div class="final-section__content reveal">
            <div class="final-section__message">I LOVE YOU VERY MUCH, MUMMY</div>
            <div class="final-section__submessage">(Never said it, but always do.)</div>
            <div class="final-section__decoration">
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M30 10 Q35 5 40 10 Q50 20 30 45 Q10 20 20 10 Q25 5 30 10" fill="#d63031"/>
              </svg>
            </div>
            <div class="final-section__signoff">Made with all my love,<br/>Your Son<br/>SoanPapdi</div>
          </div>
        </section>
      </main>
    `;
    
    // Render photos
    this.renderPhotos();
    
    // Render interactive letters
    this.renderInteractiveLetters();
    
    // Render Konkani phrases
    this.renderKonkaniPhrases();
    
    // Setup birthday audio (autoplay after envelope interaction)
    this.setupBirthdayAudio();
    
    // Setup scroll animations
    this.setupScrollAnimations();
    
    this.setupBirthdayToggle();
    
    // Focus main content
    const mainContent = document.getElementById('main-content')!;
    mainContent.focus();
  }

  private renderPhotos() {
    // Featured photo
    const featuredPhotos = getPhotosBySection('featured');
    const featuredContainer = document.getElementById('featured-photos')!;
    featuredPhotos.forEach(photo => {
      const frameDiv = document.createElement('div');
      featuredContainer.appendChild(frameDiv);
      new PhotoFrame(frameDiv, photo);
    });

    // Her journey photos
    const journeyPhotos = getPhotosBySection('her-journey');
    const journeyContainer = document.getElementById('journey-photos')!;
    journeyPhotos.forEach(photo => {
      const frameDiv = document.createElement('div');
      journeyContainer.appendChild(frameDiv);
      new PhotoFrame(frameDiv, photo);
    });

    // Before remember photos
    const beforePhotos = getPhotosBySection('before-remember');
    const beforeContainer = document.getElementById('before-photos')!;
    beforePhotos.forEach(photo => {
      const frameDiv = document.createElement('div');
      beforeContainer.appendChild(frameDiv);
      new PhotoFrame(frameDiv, photo);
    });

    // Birthday photos
    const birthdayPhotos = getPhotosBySection('third-birthday');
    const birthdayContainer = document.getElementById('birthday-photos')!;
    birthdayPhotos.forEach(photo => {
      const frameDiv = document.createElement('div');
      birthdayContainer.appendChild(frameDiv);
      new PhotoFrame(frameDiv, photo);
    });

    // Family photos
    const familyPhotos = getPhotosBySection('family');
    const familyContainer = document.getElementById('family-photos')!;
    familyPhotos.forEach(photo => {
      const frameDiv = document.createElement('div');
      familyContainer.appendChild(frameDiv);
      new PhotoFrame(frameDiv, photo);
    });

    // Collage photos
    const collagePhotos = getPhotosBySection('collage');
    const collageContainer = document.getElementById('collage-photos')!;
    collagePhotos.forEach(photo => {
      const frameDiv = document.createElement('div');
      collageContainer.appendChild(frameDiv);
      new PhotoFrame(frameDiv, photo);
    });
  }

  private renderInteractiveLetters() {
    new InteractiveLetter(
      document.getElementById('letter-missing')!,
      'Open when you are missing me',
      `Mummy,\n\nI know the distance between us feels hard sometimes. I miss you too.\n\nBut no matter how far apart we are, you're always right here with me - in my thoughts, in my heart.\n\nI carry you with me everywhere I go.\n\nKnow that I'm thinking of you right now, and I love you so much.\n\n- Your Son\n  SoanPapdi`
    );
    
    new InteractiveLetter(
      document.getElementById('letter-tired')!,
      'Open when you are feeling tired',
      `Mummy,\n\nI know you give and give so much every single day.\n\nPlease, rest. You deserve it.\n\nYou don't have to earn rest by working harder. You deserve to rest just because you are you.\n\nYour worth isn't in how much you do - it's in the beautiful person that you are.\n\nTake care of yourself, please. I want you to be well.\n\n- Your Son\n  SoanPapdi`
    );
    
    new InteractiveLetter(
      document.getElementById('letter-worrying')!,
      'Open when you are worrying about me',
      `Mummy,\n\nI know you worry because you love me so much. And I love you for that.\n\nBut please don't worry so much. Everything you taught me is still with me.\n\nI'm okay. I'm taking care of myself.\n\nYou did your job so well loving me all these years.\n\n- Your Son\n  SoanPapdi`
    );
    
    new InteractiveLetter(
      document.getElementById('letter-happiness')!,
      'Open when you need a little happiness',
      `Mummy,\n\nDo you know how proud I am of you?\n\nEvery time your students tell me how sweet and caring you are, my heart fills with joy because I get to say - yes, that's my Mummy.\n\nYour kindness lights up so many lives. And it has always been the light in mine.\n\nJust thinking of you makes me smile. I hope this makes you smile too.\n\n- Your Son\n  SoanPapdi`
    );
    
    new InteractiveLetter(
      document.getElementById('letter-love')!,
      'Open when you want to know how much I love you',
      `Mummy,\n\nMore than you'll ever know.\n\nMore than all the care, more than all the sacrifices, more than all the Maggi at 2 AM.\n\nI love you for your heart, for your strength, for your gentleness, for your love.\n\nI love you for being you.\n\nAnd I want you to know from the bottom of my heart...\n\nI LOVE YOU VERY MUCH.\n\n- Your Son\n  SoanPapdi`
    );
  }

  private renderKonkaniPhrases() {
    const container = document.getElementById('konkani-phrases')!;
    const phrase = konkaniPhrases.find(p => p.section === 'konkani-voice');
    if (phrase) {
      const phraseEl = document.createElement('div');
      phraseEl.className = 'konkani-phrase reveal';
      phraseEl.innerHTML = `
        <blockquote class="konkani-phrase__text">
          ${phrase.phrase}
        </blockquote>
      `;
      container.appendChild(phraseEl);
    } else {
      const message = document.createElement('div');
      message.className = 'story-content reveal';
      message.innerHTML = '<p style="text-align: center; font-style: italic; color: var(--color-text-secondary);">Some words live in our hearts, waiting to be shared.</p>';
      container.appendChild(message);
    }
  }

  private setupBirthdayAudio() {
    const audio = document.getElementById('birthday-audio') as HTMLAudioElement;
    if (audio) {
      this.birthdayAudio = audio;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay blocked; user can toggle tone on via the button
        });
      }
    }
  }

  private setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);
    
    document.querySelectorAll('.reveal').forEach(el => {
      observer.observe(el);
    });
  }

  private setupBirthdayToggle() {
    const toggle = document.querySelector('.birthday-toggle') as HTMLElement;
    const button = toggle.querySelector('.birthday-toggle__button') as HTMLButtonElement;
    const isOn = localStorage.getItem('birthday-bg') !== 'off';

    if (isOn) {
      document.body.classList.add('birthday-bg--on');
      if (this.birthdayAudio) {
        this.birthdayAudio.muted = false;
      }
    } else {
      if (this.birthdayAudio) {
        this.birthdayAudio.muted = true;
      }
    }

    button.addEventListener('click', () => {
      const currentlyOn = document.body.classList.toggle('birthday-bg--on');
      localStorage.setItem('birthday-bg', currentlyOn ? 'on' : 'off');
      button.setAttribute('aria-pressed', String(currentlyOn));
      button.querySelector('.birthday-toggle__label')!.textContent = currentlyOn
        ? 'Turn off birthday tone'
        : 'Turn on birthday tone';
      if (this.birthdayAudio) {
        this.birthdayAudio.muted = !currentlyOn;
        if (currentlyOn) {
          this.birthdayAudio.play().catch(() => {});
        }
      }
    });
  }
}

new MummyBirthdayApp();
