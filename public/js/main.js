const chatForm = $('#chat-form');
const chatMessages = $('.chat-messages');
const roomName = $('#room-name');
const usernameInput = $('#username');
const userList = $('#users');
const joinBtn = $('#home-join-room-btn');
const orangeThemeBtn = $('#orange-theme');
const darkThemeBtn = $('#dark-theme');
const beigeThemeBtn = $('#beige-theme');
const greenThemeBtn = $('#green-theme');

// Colors for themes
const darkThemeBg = 'rgb(18, 9, 70)';
const darkThemeText = 'limegreen';
const darkThemeHover = 'yellow';
const darkThemeChat = 'rgb(51, 38, 120)';
const darkThemeTooltipText = 'black';

const orangeThemeBg = 'rgb(247, 160, 30)';
const orangeThemeText = 'black';
const orangeThemeHover = '#ffcba4';
const orangeThemeChat = 'rgb(255, 189, 89)';
const orangeThemeTooltipText = 'white';

const beigeThemeBg = '#cfb997';
const beigeThemeText = 'black'; 
const beigeThemeHover = 'rgb(145, 130, 89)';
const beigeThemeChat = '#e8dcb5';
const beigeThemeTooltipText = 'white';

const greenThemeBg = 'green';
const greenThemeText = 'black'; 
const greenThemeHover = 'lightblue';
const greenThemeChat = '#08c738';
const greenThemeTooltipText = 'black';


// Change theme to the corresponding one when its button is clicked
orangeThemeBtn.click(() => {
  $(':root').css({'--theme-bg': orangeThemeBg, '--theme-text': orangeThemeText, '--theme-hover': orangeThemeHover, 
                  '--theme-chat': orangeThemeChat, '--tooltip-txt-color': orangeThemeTooltipText});
});

darkThemeBtn.click(() => {
  $(':root').css({'--theme-bg': darkThemeBg, '--theme-text': darkThemeText, '--theme-hover': darkThemeHover, 
                  '--theme-chat': darkThemeChat, '--tooltip-txt-color': darkThemeTooltipText});
});

beigeThemeBtn.click(() => {
  $(':root').css({'--theme-bg': beigeThemeBg, '--theme-text': beigeThemeText, '--theme-hover': beigeThemeHover, 
                  '--theme-chat': beigeThemeChat, '--tooltip-txt-color': beigeThemeTooltipText});
});

greenThemeBtn.click(() => {
  $(':root').css({'--theme-bg': greenThemeBg, '--theme-text': greenThemeText, '--theme-hover': greenThemeHover, 
                  '--theme-chat': greenThemeChat, '--tooltip-txt-color': greenThemeTooltipText});
});

// Checks for name with only spaces 
joinBtn.click(() => {
  if (!usernameInput.val().replace(/\s/g, '').length) {
    usernameInput.get(0).setCustomValidity('Contains only white space. Add a non white-space character.');
  }
  else {
    usernameInput.get(0).setCustomValidity('');
  }
});

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();


// Join chatroom
socket.emit('joinRoom', { username, room });


// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});


// Message from server
socket.on('message', (message) => {
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});


// Message submit
chatForm.submit(e => {
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
  const div = $('<div></div>');
  div.addClass('message');

  const p = $('<p></p>');
  p.addClass('meta');
  p.text(message.username);
  p.append(`<span>${message.time}</span>`);
  div.append(p);

  const para = $('<p></p>');
  para.addClass('text');
  para.text(message.text);
  div.append(para);

  $('.chat-messages').append(div);
}


// Add room name to DOM
function outputRoomName(room) {
  roomName.text(room);
}


// Add users to DOM
function outputUsers(users) {
  userList.html('');
  users.forEach((user) => 
  {
    const li = $('<li></li>');
    li.text(user.username);
    userList.append(li);
  });
}


//Prompt the user before leave chat room
$('#leave-btn').click(() => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) { window.location = '../home.html';}
  else {}
});