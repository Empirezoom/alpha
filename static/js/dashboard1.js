        // Data for assets (simplified for demonstration)
        const assetData = {
            forex: ['EUR/USD', 'GBP/JPY', 'USD/CAD', 'AUD/NZD'],
            crypto: ['BTC/USD', 'ETH/USD', 'XRP/USD', 'LTC/USD'],
            stocks: ['AAPL', 'GOOGL', 'MSFT', 'AMZN'],
            commodities: ['Gold', 'Silver', 'Oil', 'Natural Gas']
        };

        // Current user data (for profile modal)
        const currentUser = {
            userId: 'ATP-001234',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            balance: '12,500.75'
        };

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
            populateProfileModal();
            openModal('profileModal');
        });
        headerProfileBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default anchor behavior
            populateProfileModal();
            openModal('profileModal');
        });
        mobileProfileBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default anchor behavior
            populateProfileModal();
            openModal('profileModal');
        });
        profileModalCloseBtn.addEventListener('click', () => closeModal('profileModal'));
        // Close modal if user clicks outside of it
        profileModal.addEventListener('click', (e) => {
            if (e.target === profileModal) closeModal('profileModal');
        });


        // 2. Place Trade Section Logic
        const assetTypeButtons = document.querySelectorAll('.asset-selection .asset-button');
        const assetItemsContainer = document.getElementById('assetItemsContainer');
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
            assetItemsContainer.innerHTML = '';
            assetData[type].forEach(asset => {
                const button = document.createElement('button');
                button.classList.add('asset-item-button');
                button.textContent = asset;
                button.dataset.asset = asset;
                if (asset === selectedAsset) { // Re-select the previously chosen asset if available
                    button.classList.add('active');
                }
                assetItemsContainer.appendChild(button);
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

        // Event delegation for asset items to handle clicks efficiently
        assetItemsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('asset-item-button')) {
                document.querySelectorAll('.asset-item-button').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                selectedAsset = e.target.dataset.asset;
                console.log(`Selected Asset: ${selectedAsset}`);
            }
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


        // 3. Active Trades Section (Dynamic Updates)
        const activeTradesTableBody = document.getElementById('activeTradesTableBody');
        let activeTrades = [
            // Sample data, replace with real data from backend
            { id: 't1', asset: 'EUR/USD', type: 'Call', amount: 100, status: 'Active', timeLeft: 45 },
            { id: 't2', asset: 'BTC/USD', type: 'Put', amount: 50, status: 'Active', timeLeft: 130 }
        ];

        function addTradeToActiveTrades(asset, type, amount, expiryMinutes) {
            const newTrade = {
                id: 't' + Date.now(), // Simple unique ID
                asset,
                type,
                amount,
                status: 'Active',
                timeLeft: expiryMinutes * 60 // Convert to seconds
            };
            activeTrades.push(newTrade);
            renderActiveTrades();
            addNotification('info', `New Trade Placed: ${type} on ${asset} for $${amount}.`);
        }

        function renderActiveTrades() {
            activeTradesTableBody.innerHTML = '';
            activeTrades.forEach(trade => {
                const row = activeTradesTableBody.insertRow();
                row.innerHTML = `
                    <td>${trade.asset}</td>
                    <td>${trade.type}</td>
                    <td>$${trade.amount}</td>
                    <td class="status-active">${trade.status}</td>
                    <td id="time-${trade.id}">${formatTime(trade.timeLeft)}</td>
                `;
            });
        }

        function formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
        }

        // Simulate countdown and trade completion
        setInterval(() => {
            activeTrades = activeTrades.filter(trade => {
                trade.timeLeft--;
                const timeLeftElement = document.getElementById(`time-${trade.id}`);
                if (timeLeftElement) {
                    timeLeftElement.textContent = formatTime(trade.timeLeft);
                }

                if (trade.timeLeft <= 0) {
                    // Simulate trade result (random for demo)
                    const result = Math.random() > 0.5 ? 'Won' : 'Lost';
                    const profitLoss = result === 'Won' ? (trade.amount * 0.85).toFixed(2) : trade.amount.toFixed(2); // 85% payout
                    const profitLossSign = result === 'Won' ? '+' : '-';

                    // Add to trading history
                    addTradeToTradingHistory(new Date().toLocaleString(), trade.asset, trade.type, trade.amount, result, `${profitLossSign}$${profitLoss}`);
                    addNotification(result === 'Won' ? 'success' : 'error', `Trade ${result}! You ${result === 'Won' ? 'made a profit of' : 'lost'} ${profitLossSign}$${profitLoss} on ${trade.asset}.`);
                    return false; // Remove from active trades
                }
                return true;
            });
            // Re-render to remove completed trades visually
            renderActiveTrades(); // Could optimize to only remove rows, but re-rendering is simpler for demo
        }, 1000);

        renderActiveTrades(); // Initial render


        // 4. Trading History Section (Dynamic Updates)
        const tradingHistoryTableBody = document.getElementById('tradingHistoryTableBody');
        let tradingHistory = [
            // Sample data, replace with real data from backend
            { date: '2025-06-19 14:30', asset: 'GBP/JPY', type: 'Call', amount: 200, result: 'Won', profitLoss: '+$180.00' },
            { date: '2025-06-19 10:15', asset: 'Gold', type: 'Put', amount: 50, result: 'Lost', profitLoss: '-$50.00' },
            { date: '2025-06-18 09:00', asset: 'AAPL', type: 'Call', amount: 150, result: 'Won', profitLoss: '+$127.50' }
        ];

        function addTradeToTradingHistory(date, asset, type, amount, result, profitLoss) {
            tradingHistory.unshift({ date, asset, type, amount, result, profitLoss }); // Add to the top
            renderTradingHistory();
        }

        function renderTradingHistory() {
            tradingHistoryTableBody.innerHTML = '';
            tradingHistory.forEach(trade => {
                const row = tradingHistoryTableBody.insertRow();
                const resultClass = trade.result === 'Won' ? 'status-won' : 'status-lost';
                const profitLossStyle = trade.result === 'Won' ? 'color: #10b981;' : 'color: #ef4444;';
                row.innerHTML = `
                    <td>${trade.date}</td>
                    <td>${trade.asset}</td>
                    <td>${trade.type}</td>
                    <td>$${trade.amount}</td>
                    <td class="${resultClass}">${trade.result}</td>
                    <td style="${profitLossStyle}">${trade.profitLoss}</td>
                `;
            });
        }
        renderTradingHistory(); // Initial render

        // 5. Transaction History Section (Dynamic Updates)
        const transactionHistoryTableBody = document.getElementById('transactionHistoryTableBody');
        let transactionHistory = [
            // Sample data
            { date: '2025-06-20 08:00', type: 'Deposit', amount: 1000, method: 'Bank Transfer', status: 'Completed' },
            { date: '2025-06-15 16:30', type: 'Withdrawal', amount: 500, method: 'Crypto', status: 'Processing' },
            { date: '2025-06-10 11:00', type: 'Deposit', amount: 200, method: 'Credit Card', status: 'Completed' }
        ];

        function addTransaction(date, type, amount, method, status) {
            transactionHistory.unshift({ date, type, amount, method, status });
            renderTransactionHistory();
            const notificationType = status === 'Completed' ? 'success' : 'info'; // Or warning for processing
            addNotification(notificationType, `${type} of $${amount} via ${method} is ${status}.`);
        }

        function renderTransactionHistory() {
            transactionHistoryTableBody.innerHTML = '';
            transactionHistory.forEach(tx => {
                const row = transactionHistoryTableBody.insertRow();
                let statusClass = '';
                if (tx.status === 'Completed') statusClass = 'status-won';
                else if (tx.status === 'Processing') statusClass = 'status-pending';
                else if (tx.status === 'Failed') statusClass = 'status-lost';

                row.innerHTML = `
                    <td>${tx.date}</td>
                    <td>${tx.type}</td>
                    <td>$${tx.amount}</td>
                    <td>${tx.method}</td>
                    <td class="${statusClass}">${tx.status}</td>
                `;
            });
        }
        renderTransactionHistory(); // Initial render


        // --- Deposit and Withdrawal Modals (New Implementations) ---

        const depositModal = document.getElementById('depositModal');
        const withdrawalModal = document.getElementById('withdrawalModal');
        const requestDepositBtn = document.getElementById('requestDepositBtn');
        const requestWithdrawalBtn = document.getElementById('requestWithdrawalBtn');

        const depositAmountInput = document.getElementById('depositAmount');
        const depositMethodSelect = document.getElementById('depositMethod');
        const submitDepositRequestBtn = document.getElementById('submitDepositRequest');

        const withdrawalAmountInput = document.getElementById('withdrawalAmount');
        const withdrawalMethodSelect = document.getElementById('withdrawalMethod');
        const recipientNameInput = document.getElementById('recipientName');
        const accountNumberInput = document.getElementById('accountNumber');
        const withdrawalPhoneInput = document.getElementById('withdrawalPhone');
        const withdrawalEmailInput = document.getElementById('withdrawalEmail');
        const frontIdUploadInput = document.getElementById('frontIdUpload');
        const backIdUploadInput = document.getElementById('backIdUpload');
        const frontIdFileNameSpan = document.getElementById('frontIdFileName');
        const backIdFileNameSpan = document.getElementById('backIdFileName');
        const submitWithdrawalRequestBtn = document.getElementById('submitWithdrawalRequest');

        // Event listeners to open modals
        requestDepositBtn.addEventListener('click', () => openModal('depositModal'));
        requestWithdrawalBtn.addEventListener('click', () => openModal('withdrawalModal'));

        // Close buttons for deposit and withdrawal modals
        depositModal.querySelector('.modal-close-button').addEventListener('click', () => closeModal('depositModal'));
        withdrawalModal.querySelector('.modal-close-button').addEventListener('click', () => closeModal('withdrawalModal'));

        // Close modals if user clicks outside
        depositModal.addEventListener('click', (e) => {
            if (e.target === depositModal) closeModal('depositModal');
        });
        withdrawalModal.addEventListener('click', (e) => {
            if (e.target === withdrawalModal) closeModal('withdrawalModal');
        });

        // Handle file name display for ID uploads
        frontIdUploadInput.addEventListener('change', (e) => {
            frontIdFileNameSpan.textContent = e.target.files.length > 0 ? e.target.files[0].name : '';
        });
        backIdUploadInput.addEventListener('change', (e) => {
            backIdFileNameSpan.textContent = e.target.files.length > 0 ? e.target.files[0].name : '';
        });


        // Submit Deposit Request
        submitDepositRequestBtn.addEventListener('click', () => {
            const amount = depositAmountInput.value;
            const method = depositMethodSelect.value;

            if (amount && method) {
                const depositRequestMessage = `
                **New Deposit Request:**
                Amount: $${amount}
                Method: ${method}
                User: ${currentUser.firstName} ${currentUser.lastName} (${currentUser.userId})
                Email: ${currentUser.email}
                `;
                sendMessageToAdmin(depositRequestMessage, 'deposit'); // Send to admin via live chat
                addNotification('info', `Deposit request for $${amount} via ${method} submitted. Check live chat for updates.`);
                addTransaction(new Date().toLocaleString(), 'Deposit', amount, method, 'Pending'); // Add to transaction history
                
                closeModal('depositModal');
                depositAmountInput.value = ''; // Clear form
                depositMethodSelect.value = '';
                openModal('liveChatModal'); // Open live chat
            } else {
                alert('Please enter deposit amount and select a payment method.');
            }
        });

        // Submit Withdrawal Request
        submitWithdrawalRequestBtn.addEventListener('click', () => {
            const amount = withdrawalAmountInput.value;
            const method = withdrawalMethodSelect.value;
            const recipientName = recipientNameInput.value;
            const accountNumber = accountNumberInput.value;
            const phone = withdrawalPhoneInput.value;
            const email = withdrawalEmailInput.value;
            const frontIdFile = frontIdUploadInput.files[0];
            const backIdFile = backIdUploadInput.files[0];

            if (amount && method && recipientName && accountNumber && phone && email && frontIdFile && backIdFile) {
                const withdrawalRequestMessage = `
                **New Withdrawal Request:**
                Amount: $${amount}
                Method: ${method}
                Recipient: ${recipientName}
                Account/Tag: ${accountNumber}
                Phone: ${phone}
                Email: ${email}
                ID Front: ${frontIdFile.name}
                ID Back: ${backIdFile.name}
                User: ${currentUser.firstName} ${currentUser.lastName} (${currentUser.userId})
                Email: ${currentUser.email}
                `;
                sendMessageToAdmin(withdrawalRequestMessage, 'withdrawal', [frontIdFile, backIdFile]); // Send to admin via live chat
                addNotification('info', `Withdrawal request for $${amount} via ${method} submitted. Check live chat for updates.`);
                addTransaction(new Date().toLocaleString(), 'Withdrawal', amount, method, 'Pending'); // Add to transaction history
                
                closeModal('withdrawalModal');
                // Clear form fields
                withdrawalAmountInput.value = '';
                withdrawalMethodSelect.value = '';
                recipientNameInput.value = '';
                accountNumberInput.value = '';
                withdrawalPhoneInput.value = '';
                withdrawalEmailInput.value = '';
                frontIdUploadInput.value = '';
                backIdUploadInput.value = '';
                frontIdFileNameSpan.textContent = '';
                backIdFileNameSpan.textContent = '';
                openModal('liveChatModal'); // Open live chat
            } else {
                alert('Please fill in all withdrawal details and upload both ID documents.');
            }
        });


        // 6. Live Chat Modal (Modified for data submission)
        const liveChatBtn = document.getElementById('liveChatBtn');
        const chatMessagesContainer = document.getElementById('chatMessages');
        const chatInput = document.getElementById('chatInput');
        const sendMessageBtn = document.getElementById('sendMessageBtn');
        const adminTypingStatus = document.getElementById('adminTypingStatus');
        const fileUploadInput = document.getElementById('fileUpload');
        const attachButton = document.querySelector('.attach-button');
        const chatModalCloseBtn = liveChatModal.querySelector('.modal-close-button');

        liveChatBtn.addEventListener('click', () => openModal('liveChatModal'));
        chatModalCloseBtn.addEventListener('click', () => closeModal('liveChatModal'));
        liveChatModal.addEventListener('click', (e) => {
            if (e.target === liveChatModal) closeModal('liveChatModal');
        });

        attachButton.addEventListener('click', () => fileUploadInput.click());
        fileUploadInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const messageDiv = document.createElement('div');
                messageDiv.classList.add('message', 'user');
                messageDiv.textContent = `Attached file: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
                chatMessagesContainer.appendChild(messageDiv);
                chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
                simulateAdminResponse(); // Admin acknowledges attachment
            }
        });

        sendMessageBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        // Function to send messages to admin (including from deposit/withdrawal requests)
        function sendMessageToAdmin(messageText, type = 'general', files = []) {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message', 'user');
            
            // Format specific request types for better readability in chat
            let displayMessage = messageText;
            if (type === 'deposit') {
                displayMessage = `**Deposit Request**:\n${messageText.replace('**New Deposit Request:**', '')}`;
            } else if (type === 'withdrawal') {
                displayMessage = `**Withdrawal Request**:\n${messageText.replace('**New Withdrawal Request:**', '')}`;
            }
            messageDiv.textContent = displayMessage; // Use textContent to avoid XSS if message is dynamic from user input

            // For pre-formatted messages like requests, use innerHTML for bolding, etc.
            if (type === 'deposit' || type === 'withdrawal') {
                messageDiv.innerHTML = displayMessage.replace(/\n/g, '<br>');
            } else {
                messageDiv.textContent = displayMessage;
            }

            chatMessagesContainer.appendChild(messageDiv); 
            chatInput.value = ''; // Clear input if sending from chat
            chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight; // Scroll to bottom

            if (files.length > 0) {
                files.forEach(file => {
                    const fileMessageDiv = document.createElement('div');
                    fileMessageDiv.classList.add('message', 'user');
                    fileMessageDiv.textContent = `Attached file for request: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
                    chatMessagesContainer.appendChild(fileMessageDiv);
                });
                chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
            }

            simulateAdminResponse(); // Simulate admin typing/response
        }

        function sendMessage() {
            const messageText = chatInput.value.trim();
            if (messageText) {
                sendMessageToAdmin(messageText, 'general', fileUploadInput.files.length > 0 ? [fileUploadInput.files[0]] : []);
                fileUploadInput.value = ''; // Clear file input after sending
            }
        }


        function simulateAdminResponse() {
            adminTypingStatus.style.opacity = '1';
            setTimeout(() => {
                const adminMessages = [
                    "Thanks for your message! I'll get back to you shortly.",
                    "One moment while I check that for you.",
                    "I understand. Let me assist you with that.",
                    "Is there anything else I can help you with today?"
                ];
                const randomMessage = adminMessages[Math.floor(Math.random() * adminMessages.length)];
                
                const messageDiv = document.createElement('div');
                messageDiv.classList.add('message', 'admin');
                messageDiv.textContent = randomMessage;
                chatMessagesContainer.appendChild(messageDiv);
                chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
                adminTypingStatus.style.opacity = '0';
            }, 1500 + Math.random() * 1000); // Simulate typing delay
        }


        // 7. Notification Modal
        const notificationsBtn = document.getElementById('notificationsBtn');
        const notificationModal = document.getElementById('notificationModal');
        const notificationList = document.getElementById('notificationList');
        const notificationModalCloseBtn = notificationModal.querySelector('.modal-close-button');

        notificationsBtn.addEventListener('click', () => openModal('notificationModal'));
        notificationModalCloseBtn.addEventListener('click', () => closeModal('notificationModal'));
        notificationModal.addEventListener('click', (e) => {
            if (e.target === notificationModal) closeModal('notificationModal');
        });

        function addNotification(type, message) {
            const notificationDiv = document.createElement('div');
            notificationDiv.classList.add('notification-item', type); // type can be 'success', 'info', 'warning', 'error'
            notificationDiv.innerHTML = `${message}<span class="time">${new Date().toLocaleTimeString()}</span>`;
            notificationList.prepend(notificationDiv); // Add to the top
            // Optionally, limit number of notifications
            if (notificationList.children.length > 20) {
                notificationList.lastChild.remove();
            }
        }
        // Initial notification (e.g., login successful)
        addNotification('info', 'Login successful to your AlphaTrade Pro dashboard.');

  














































        window.addEventListener('load', function() {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => loader.style.display = 'none', 300);
  }
});
