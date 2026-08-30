import gsap from 'gsap';
import { register, login, getToken, setToken, setUser } from './api.js';
import { updateUserGreetings } from './greeting.js';

export function initIntro(onComplete) {
  const introScreen = document.getElementById('intro-screen');
  const enterBtn = document.getElementById('enter-btn');
  const nameInput = document.getElementById('user-name');
  const phoneInput = document.getElementById('user-phone');
  const errorText = document.getElementById('intro-error');
  
  if (getToken()) {
    introScreen.classList.add('hidden');
    updateUserGreetings();
    onComplete();
    return;
  }
  
  enterBtn.addEventListener('click', async () => {
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    
    if (!name || !phone) {
      errorText.textContent = 'Please enter both your name and phone number.';
      errorText.style.display = 'block';
      return;
    }
    
    try {
      errorText.style.display = 'none';
      let res;
      try {
        res = await register(name, phone);
      } catch (err) {
        res = await login(phone);
      }

      if (res && res.token) {
        setToken(res.token);
        const userData = { ...res.user, name: name || res.user?.name, phone: phone || res.user?.phone };
        setUser(userData);
        updateUserGreetings();
      }
      
      gsap.to(introScreen, {
        opacity: 0,
        scale: 1.05,
        duration: 0.5,
        ease: 'power2.inOut',
        onComplete: () => {
          introScreen.classList.add('hidden');
          updateUserGreetings();
          onComplete();
        }
      });
    } catch (e) {
      errorText.textContent = 'Error: ' + e.message;
      errorText.style.display = 'block';
    }
  });
}
