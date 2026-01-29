// Clerk Authentication for reTHINKit
const CLERK_PUBLISHABLE_KEY = 'pk_test_bWF0dXJlLWFuY2hvdnktNTQuY2xlcmsuYWNjb3VudHMuZGV2JA';

// Initialize Clerk
async function initClerk() {
    try {
        await window.Clerk.load();
        updateAuthUI();
        initProtection();
        
        // Listen for auth state changes
        window.Clerk.addListener(({ user }) => {
            updateAuthUI();
            if (isProtectedPage()) {
                protectPage();
            }
        });
    } catch (error) {
        console.error('Clerk initialization error:', error);
    }
}

// Update UI based on auth state
function updateAuthUI() {
    const navActions = document.querySelector('.nav-actions');
    if (!navActions) return;

    const user = window.Clerk.user;
    
    if (user) {
        // User is signed in - show settings wheel
        navActions.innerHTML = `
            <button class="settings-btn" onclick="toggleUserDropdown()" title="Account Settings">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>
            </button>
            <div class="user-dropdown" id="userDropdown">
                <div class="dropdown-header">
                    <img src="${user.imageUrl || ''}" alt="" class="dropdown-avatar">
                    <div class="dropdown-info">
                        <span class="dropdown-name">${user.fullName || 'User'}</span>
                        <span class="dropdown-email">${user.emailAddresses[0]?.emailAddress || ''}</span>
                    </div>
                </div>
                <div class="dropdown-divider"></div>
                <button class="dropdown-item" onclick="openUserProfile()">
                    <span>⚙️</span> Manage Account
                </button>
                <button class="dropdown-item" onclick="signOut()">
                    <span>🚪</span> Sign Out
                </button>
            </div>
        `;
    } else {
        // User is signed out - show Sign In and Sign Up
        navActions.innerHTML = `
            <button class="auth-btn sign-in-btn" onclick="signIn()">Sign In</button>
            <button class="auth-btn sign-up-btn" onclick="signUp()">Sign Up</button>
        `;
    }
}

// Toggle user dropdown
function toggleUserDropdown() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.settings-btn') && !e.target.closest('.user-dropdown')) {
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) dropdown.classList.remove('show');
    }
});

// Auth functions
function signIn() {
    window.Clerk.openSignIn({
        appearance: {
            elements: {
                rootBox: { boxShadow: 'none' },
                card: { boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }
            },
            variables: {
                colorPrimary: '#FF9500',
                colorBackground: '#111827',
                colorText: '#ffffff',
                colorTextSecondary: '#9ca3af',
                colorInputBackground: '#1a2332',
                colorInputText: '#ffffff'
            }
        }
    });
}

function signUp() {
    window.Clerk.openSignUp({
        appearance: {
            variables: {
                colorPrimary: '#FF9500',
                colorBackground: '#111827',
                colorText: '#ffffff',
                colorTextSecondary: '#9ca3af',
                colorInputBackground: '#1a2332',
                colorInputText: '#ffffff'
            }
        }
    });
}

function signOut() {
    window.Clerk.signOut();
}

function openUserProfile() {
    window.Clerk.openUserProfile({
        appearance: {
            variables: {
                colorPrimary: '#FF9500',
                colorBackground: '#111827',
                colorText: '#ffffff',
                colorTextSecondary: '#9ca3af',
                colorInputBackground: '#1a2332',
                colorInputText: '#ffffff'
            }
        }
    });
}

// Check if user is authenticated (for protected pages)
function requireAuth() {
    if (!window.Clerk.user) {
        signIn();
        return false;
    }
    return true;
}

// Check subscription status (stored in Clerk user metadata)
function hasActiveSubscription() {
    const user = window.Clerk.user;
    if (!user) return false;
    
    // Check public metadata for subscription
    const subscription = user.publicMetadata?.subscription;
    if (!subscription) return false;
    
    // Check if subscription is active and not expired
    return subscription.status === 'active' && 
           (!subscription.expiresAt || new Date(subscription.expiresAt) > new Date());
}

// Protect page - requires auth + subscription
function protectPage() {
    const user = window.Clerk.user;
    
    if (!user) {
        // Not logged in - show auth gate
        showAuthGate();
        return false;
    }
    
    if (!hasActiveSubscription()) {
        // Logged in but no subscription - show paywall
        showPaywall();
        return false;
    }
    
    // Has access
    hideGates();
    return true;
}

// Show auth gate overlay
function showAuthGate() {
    removeExistingGates();
    
    const gate = document.createElement('div');
    gate.className = 'access-gate';
    gate.id = 'accessGate';
    gate.innerHTML = `
        <div class="gate-content">
            <img src="${getLogoPath()}" alt="reTHINKit" class="gate-logo">
            <h2>Sign in to continue</h2>
            <p>Access qChat and qInvest with a reTHINKit subscription.</p>
            <div class="gate-buttons">
                <button class="gate-btn primary" onclick="signIn()">Sign In</button>
                <button class="gate-btn secondary" onclick="signUp()">Create Account</button>
            </div>
            <p class="gate-note">Start with a free trial - first month on us!</p>
        </div>
    `;
    document.body.appendChild(gate);
}

// Show paywall overlay
function showPaywall() {
    removeExistingGates();
    
    const user = window.Clerk.user;
    const gate = document.createElement('div');
    gate.className = 'access-gate';
    gate.id = 'accessGate';
    gate.innerHTML = `
        <div class="gate-content">
            <img src="${getLogoPath()}" alt="reTHINKit" class="gate-logo">
            <h2>Subscription Required</h2>
            <p>Hi ${user.firstName || 'there'}! Upgrade to access qChat and qInvest.</p>
            <div class="pricing-card">
                <div class="price">$30<span>/month</span></div>
                <ul class="features">
                    <li>✓ qChat - AI Business Intelligence</li>
                    <li>✓ qInvest - Investment Analysis</li>
                    <li>✓ Unlimited conversations</li>
                    <li>✓ Priority support</li>
                </ul>
                <button class="gate-btn primary" onclick="startCheckout()">Start Free Trial</button>
            </div>
            <p class="gate-note">First month free, cancel anytime</p>
            <button class="gate-link" onclick="signOut()">Sign out</button>
        </div>
    `;
    document.body.appendChild(gate);
}

// Get correct logo path based on current location
function getLogoPath() {
    return window.location.pathname.includes('/qchat') ? '../logo.png' : 'logo.png';
}

// Remove existing gates
function removeExistingGates() {
    const existing = document.getElementById('accessGate');
    if (existing) existing.remove();
}

// Hide gates
function hideGates() {
    removeExistingGates();
}

// Start Stripe checkout
function startCheckout() {
    // Stripe checkout will be implemented here
    // For now, show a message
    alert('Stripe payment coming soon! For testing, contact admin to enable your subscription.');
}

// Check if current page is protected
function isProtectedPage() {
    const path = window.location.pathname;
    return path.includes('/qchat') || path.includes('qinvest');
}

// Initialize protection on protected pages
function initProtection() {
    if (isProtectedPage()) {
        // Wait for Clerk to fully load
        if (window.Clerk.loaded) {
            protectPage();
        } else {
            window.Clerk.addListener(() => {
                protectPage();
            });
        }
    }
}

// Wait for Clerk to be available
function waitForClerk() {
    if (window.Clerk) {
        initClerk();
    } else {
        setTimeout(waitForClerk, 100);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForClerk);
} else {
    waitForClerk();
}
