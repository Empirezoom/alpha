// document.addEventListener('DOMContentLoaded', function() {
//     var chatBox = document.querySelector('.admin-chat-messages');
//     if (chatBox) {
//         chatBox.scrollTop = chatBox.scrollHeight;
//     }
// });




  // Global variables for file handling
    let selectedFile = null;

    // Quick responses database
    const quickResponses = {
      deposit: 'To deposit, go to the Deposit page, select your method, and follow the on-screen instructions.',
      withdraw: 'Withdrawals are processed within 24 hours. You can check the status on your Withdrawal History page.',
      standard: '"Thank you for contacting Alpicap Pro Support. My name is [Agent Name]. How may I assist you today?"',
      acknowledge: 'I understand you are having trouble with a [deposit]. I can certainly see why that would be concerning, and I am here to help you sort this out.',
      security: 'Before we proceed, for security purposes, could you please verify your [Full Name] and [Date of Birth / Email Address on the account] for me?',
      gather: 'To locate the transaction, could you please provide the amount, the date of the deposit, and the transaction ID or reference number?',
      successful: 'Thank you for that information. I have checked your account, and I can confirm that the deposit of $[Amount] on [Date] was successful. The funds have been credited to your account',
      pending: 'I can see the transaction is currently pending. Deposits made via [Payment Method] can sometimes take up to [Timeframe, e.g., 15 minutes or 2 hours] to reflect. I assure you the system is processing it.',
      deposit_option: '"Great! We have several options available. For the fastest and most reliable deposits, I highly recommend using one of our cryptocurrency options like Bitcoin (₿) or Solana (☀️).',
      greeting: 'Hello! Thank you for contacting support. How can I help you today?'
    };

    // File type icons mapping
    const fileIcons = {
      pdf: 'fas fa-file-pdf',
      doc: 'fas fa-file-word',
      docx: 'fas fa-file-word',
      xls: 'fas fa-file-excel',
      xlsx: 'fas fa-file-excel',
      ppt: 'fas fa-file-powerpoint',
      pptx: 'fas fa-file-powerpoint',
      txt: 'fas fa-file-alt',
      jpg: 'fas fa-file-image',
      jpeg: 'fas fa-file-image',
      png: 'fas fa-file-image',
      gif: 'fas fa-file-image',
      mp4: 'fas fa-file-video',
      mp3: 'fas fa-file-audio',
      zip: 'fas fa-file-archive',
      rar: 'fas fa-file-archive',
      default: 'fas fa-file'
    };

    // Mobile Menu Functions
    function toggleMobileMenu() {
      const menu = document.getElementById('mobileMenu');
      const overlay = document.getElementById('mobileMenuOverlay');
      
      if (menu.classList.contains('active')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    }

    function openMobileMenu() {
      const menu = document.getElementById('mobileMenu');
      const overlay = document.getElementById('mobileMenuOverlay');
      const menuToggle = document.querySelector('.menu-toggle');
      
      menu.classList.add('active');
      overlay.classList.add('active');
      menuToggle.innerHTML = '<i class="fas fa-times"></i>';
      document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
      const menu = document.getElementById('mobileMenu');
      const overlay = document.getElementById('mobileMenuOverlay');
      const menuToggle = document.querySelector('.menu-toggle');
      
      menu.classList.remove('active');
      overlay.classList.remove('active');
      menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
      document.body.style.overflow = '';
    }

    // Auto-resize textarea
    const messageInput = document.getElementById('messageInput');
    messageInput.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = Math.min(this.scrollHeight, 128) + 'px';
    });

    // Send message function
    function sendMessage() {
      const input = document.getElementById('messageInput');
      const text = input.value.trim();

      if (text || selectedFile) {
        let messageContent = text;
        
        // If there's a file attached, include it in the message
        if (selectedFile) {
          const fileInfo = `📎 ${selectedFile.name} (${(selectedFile.size / 1024 / 1024).toFixed(2)} MB)`;
          messageContent = text ? `${text}\n\n${fileInfo}` : fileInfo;
        }

        addMessage('admin', messageContent);
        input.value = '';
        input.style.height = 'auto';
        
        // Clear the file after sending
        if (selectedFile) {
          removeFile();
        }
      }
    }

    // Add message to chat
    function addMessage(sender, text) {
      const container = document.getElementById('messagesContainer');
      const messageDiv = document.createElement('div');
      messageDiv.className = `message ${sender}`;
      
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      });

      messageDiv.innerHTML = `
        ${text.replace(/\n/g, '<br>')}
        <div class="message-time">${timeString}</div>
      `;

      container.appendChild(messageDiv);
      container.scrollTop = container.scrollHeight;
    }

    // Use quick response
    function useQuickResponse(type) {
      const input = document.getElementById('messageInput');
      input.value = quickResponses[type];
      input.focus();
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 128) + 'px';
    }

    // File handling functions
    function attachFile() {
      closeMobileMenu();
      document.getElementById('fileInput').click();
    }

    function handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        selectedFile = file;
        displaySelectedFile(file);
        updateAttachButton(true);
        showNotification(`File "${file.name}" selected`, 'success');
      }
    }

    function displaySelectedFile(file) {
      const fileDisplay = document.getElementById('fileDisplay');
      const fileName = document.getElementById('fileName');
      const fileSize = document.getElementById('fileSize');
      const fileIcon = document.querySelector('.file-icon i');
      
      // Get file extension and appropriate icon
      const extension = file.name.split('.').pop().toLowerCase();
      const iconClass = fileIcons[extension] || fileIcons.default;
      
      // Update display
      fileName.textContent = file.name;
      fileSize.textContent = `${(file.size / 1024 / 1024).toFixed(2)} MB`;
      fileIcon.className = iconClass;
      
      // Show the file display
      fileDisplay.classList.add('active');
    }

    function removeFile() {
      selectedFile = null;
      const fileDisplay = document.getElementById('fileDisplay');
      const fileInput = document.getElementById('fileInput');
      
      fileDisplay.classList.remove('active');
      fileInput.value = ''; // Clear the file input
      updateAttachButton(false);
      showNotification('File removed', 'info');
    }

    function updateAttachButton(hasFile) {
      const attachBtn = document.getElementById('attachBtn');
      if (hasFile) {
        attachBtn.classList.add('has-file');
        attachBtn.title = 'File attached - Click to change';
      } else {
        attachBtn.classList.remove('has-file');
        attachBtn.title = 'Attach File';
      }
    }

    // Modal functions
    function showProfileModal() {
      document.getElementById('profileModal').classList.add('active');
    }

    function hideProfileModal() {
      document.getElementById('profileModal').classList.remove('active');
    }

    // Chat action functions
    function goBack() {
      if (confirm('Are you sure you want to go back? Any unsent messages will be lost.')) {
        closeMobileMenu();
        showNotification('Navigating back to chat list...', 'info');
        setTimeout(() => {
          window.location.href = '/admin/chats';
        }, 1000);
      }
    }

    function toggleTyping() {
      closeMobileMenu();
      showNotification('Typing indicator sent to user', 'success');
    }

    function viewProfile() {
      closeMobileMenu();
      showNotification('Opening user profile...', 'info');
      setTimeout(() => {
        alert('User Profile:\n\nName: {{ chat_user.first_name }} {{ chat_user.last_name }}\nEmail: {{ chat_user.email }}nAccount Unique ID: {{ chat_user.userId }}\nJoin Date: {{chat_user.created_at}}\nMain ID: {{ chat_user.main_id}}');
      }, 500);
    }

    function muteUser() {
      closeMobileMenu();
      if (confirm('Mute this user? They will not be able to send new messages.')) {
        showNotification('User has been muted', 'warning');
      }
    }

    function endChat() {
      closeMobileMenu();
      if (confirm('End this chat session? This action cannot be undone.')) {
        showNotification('Ending chat session...', 'info');
        setTimeout(() => {
          window.location.href = '/admin/chats';
        }, 1000);
      }
    }

    // Notification system
    function showNotification(message, type = 'info') {
      const notification = document.createElement('div');
      const colors = {
        success: 'var(--success)',
        warning: 'var(--warning)',
        error: 'var(--error)',
        info: 'var(--primary)'
      };
      
      notification.style.cssText = `
        position: fixed;
        top: 1rem;
        right: 1rem;
        background: ${colors[type]};
        color: white;
        padding: 0.75rem 1rem;
        border-radius: var(--radius-lg);
        font-size: 0.875rem;
        z-index: 3000;
        box-shadow: var(--shadow-lg);
        animation: slideInNotification 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
      `;
      notification.textContent = message;
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.style.animation = 'slideOutNotification 0.3s ease forwards';
        setTimeout(() => {
          notification.remove();
        }, 300);
      }, 3000);
    }

    // Click outside modal to close
    window.addEventListener('click', function(event) {
      const modal = document.getElementById('profileModal');
      if (event.target === modal) {
        hideProfileModal();
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(event) {
      // Ctrl/Cmd + Enter to send message
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        sendMessage();
      }
      
      // Escape to close modal or mobile menu
      if (event.key === 'Escape') {
        hideProfileModal();
        closeMobileMenu();
      }
    });

    // Add CSS animations for notifications
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideInNotification {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @keyframes slideOutNotification {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);

    // Initialize chat
    document.addEventListener('DOMContentLoaded', function() {
      // Focus on input when page loads
      messageInput.focus();
      
      // Scroll to bottom of messages
      const container = document.getElementById('messagesContainer');
      container.scrollTop = container.scrollHeight;
      
      // Add welcome message after a short delay
      setTimeout(() => {
        const welcomeMsg = document.createElement('div');
        welcomeMsg.style.cssText = `
          text-align: center;
          color: var(--text-muted);
          font-size: 0.875rem;
          padding: 1rem;
          margin: 0.5rem 0;
          border-radius: var(--radius-lg);
          background: rgba(148, 163, 184, 0.05);
          border: 1px solid var(--glass-border);
        `;
        welcomeMsg.innerHTML = '<i class="fas fa-shield-alt"></i> Secure admin chat session established';
        container.appendChild(welcomeMsg);
        container.scrollTop = container.scrollHeight;
      }, 1000);
    });

    // Handle window resize to close mobile menu
    window.addEventListener('resize', function() {
      if (window.innerWidth > 768) {
        closeMobileMenu();
      }
    });

    // Prevent body scroll when mobile menu is open
    document.addEventListener('touchmove', function(event) {
      const menu = document.getElementById('mobileMenu');
      if (menu.classList.contains('active') && !menu.contains(event.target)) {
        event.preventDefault();
      }
    }, { passive: false });
























window.addEventListener('load', function() {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => loader.style.display = 'none', 300);
  }
});
