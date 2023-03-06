const socket = io();

const chatBox = document.querySelector('.chat-box');
const messageInput = document.querySelector('input[type="text"]');
const sendButton = document.querySelector('input[type="submit"]');

sendButton.addEventListener('click', (e) => {
  e.preventDefault();
  const message = messageInput.value.trim();
  if (message) {
    socket.emit('chat message', message);
    messageInput.value = '';
  }
});

socket.on('chat message', (msg) => {
  const li = document.createElement('li');
  li.textContent = msg;
  chatBox.appendChild(li);
});
