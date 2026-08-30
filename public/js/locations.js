import gsap from 'gsap';

const locations = [
  { city: 'Beverly Hills', country: 'United States', address: '287 Rodeo Drive, Beverly Hills, CA 90210', hours: 'Mon-Sun: 6:30 AM - 11:00 PM', emoji: '🌴' },
  { city: 'Tokyo Ginza', country: 'Japan', address: '4-5-6 Ginza, Chuo City, Tokyo 104-0061', hours: 'Mon-Sun: 7:00 AM - 10:00 PM', emoji: '🗼' },
  { city: 'Istanbul', country: 'Turkey', address: 'Nişantaşı Abdi İpekçi Cad. No: 42, Istanbul', hours: 'Mon-Sun: 8:00 AM - Midnight', emoji: '🕌' },
  { city: 'London Mayfair', country: 'United Kingdom', address: '15 Bond Street, Mayfair, London W1S 2QT', hours: 'Mon-Sun: 7:00 AM - 10:30 PM', emoji: '🇬🇧' },
  { city: 'Milan', country: 'Italy', address: 'Via Monte Napoleone 8, Milan 20121', hours: 'Mon-Sun: 7:30 AM - 11:00 PM', emoji: '🏛️' },
  { city: 'Seoul Gangnam', country: 'South Korea', address: 'Apgujeong-ro, Gangnam-gu, Seoul', hours: 'Mon-Sun: 8:00 AM - 11:00 PM', emoji: '🇰🇷' }
];

export function initLocations() {
  const grid = document.getElementById('locations-grid');
  if (!grid) return;
  
  grid.innerHTML = '';
  locations.forEach(loc => {
    const card = document.createElement('div');
    card.className = 'location-card';
    card.innerHTML = `
      <div class="location-emoji">${loc.emoji}</div>
      <h3 class="location-city">${loc.city}</h3>
      <p class="location-country">${loc.country}</p>
      <p class="location-address">${loc.address}</p>
      <div class="location-hours">
        <span>🕒</span>
        <span>${loc.hours}</span>
      </div>
      <a href="#menu-section" class="location-directions">Visit Roastery →</a>
    `;
    grid.appendChild(card);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        gsap.fromTo('#locations-grid .location-card',
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
        );
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  const section = document.getElementById('locations-section');
  if (section) observer.observe(section);
}
