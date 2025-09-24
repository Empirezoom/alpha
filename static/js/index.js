// Market data simulation
const marketPairs = {
    'EURUSD': { price: 1.0856, change: 0.12 },
    'GBPUSD': { price: 1.2734, change: -0.08 },
    'USDJPY': { price: 148.25, change: 0.35 },
    'BTCUSD': { price: 43250.00, change: 2.15 }
};

// Update market display
function updateMarketDisplay() {
    const container = document.getElementById('marketPairs');
    container.innerHTML = '';

    Object.entries(marketPairs).forEach(([pair, data]) => {
        const changeClass = data.change >= 0 ? 'positive' : 'negative';
        const changeSymbol = data.change >= 0 ? '+' : '';
        
        const pairElement = document.createElement('div');
        pairElement.className = 'market-pair';
        pairElement.innerHTML = `
            <div class="pair-info">
                <div class="pair-name">${pair}</div>
                <div class="pair-price">${data.price.toFixed(pair === 'BTCUSD' ? 2 : 4)}</div>
            </div>
            <div class="pair-change ${changeClass}">
                ${changeSymbol}${data.change.toFixed(2)}%
            </div>
        `;
        container.appendChild(pairElement);
    });
}

// Simulate price updates
function updatePrices() {
    Object.keys(marketPairs).forEach(pair => {
        const change = (Math.random() - 0.5) * 0.1;
        marketPairs[pair].change = change;
        
        if (pair === 'BTCUSD') {
            marketPairs[pair].price += (Math.random() - 0.5) * 100;
        } else {
            marketPairs[pair].price += (Math.random() - 0.5) * 0.001;
        }
    });
    updateMarketDisplay();
}

// Update profit calculation
function updateProfit() {
    const amount = document.getElementById('investAmount').value;
    const profit = Math.round(amount * 0.85 * 100) / 100;
    document.getElementById('profitAmount').textContent = `$${profit.toFixed(2)}`;
}

// Place trade function
function placeTrade(direction) {
    const asset = document.getElementById('assetSelect').value;
    const amount = document.getElementById('investAmount').value;
    const expiry = document.getElementById('expiryTime').value;
    
    // Simple mobile-friendly feedback
    const btn = event.target;
    const originalText = btn.innerHTML;
    btn.innerHTML = '✓ Placed!';
    btn.style.opacity = '0.7';
    
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.opacity = '1';
    }, 1500);
}

// Event listeners
document.getElementById('investAmount').addEventListener('input', updateProfit);

// Initialize
updateMarketDisplay();
updateProfit();

// Update prices every 3 seconds
setInterval(updatePrices, 3000);

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

// Mobile menu toggle with enhanced animation
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

// Close mobile menu when clicking on links
document.querySelectorAll('.mobile-nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        isMenuOpen = false;
        mobileMenuBtn.classList.remove('active');
        mobileNavOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});

// Close menu when clicking outside
mobileNavOverlay.addEventListener('click', function(e) {
    if (e.target === mobileNavOverlay) {
        isMenuOpen = false;
        mobileMenuBtn.classList.remove('active');
        mobileNavOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

















































window.addEventListener('load', function() {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => loader.style.display = 'none', 300);
  }
});
