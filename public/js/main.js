const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from URL
const { username, room ,token} = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

//const token='Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiYThhOTQ5MjE3YTBhZjhhNjQwZmY2NmFjOWZlMjg1MDQ4MmUwNjRkMDhhOWE2OGYwNjlkNzA2NWNjYmYzMjI4ZGY3NjEwMzAxNTViZmJlOGIiLCJpYXQiOjE2NDI2ODA5MzYuNDI1MDgxOTY4MzA3NDk1MTE3MTg3NSwibmJmIjoxNjQyNjgwOTM2LjQyNTA4NjAyMTQyMzMzOTg0Mzc1LCJleHAiOjE2NzQyMTY5MzYuNDIxMzI0MDE0NjYzNjk2Mjg5MDYyNSwic3ViIjoiMiIsInNjb3BlcyI6W119.NO_vndImLJEuMfMrdwLIiyf3OqzF9p92K0p03nBFoo50rknQCXEboVb0QbAqbEjcGktCpUPry1vycx93am1jI8scYDn_QJRQyqMX1dRfOYzHBL_p09w5sGMdiqafgPGnN564x1MYZBb55N5INL3Z5AXB4I-WwIRhVle-H158icM0lm1D3OSxEekMn780PBvJna11QPKeGgtiWdMfnwN15szDXF36fadzSi9VkR01559yeOVr02PJoLTuJ1FNyfsc0mPz-7qC_wedhFINFwjgzpGinydnE9HLkW_SI2j4nze7JHLnTEU0NhHYtud3UIdtlUgl6VQzJZvmKIFtbouud7nlGAEntzUcv8n-M9TzORTjgsc2ar70o54xi-lxN4wwjpF9S1D3bV8FHiQDlZD4kmZNbjk9I-QHqSr7AeA77f1GGmc4N9k82lBYku31s3wdzcP8AYUMiYkCI_J_apne60OU5Zry0rPHYHctKWWdaJVFsKxhRVeoI8jj26sge0zCYQ0CXcq58i0cncarwa6m9oBXtHqKaum0NETydF7bxXCl1ysY3H-GmfjNIgCuJDAaa9ZAmo1EdfoXv8ZVY7N7kdD8kBtM0CdrZs1P-4sublmrX3t0DbKZH_TWXK3GLOPsLYcHypBmm5NfAp4uZLs6knMeJ-fegH40wku0lA08Mrc'
//const username=1;

// Join chatroom
socket.emit('joinRoom', { username, room ,token});

//get friends

socket.on('getFriends', ({ friends, pending_friends }) => {
  
  console.log({friends})
  console.log({pending_friends})
});


// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});
