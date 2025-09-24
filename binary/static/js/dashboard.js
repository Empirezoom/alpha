











// --- Utility Functions ---

// Function to open a modal
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling background
    }
}

// Function to close a modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Restore scrolling
    }
}

// --- Header and Mobile Menu Logic (reused from login page) ---
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileNavOverlay = document.getElementById('mobileNavOverlay');
let isMenuOpen = false;

mobileMenuBtn.addEventListener('click', function() {
    isMenuOpen = !isMenuOpen;
    
    if (isMenuOpen) {
        mobileMenuBtn.classList.add('active');
        mobileNavOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        mobileMenuBtn.classList.remove('active');
        mobileNavOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

document.querySelectorAll('.mobile-nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        isMenuOpen = false;
        mobileMenuBtn.classList.remove('active');
        mobileNavOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});

mobileNavOverlay.addEventListener('click', function(e) {
    if (e.target === mobileNavOverlay) {
        isMenuOpen = false;
        mobileMenuBtn.classList.remove('active');
        mobileNavOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// --- Dashboard Specific JavaScript ---

// 1. User Profile Modal
const profileModal = document.getElementById('profileModal');
const viewProfileModalBtn = document.getElementById('viewProfileModalBtn');
const headerProfileBtn = document.getElementById('headerProfileBtn');
const mobileProfileBtn = document.getElementById('mobileProfileBtn');
const profileModalCloseBtn = profileModal.querySelector('.modal-close-button');

function populateProfileModal() {
    document.getElementById('modalUserId').textContent = currentUser.userId;
    document.getElementById('modalFirstName').textContent = currentUser.firstName;
    document.getElementById('modalLastName').textContent = currentUser.lastName;
    document.getElementById('modalEmail').textContent = currentUser.email;
    document.getElementById('modalCurrentBalance').textContent = '$' + currentUser.balance;
}

viewProfileModalBtn.addEventListener('click', () => {
 
    openModal('profileModal');
});
headerProfileBtn.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default anchor behavior
 
    openModal('profileModal');
});
mobileProfileBtn.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default anchor behavior
 
    openModal('profileModal');
});
profileModalCloseBtn.addEventListener('click', () => closeModal('profileModal'));
// Close modal if user clicks outside of it
profileModal.addEventListener('click', (e) => {
    if (e.target === profileModal) closeModal('profileModal');
});






// 2. Place Trade Section Logic

const assetData = {
    forex: ['EUR/USD', 'GBP/JPY', 'USD/CAD', 'AUD/NZD'],
    crypto: ['BTC/USD', 'ETH/USD', 'XRP/USD', 'LTC/USD'],
    stocks: ['AAPL', 'GOOGL', 'MSFT', 'AMZN'],
    commodities: ['Gold', 'Silver', 'Oil', 'Natural Gas']
};

const assetTypeButtons = document.querySelectorAll('.asset-selection .asset-button');
const investmentAmountInput = document.getElementById('investmentAmount');
const amountButtons = document.querySelectorAll('.amount-button');
const expiryButtons = document.querySelectorAll('.expiry-button');
const callButton = document.getElementById('callButton');
const putButton = document.getElementById('putButton');

let selectedAssetType = 'forex'; // Default active
let selectedAsset = 'EUR/USD'; // Default selected asset
let selectedAmount = 100;
let selectedExpiry = 1; // minutes

function renderAssetItems(type) {
    const container = document.getElementById('assetItemsContainer');
    container.innerHTML = '';
    assetData[type].forEach(asset => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'asset-item-button' + (asset === selectedAsset ? ' active' : '');
        btn.dataset.asset = asset;
        btn.textContent = asset;
        btn.onclick = () => {
            selectedAsset = asset;
            document.getElementById('assetInput').value = asset;
            renderAssetItems(selectedAssetType);
        };
        container.appendChild(btn);
    });
}

assetTypeButtons.forEach(button => {
    button.addEventListener('click', () => {
        assetTypeButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        selectedAssetType = button.dataset.assetType;
        // Reset selected asset to the first one in the new category
        selectedAsset = assetData[selectedAssetType][0]; 
        renderAssetItems(selectedAssetType);
    });
});



amountButtons.forEach(button => {
    button.addEventListener('click', () => {
        amountButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        selectedAmount = parseInt(button.dataset.amount);
        investmentAmountInput.value = selectedAmount; // Update input field
    });
});

