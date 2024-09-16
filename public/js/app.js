document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    if (token) {
      // User is logged in
      console.log('User logged in');
    } else {
      // Redirect to login page if not logged in
      window.location.href = 'index.html';
    }
    const userid = localStorage.getItem('userid')

// Establish the Socket.IO connection
const socket = io('http://localhost:3000', {
});
// Elements
const chatBox = document.getElementById('chat-box');
const idInput = document.getElementById('id-input');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
console.log('idInput', idInput);

const roomId = "myChatRoom";  // Define room ID, could be dynamic based on your logic
 // Register the user
 const userId = userid;
 
 const userName = 'user1'
 const receiverId = document.getElementById('id-input').value;
 socket.emit('register', { userId, receiverId });


// Join the chat room
socket.emit('joinRoom', roomId);

// Listen for incoming messages and append them to the chat box
socket.on('receiveMessage', (data) => {
appendMessage(`${data.senderId}: ${data.message}`);
});

socket.on('chatHistory', (chatHistory) => {
  chatHistory.forEach((message) => {
    const isSent = message.senderId === userId
      appendMessage(isSent ? `You: ${message.message}` : `${message.senderId}: ${message.message}`, isSent);
  });
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
const receiverId = idInput.value.trim();

if (message !== '') {
  // Replace 'userA' with the actual sender's ID, and 'userB' with the receiver's ID
  // socket.emit('sendMessage', { room: roomId, message: message, senderId: 'userA', receiverId: 'userB' });
  // const receiverId = '66e6a299204444f672875390'; // Replace with actual receiver ID
  const receiveName = 'user2';
  socket.emit('sendMessage', { senderId: userId, receiverId: receiverId, message });
  // Append your own message to the chat box
  const isSent = true 
      appendMessage(isSent ? `You: ${message}` : `${senderId}: ${message}`, isSent);
  messageInput.value = '';  // Clear the input field
  receiverId.value = '';
}
}

socket.on('newMessage', (data) => {
  const isSent = data.senderId === userId
      appendMessage(isSent ? `You: ${data.message}` : `${data.senderId}: ${data.message}`, isSent);
});

// Append messages to the chat box
function appendMessage(message, isSent) {
  const messageElement = document.createElement('div');
  messageElement.classList.add(isSent ? 'sent' : 'received');
  messageElement.textContent = message;
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight; // Auto scroll to the bottom
// Scroll to the latest message
chatBox.scrollTop = chatBox.scrollHeight;
}

  
});
  