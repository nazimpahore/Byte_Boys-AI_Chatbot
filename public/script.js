// ====== Sidebar Toggle ======
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');

sidebarToggle.addEventListener('click', () => {
  sidebar.classList.toggle('active');
  overlay.classList.toggle('active');
});

overlay.addEventListener('click', () => {
  sidebar.classList.remove('active');
  overlay.classList.remove('active');
});

// ====== Subject Selection ======
const subjects = document.querySelectorAll('.subject');
let selectedSubject = 'math'; // Default subject

subjects.forEach(subject => {
  subject.addEventListener('click', () => {
    subjects.forEach(s => s.classList.remove('active'));
    subject.classList.add('active');
    selectedSubject = subject.dataset.subject;
  });
});

// ====== Chat Elements ======
const messagesContainer = document.getElementById('messagesContainer');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const clearChatButton = document.getElementById('clearChat');

// ====== Send Message ======
sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

async function sendMessage() {
  const message = messageInput.value.trim();
  if (message === '') return;

  // Add user message to UI
  addMessage('user', message);
  messageInput.value = '';

  try {
    const response = await fetch('http://127.0.0.1:3000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: message,
        subject: selectedSubject
      })
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    addMessage('bot', data.reply);
  } catch (error) {
    console.error('❌ Error:', error);
    addMessage('bot', '⚠️ Unable to connect to the server. Make sure the backend is running.');
  }
}

// ====== Add Message to UI ======
function addMessage(sender, text) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message');
  messageDiv.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
  messageDiv.textContent = text;
  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// ====== Clear Chat ======
clearChatButton.addEventListener('click', () => {
  messagesContainer.innerHTML = `
    <div class="welcome-message">
      <i class="fas fa-robot welcome-icon"></i>
      <h2>Hello! I'm your AI Tutor 🤖</h2>
      <p>Select a subject and start asking me questions. I'm here to help you learn!</p>
    </div>
  `;
});
