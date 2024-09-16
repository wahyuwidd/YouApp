// Establish the Socket.IO connection
const socket = io('http://localhost:3000', {
  });
// Elements
const chatBox = document.getElementById('chat-box');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');

const roomId = "myChatRoom";  // Define room ID, could be dynamic based on your logic

// Join the chat room
socket.emit('joinRoom', roomId);

// Listen for incoming messages and append them to the chat box
socket.on('receiveMessage', (data) => {
  appendMessage(`${data.senderId}: ${data.message}`);
});

// Send message when button is clicked
sendBtn.addEventListener('click', () => {
  sendMessage();
});

// Send message when pressing Enter
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

// Send message to the server
function sendMessage() {
  const message = messageInput.value.trim();

  if (message !== '') {
    // Replace 'userA' with the actual sender's ID, and 'userB' with the receiver's ID
    socket.emit('sendMessage', { room: roomId, message: message, senderId: 'userA', receiverId: 'userB' });

    // Append your own message to the chat box
    appendMessage(`You: ${message}`);
    messageInput.value = '';  // Clear the input field
  }
}

// Append messages to the chat box
function appendMessage(message) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  messageElement.textContent = message;
  chatBox.appendChild(messageElement);

  // Scroll to the latest message
  chatBox.scrollTop = chatBox.scrollHeight;
}