investmentAmountInput.addEventListener('input', (e) => {
    selectedAmount = parseInt(e.target.value);
    // Remove active class from quick amount buttons if input is custom
    amountButtons.forEach(btn => {
        if (parseInt(btn.dataset.amount) === selectedAmount) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
});


expiryButtons.forEach(button => {
    button.addEventListener('click', () => {
        expiryButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        selectedExpiry = parseInt(button.dataset.expiry);
        console.log(`Selected Expiry: ${selectedExpiry} mins`);
    });
});

callButton.addEventListener('click', () => {
    if (selectedAsset && selectedAmount && selectedExpiry) {
        alert(`Placing CALL trade on ${selectedAsset} for $${selectedAmount} with ${selectedExpiry} min expiry.`);
        // In a real app: send data to server, update active trades table
        addTradeToActiveTrades(selectedAsset, 'Call', selectedAmount, selectedExpiry);
    } else {
        alert('Please select an asset, investment amount, and expiry time.');
    }
});

putButton.addEventListener('click', () => {
    if (selectedAsset && selectedAmount && selectedExpiry) {
        alert(`Placing PUT trade on ${selectedAsset} for $${selectedAmount} with ${selectedExpiry} min expiry.`);
        // In a real app: send data to server, update active trades table
        addTradeToActiveTrades(selectedAsset, 'Put', selectedAmount, selectedExpiry);
    } else {
        alert('Please select an asset, investment amount, and expiry time.');
    }
});







// Initialize asset items on load
renderAssetItems(selectedAssetType);



























// Example: Show notification dot if there are unread notifications
const notificationsBtn = document.getElementById('notificationsBtn');
const notificationList = document.getElementById('notificationList');
function updateNotifDot() {
  // Show dot if there is any notification with class 'error', 'warning', or not 'success'
  const hasUnread = Array.from(notificationList.children).some(
    n => n.classList.contains('error') || n.classList.contains('warning') || n.classList.contains('info')
  );
  if (hasUnread) {
    notificationsBtn.classList.add('has-unread');
  } else {
    notificationsBtn.classList.remove('has-unread');
  }
}
// Call updateNotifDot() after adding notifications








// --- Modal Open/Close Utility (already present) ---



// --- Live Chat Logic ---
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
}
function getAdminResponse(msg) {
  msg = msg.toLowerCase();
  if (msg.includes('deposit')) return 'To deposit, go click on  Deposit button, Input Your Amount,Payment Method,Active Email & Phone Number then Click Submit. Wait for a while as one of our representatives will get back to you shortly via LIVE CHAT .';
  if (msg.includes('withdraw')) return 'To withdraw, use the Withdrawal section and fill in your details,click on submit, Wait for a while and one of our representatives will get back to you shortly via LIVE CHAT ..';
  if (msg.includes('how long') || msg.includes('payment')) return 'Deposits are instant after Verification. Withdrawals are processed within 24 hours for maximum safety.';
  return 'Thank you for your message. An admin will respond shortly.';
}
function attachFileToChat(e) {
  const file = e.target.files[0];
  if (file) addChatMessage('user', '[File attached: ' + file.name + ']');
}

// --- Notification Modal Logic --- 
function openNotificationModal() {
  openModal('notificationModal');
  markNotificationsAsRead();
}
function addNotification(type, text) {
  const notifList = document.getElementById('notificationList');
  const notif = document.createElement('div');
  notif.className = 'notification-item ' + type;
  notif.innerHTML = text + '<span class="time">' + new Date().toLocaleString() + '</span>';
  notifList.prepend(notif);
  showNotifDot();
}
function showNotifDot() {
  document.getElementById('notifDot').style.opacity = 1;
}
function markNotificationsAsRead() {
  document.getElementById('notifDot').style.opacity = 0;
}

// --- Show login notification on page load ---
window.addEventListener('DOMContentLoaded', function() {
  addNotification('error', 'Login successful!');
  showNotifDot();
});






























window.addChatMessage = function(sender, text) {
  const chat = document.getElementById('chatMessages');
  const msgDiv = document.createElement('div');
  msgDiv.className = 'message ' + (sender === 'user' ? 'user' : 'admin');
  msgDiv.textContent = text;
  chat.appendChild(msgDiv);
  chat.scrollTop = chat.scrollHeight;

  // If the message is from admin, show the green dot
  if (sender === 'admin') {
    showChatNotifDot();
  }
};
















document.getElementById('frontIdCard').addEventListener('change', function(e) {
  const file = e.target.files[0];
  document.getElementById('frontIdCardName').textContent = file ? file.name : '';
});
document.getElementById('backIdCard').addEventListener('change', function(e) {
  const file = e.target.files[0];
  document.getElementById('backIdCardName').textContent = file ? file.name : '';
});




















function showFileName(event) {
    var fileInput = event.target;
    var fileNameDiv = document.getElementById('fileName');
    if (fileInput.files.length > 0) {
        fileNameDiv.textContent = "Selected: " + fileInput.files[0].name;
    } else {
        fileNameDiv.textContent = "";
    }
}






















































window.addEventListener('load', function() {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => loader.style.display = 'none', 300);
  }
});








