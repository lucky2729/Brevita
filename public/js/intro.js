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
    const name = (nameInput.value || '').trim();
    const phone = (phoneInput.value || '').trim();
    
    if (!name || !phone) {
      errorText.textContent = 'Please enter both your name and mobile number.';
      errorText.style.display = 'block';
      return;
    }
    
    try {
      errorText.style.display = 'none';
      enterBtn.disabled = true;
      enterBtn.textContent = 'Entering Brevita...';

      let res;
      try {
        res = await register(name, phone);
      } catch (err) {
        res = await login(phone, name);
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
      console.error('Intro login error:', e);
      // Fallback guest login if server is starting or network hiccup
      const guestUser = { id: 1, name: name || 'Lucy', phone: phone || '1234567890' };
      setUser(guestUser);
      setToken('brevita-local-session-token');
      updateUserGreetings();
      
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
    } finally {
      if (enterBtn) {
        enterBtn.disabled = false;
        enterBtn.textContent = 'Enter the Experience →';
      }
    }
  });
}
