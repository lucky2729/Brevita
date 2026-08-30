import gsap from 'gsap';

export function fadeIn(element, options = {}) {
  return gsap.fromTo(element, 
    { opacity: 0, y: 30 }, 
    { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', ...options }
  );
}
export function fadeOut(element, options = {}) {
  return gsap.to(element, { opacity: 0, duration: 0.5, ease: 'power2.in', ...options });
}
export function slideIn(element, direction = 'left', options = {}) {
  const coords = { x: 0, y: 0 };
  if(direction === 'left') coords.x = -50;
  if(direction === 'right') coords.x = 50;
  if(direction === 'top') coords.y = -50;
  if(direction === 'bottom') coords.y = 50;
  return gsap.fromTo(element, 
    { opacity: 0, x: coords.x, y: coords.y }, 
    { opacity: 1, x: 0, y: 0, duration: 0.8, ease: 'power3.out', ...options }
  );
}
export function slideOut(element, direction = 'left', options = {}) {
  const coords = { x: 0, y: 0 };
  if(direction === 'left') coords.x = -50;
  if(direction === 'right') coords.x = 50;
  if(direction === 'top') coords.y = -50;
  if(direction === 'bottom') coords.y = 50;
  return gsap.to(element, { opacity: 0, x: coords.x, y: coords.y, duration: 0.5, ease: 'power3.in', ...options });
}
export function zoomIn(element, options = {}) {
  return gsap.fromTo(element, 
    { opacity: 0, scale: 0.8 }, 
    { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.5)', ...options }
  );
}
export function zoomOut(element, options = {}) {
  return gsap.to(element, { opacity: 0, scale: 0.8, duration: 0.4, ease: 'power2.in', ...options });
}
export function staggerIn(elements, options = {}) {
  return gsap.fromTo(elements, 
    { opacity: 0, y: 20 }, 
    { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: 'power2.out', ...options }
  );
}
export function revealText(element) {
  return gsap.fromTo(element, { opacity: 0 }, { opacity: 1, duration: 1, ease: 'none' });
}
export function showSection(sectionId) {
  const sections = ['#hero-section', '#menu-section', '#checkout-section', '#order-confirmation', '#locations-section'];
  sections.forEach(sec => {
    const el = document.querySelector(sec);
    if(el) {
      if(sec === sectionId) {
        el.style.display = 'block';
        fadeIn(el);
      } else {
        el.style.display = 'none';
      }
    }
  });
}
export function showModal(modalId) {
  const el = document.getElementById(modalId);
  if(el) {
    el.style.display = 'flex';
    zoomIn(el.querySelector('.modal-content'));
  }
}
export function hideModal(modalId) {
  const el = document.getElementById(modalId);
  if(el) {
    zoomOut(el.querySelector('.modal-content'), { onComplete: () => el.style.display = 'none' });
  }
}
