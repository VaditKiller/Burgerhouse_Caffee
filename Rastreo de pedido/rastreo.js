document.addEventListener('DOMContentLoaded', () => {
    const timerDisplay = document.querySelector('.timer-display');
    const trackOrderBtn = document.getElementById('track-order-btn');
    const orderIdInput = document.getElementById('order-id-input');
    const trackStatusContainer = document.getElementById('track-status-container');
    let countdownInterval;

    const startCountdown = (durationInSeconds) => {
        let timer = durationInSeconds;
        const minutesEl = timerDisplay;

        clearInterval(countdownInterval); // Clear any existing interval

        countdownInterval = setInterval(() => {
            let minutes = parseInt(timer / 60, 10);
            let seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            if (minutesEl) {
                minutesEl.textContent = minutes + " : " + seconds;
            }

            if (--timer < 0) {
                clearInterval(countdownInterval);
                minutesEl.textContent = "00 : 00";
                // Trigger delivery notification
                if (typeof showToast === 'function') { // Ensure showToast from app.js is available
                    showToast("¡Tu pedido ha llegado al destino!", "success");
                }
            }
        }, 1000);
    };

    const displayOrderId = document.getElementById('display-order-id');

    const updateLocalStepper = (step) => {
        const progress = ((step - 1) / 3) * 100;
        document.querySelectorAll('.step').forEach((item, index) => {
            item.classList.toggle('completed', index < step - 1);
            item.classList.toggle('active', index === step - 1);
        });
        const progressEl = document.getElementById('stepper-progress');
        if (progressEl) progressEl.style.width = `${progress}%`;
        const statusEl = document.getElementById('current-status');
        if (statusEl) statusEl.textContent = ['Order received', 'Preparing your order', 'Your order is on the way', 'Order delivered'][step - 1];
    };

    updateLocalStepper(2);
    startCountdown(14 * 60 + 20);

    const urlParams = new URLSearchParams(window.location.search);
    const orderIdFromUrl = urlParams.get('orderId');

    if (orderIdFromUrl) {
        if (orderIdInput) orderIdInput.value = orderIdFromUrl;
        if (trackStatusContainer) trackStatusContainer.style.display = 'block';
        if (displayOrderId) displayOrderId.textContent = orderIdFromUrl;
        
        // Simulate order tracking progress and start countdown
        // This relies on simulateOrderTracking being available from app.js
        if (typeof simulateOrderTracking === 'function') { 
            simulateOrderTracking(orderIdFromUrl);
            startCountdown(14 * 60 + 20);
        }
    }

    // Event listener for manual tracking (if not from URL)
    if (trackOrderBtn) {
        trackOrderBtn.addEventListener('click', () => {
            const orderId = orderIdInput.value.trim();
            if (orderId) {
                if (typeof simulateOrderTracking === 'function') {
                    simulateOrderTracking(orderId);
                    startCountdown(14 * 60 + 20);
                }
            }
        });
    }
});