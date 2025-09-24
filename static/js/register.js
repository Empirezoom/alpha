// Mobile menu toggle
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



























// Password toggle functionality
function togglePassword(inputId) {
    const passwordInput = document.getElementById(inputId);
    const toggleBtn = passwordInput.nextElementSibling;
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.textContent = '🙈';
    } else {
        passwordInput.type = 'password';
        toggleBtn.textContent = '👁️';
    }
}

// Password strength checker
function checkPasswordStrength(password) {
    let score = 0;
    let feedback = [];

    // Length check
    if (password.length >= 8) score += 1;
    else feedback.push('at least 8 characters');

    // Uppercase check
    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('uppercase letter');

    // Lowercase check
    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('lowercase letter');

    // Number check
    if (/[0-9]/.test(password)) score += 1;
    else feedback.push('number');

    // Special character check
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    else feedback.push('special character');

    return { score, feedback };
}

// Update password strength indicator
function updatePasswordStrength() {
    const password = document.getElementById('password').value;
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');

    if (!password) {
        strengthBar.className = 'strength-bar';
        strengthText.textContent = 'Password strength will appear here';
        strengthText.style.color = 'rgba(255, 255, 255, 0.6)';
        return;
    }

    const { score, feedback } = checkPasswordStrength(password);

    // Update strength bar
    strengthBar.className = 'strength-bar';
    if (score <= 2) {
        strengthBar.classList.add('strength-weak');
        strengthText.textContent = 'Weak - Need: ' + feedback.join(', ');
        strengthText.style.color = '#ef4444';
    } else if (score <= 4) {
        strengthBar.classList.add('strength-medium');
        strengthText.textContent = 'Medium - Consider adding: ' + feedback.join(', ');
        strengthText.style.color = '#f59e0b';
    } else {
        strengthBar.classList.add('strength-strong');
        strengthText.textContent = 'Strong password!';
        strengthText.style.color = '#10b981';
    }
}

// Check password match
function checkPasswordMatch() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const matchDiv = document.getElementById('passwordMatch');
    const mismatchDiv = document.getElementById('passwordMismatch');

    if (!confirmPassword) {
        matchDiv.style.display = 'none';
        mismatchDiv.style.display = 'none';
        return false;
    }

    if (password === confirmPassword) {
        matchDiv.style.display = 'block';
        mismatchDiv.style.display = 'none';
        return true;
    } else {
        matchDiv.style.display = 'none';
        mismatchDiv.style.display = 'block';
        return false;
    }
}

// Validate form
function validateForm() {
    const password = document.getElementById('password').value;
    const { score } = checkPasswordStrength(password);
    const passwordsMatch = checkPasswordMatch();
    const termsAccepted = document.getElementById('terms').checked;
    const signupBtn = document.getElementById('signupBtn');

    const isValid = score >= 3 && passwordsMatch && termsAccepted;
    signupBtn.disabled = !isValid;

    return isValid;
}

// Event listeners
document.getElementById('password').addEventListener('input', function() {
    updatePasswordStrength();
    checkPasswordMatch();
    validateForm();
});

document.getElementById('confirmPassword').addEventListener('input', function() {
    checkPasswordMatch();
    validateForm();
});

document.getElementById('terms').addEventListener('change', validateForm);















































