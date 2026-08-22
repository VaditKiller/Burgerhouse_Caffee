document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const authTabsContainer = document.querySelector('.auth__tabs');
    const feedbackEl = document.getElementById('auth-feedback');

    // Tab switching logic
    if (authTabsContainer) {
        authTabsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('auth__tab-btn')) {
                authTabsContainer.querySelector('.auth__tab-btn.active').classList.remove('active');
                e.target.classList.add('active');
                
                document.querySelector('.auth__form.active').classList.remove('active');
                document.getElementById(`${e.target.dataset.tab}-form`).classList.add('active');
            }
        });
    }

    // Handle Login
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            if (!email) return;

            const name = email.split('@')[0];
            const user = { name, email };

            localStorage.setItem('burgerhausUser', JSON.stringify(user));
            window.location.href = '../index.html';
        });
    }

    // Handle Register
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            if (!name || !email) return;

            const user = { name, email };

            localStorage.setItem('burgerhausUser', JSON.stringify(user));
            window.location.href = '../index.html';
        });
    }
});