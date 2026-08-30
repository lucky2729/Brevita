import gsap from 'gsap';

const chapters = [
  {
    badge: 'Chapter 01 — Terroir',
    title: 'Single Origin Geisha',
    desc: 'Cultivated at high altitudes in the Ethiopian highlands, every bean encapsulates the essence of its volcanic soil. Sun-dried and meticulously selected to absolute perfection.'
  },
  {
    badge: 'Chapter 02 — Precision',
    title: 'Micrometric Grind',
    desc: 'Titanium-coated flat burrs ensure a flawless particle distribution. Each microlot is precisely calibrated to unlock profound floral and cocoa aromatics.'
  },
  {
    badge: 'Chapter 03 — Pressure',
    title: '9-Bar Alchemy',
    desc: 'Extracting the elusive soul of the roast. A precise 9-bar pressure profile paired with dual-boiler thermal stability coax out unparalleled natural sweetness.'
  },
  {
    badge: 'Chapter 04 — Masterpiece',
    title: 'Liquid Velvet',
    desc: 'Crowned with a dense hazelnut crema, delivering a complex and unforgettable sensory journey. Sip the culmination of our relentless pursuit of excellence.'
  }
];

let activeChapterIndex = 0;
let chapterInterval = null;

export function initScrollTimeline() {
  setupChapterSwitching();
  setupVideoFadeOnScroll();
}

function setupChapterSwitching() {
  const pills = document.querySelectorAll('.chapter-pill');
  if (!pills.length) return;

  const updateChapter = (index) => {
    activeChapterIndex = index;
    const chapter = chapters[index];
    if (!chapter) return;

    pills.forEach((p, i) => p.classList.toggle('active', i === index));

    const badgeEl = document.getElementById('hero-chapter-badge');
    const titleEl = document.getElementById('hero-chapter-title');
    const descEl = document.getElementById('hero-chapter-desc');

    if (titleEl && descEl) {
      gsap.to([badgeEl, titleEl, descEl], {
        opacity: 0,
        y: -10,
        duration: 0.25,
        onComplete: () => {
          if (badgeEl) badgeEl.textContent = chapter.badge;
          if (titleEl) titleEl.textContent = chapter.title;
          if (descEl) descEl.textContent = chapter.desc;

          gsap.fromTo([badgeEl, titleEl, descEl],
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.35, stagger: 0.05, ease: 'power2.out' }
          );
        }
      });
    }
  };

  pills.forEach((pill, idx) => {
    pill.addEventListener('click', () => {
      clearInterval(chapterInterval);
      updateChapter(idx);
      startAutoCycle();
    });
  });

  const startAutoCycle = () => {
    clearInterval(chapterInterval);
    chapterInterval = setInterval(() => {
      const nextIndex = (activeChapterIndex + 1) % chapters.length;
      updateChapter(nextIndex);
    }, 6000);
  };

  startAutoCycle();
}

function setupVideoFadeOnScroll() {
  const bgVideo = document.getElementById('bg-video');
  if (!bgVideo) return;

  // Lightweight native scroll listener for high performance (60/120 fps)
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const heroHeight = window.innerHeight;
    
    if (scrollY < heroHeight) {
      const ratio = scrollY / heroHeight;
      bgVideo.style.opacity = (1 - ratio * 0.7).toString();
      bgVideo.style.transform = `scale(${1 + ratio * 0.05})`;
    } else {
      bgVideo.style.opacity = '0.2';
    }
  }, { passive: true });
}
