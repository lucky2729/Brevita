import { sendSupportMessage, getSupportMessages } from './api.js';
import gsap from 'gsap';

export function initSupport() {
  const toggleBtn = document.getElementById('chat-toggle');
  const closeBtn = document.getElementById('chat-close');
  const sendBtn = document.getElementById('chat-send');
  const input = document.getElementById('chat-input');
  const panel = document.getElementById('chat-panel');
  
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      panel.classList.toggle('open');
      if (panel.classList.contains('open')) {
        loadMessages();
        setTimeout(() => input.focus(), 300);
      }
    });
  }
  
  if (closeBtn) {
    closeBtn.addEventListener('click', () => panel.classList.remove('open'));
  }
  
  if (sendBtn && input) {
    sendBtn.addEventListener('click', handleSend);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSend();
    });
  }
  
  document.querySelectorAll('.quick-action-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const texts = {
        'Cancel Order': "I'd like to cancel my current order",
        'Track Order': "Can you help me track my order?",
        'Modify Order': "I need to modify my order",
        'Representative': "I'd like to speak with a representative"
      };
      if (input) {
        input.value = texts[btn.textContent] || btn.textContent;
        handleSend();
      }
    });
  });
}

async function loadMessages() {
  try {
    const messages = await getSupportMessages();
    const container = document.getElementById('chat-messages');
    if (!container) return;
    
    container.innerHTML = '';
    messages.forEach(msg => {
      addMessageToDOM(msg.text, msg.sender, false);
    });
    scrollToBottom();
  } catch (error) {
    console.error('Failed to load support messages:', error);
  }
}

async function handleSend() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;
  
  input.value = '';
  addMessageToDOM(text, 'user', true);
  
  // Show typing indicator or slight delay
  setTimeout(async () => {
    try {
      const response = await sendSupportMessage(text);
      if (response && response.response) {
        addMessageToDOM(response.response, 'bot', true);
      }
    } catch (error) {
      addMessageToDOM("Sorry, I'm having trouble connecting to support right now.", 'bot', true);
    }
  }, 1000);
}

function addMessageToDOM(text, sender, animate) {
  const container = document.getElementById('chat-messages');
  if (!container) return;
  
  const div = document.createElement('div');
  div.className = `chat-message ${sender}`;
  div.textContent = text;
  container.appendChild(div);
  
  if (animate) {
    gsap.fromTo(div, 
      { opacity: 0, y: 10, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'back.out(1.5)' }
    );
  }
  scrollToBottom();
}

function scrollToBottom() {
  const container = document.getElementById('chat-messages');
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}
