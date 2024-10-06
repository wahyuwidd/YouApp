document.addEventListener('DOMContentLoaded', function() {
    const socket = io('http://localhost:3000');
    // Check if connection is established
socket.on('connect', () => {
    console.log('Connected to WebSocket server');
  });
  
  socket.on('connect_error', (error) => {
    console.error('Connection Error:', error);
  });
  const userid = localStorage.getItem('userid')
  console.log('id', userid);
socket.emit('register', { userId: userid, userid });
 
  socket.on('allMessages', (data) => {
    const uniqueDataMap = new Map();
  
    data.forEach(item => {
      if (item && item.senderId) {
        uniqueDataMap.set(item.senderId, item);
      }
    });
  
    const avatarContainer = document.getElementById('chat-avatar');
    avatarContainer.innerHTML = '';
  
    uniqueDataMap.forEach((item) => {
      appendAvatar(item);
    });
})

    

    function appendAvatar(data) {
        console.log(data);
        const chatBox = document.getElementById('chat-avatar');
        const chatBoxContainer = document.createElement('div');
        chatBoxContainer.classList.add('yuchat-avatar-container');
        chatBox.appendChild(chatBoxContainer);
        const avatar = document.createElement('img');
        avatar.height = 40;
        avatar.src = data.senderProfilePic;
        const messagecontent = document.createElement('div');
        messagecontent.classList.add('yuchat-message');
        messagecontent.textContent = data.message;
        const yuchatname = document.createElement('div');
        yuchatname.classList.add('yuchat-name');
        yuchatname.textContent = data.senderUsername;
        chatBoxContainer.appendChild(avatar);
        chatBoxContainer.appendChild(yuchatname);
        yuchatname.appendChild(messagecontent);
    }


    avatarClick = document.getElementById('chat-avatar');

    avatarClick.addEventListener('click', function() {
        localStorage.setItem('avatar', 'https://cdn-icons-png.flaticon.com/512/149/149071.png');
        localStorage.setItem('user_name_receiver', 'Yu');
        localStorage.setItem('user_id_receiver', '66e8125c5465ae4f595bb238')
        window.location.href = 'chatroom.html';
    })

    const searchBox = document.getElementById('search-box');
    const searchResults = document.getElementById('search-results');

searchBox.addEventListener('input', async (e) => {
  const query = e.target.value;

  if (query.trim().length === 0) {
    searchResults.innerHTML = '';
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/users/search?q=${query}`);
    const users = await response.json();
    const currentUserId = localStorage.getItem('userid');
    console.log(currentUserId);
    const filteredUsers = users.filter(user => user._id !== currentUserId);
    searchResults.innerHTML = filteredUsers
      .map(user => `<li class="chat-avatar" data-user-id="${user._id}" data-username="${user.username}" data-profile-pic="${user.profilePic}"><img src="${user.profilePic}" height="40" alt="" />${user.username}</li>`)
      .join('');

    document.querySelectorAll('#search-results li').forEach(item => {
      item.addEventListener('click', () => {
        const profilePic = item.getAttribute('data-profile-pic');
        const userId = item.getAttribute('data-user-id');
        const username = item.getAttribute('data-username');
        // Call a function to open chat with the selected user
        openChatWithUser(userId, username, profilePic);
      });
    });
  } catch (error) {
    console.error('Error fetching users:', error);
  }
});

function openChatWithUser(userId, username, profilePic) {
  // Handle logic to open chat with the selected user
  localStorage.setItem('profilePic_receiver', profilePic)
  localStorage.setItem('user_id_receiver', userId);
  localStorage.setItem('user_name_receiver', username);
  window.location.href = 'chatroom.html';
}
})