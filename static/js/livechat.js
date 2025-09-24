// Show blue dot when admin replies
function showAdminReplyDot() {
    document.getElementById('adminReplyDot').style.display = 'flex';
}
function hideAdminReplyDot() {
    document.getElementById('adminReplyDot').style.display = 'none';
}
// Hide dot when user focuses input (i.e., sees the reply)
document.getElementById('chatInput').addEventListener('focus', hideAdminReplyDot);

function sendQuickChat(msg) {
    addChatMessage('user', msg);
    setTimeout(() => addChatMessage('admin', getAdminResponse(msg)), 800);
}
function sendChatMessage(e) {
    e.preventDefault();
    const input = document.getElementById('chatInput');
    if (input.value.trim()) {
    addChatMessage('user', input.value.trim());
    setTimeout(() => addChatMessage('admin', getAdminResponse(input.value.trim())), 800);
    input.value = '';
    }
    return false;
}
function addChatMessage(sender, text) {
    const chat = document.getElementById('chatMessages');
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message ' + (sender === 'user' ? 'user' : 'admin');
    msgDiv.textContent = text;
    chat.appendChild(msgDiv);
    chat.scrollTop = chat.scrollHeight;
    // If the message is from admin, show the blue dot
    if (sender === 'admin') {
    showAdminReplyDot();
    }
}
function getAdminResponse(msg) {
    msg = msg.toLowerCase();
    if (msg.includes('deposit')) return 'To deposit, click on the Deposit button, input your amount, payment method, active email & phone number then click Submit. Wait for a while as one of our representatives will get back to you shortly via LIVE CHAT.';
    if (msg.includes('withdraw')) return 'To withdraw, use the Withdrawal section and fill in your details, click on submit. Wait for a while and one of our representatives will get back to you shortly via LIVE CHAT.';
    if (msg.includes('how long') || msg.includes('payment')) return 'Deposits are instant after verification. Withdrawals are processed within 24 hours for maximum safety.';
    return 'Thank you for your message. An admin will respond shortly.';
}
function attachFileToChat(e) {
    const file = e.target.files[0];
    if (file) addChatMessage('user', '[File attached: ' + file.name + ']');
}
// Optional: Hide blue dot on page load (user is on chat page)
hideAdminReplyDot();





















































window.addEventListener('load', function() {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => loader.style.display = 'none', 300);
  }
});
