// Lógica específica para la página de rastreo de pedidos.
document.addEventListener('DOMContentLoaded', () => {
    const timerDisplay = document.querySelector('.timer-display');
    const trackOrderBtn = document.getElementById('track-order-btn');
    const orderIdInput = document.getElementById('order-id-input');
    const trackStatusContainer = document.getElementById('track-status-container');
    let countdownInterval;

    const startCountdown = (durationInMinutes) => {
        let timer = durationInMinutes * 60;
        const minutesEl = timerDisplay;

        clearInterval(countdownInterval); // Clear any existing interval

        countdownInterval = setInterval(() => {
            let minutes = parseInt(timer / 60, 10);
            let seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            if (minutesEl) {
                minutesEl.textContent = minutes + ":" + seconds;
            }

            if (--timer < 0) {
                clearInterval(countdownInterval);
                minutesEl.textContent = "00:00";
                // Trigger delivery notification
                if (typeof showToast === 'function') { // Ensure showToast from app.js is available
                    showToast("¡Tu pedido ha llegado al destino!", "success");
                }
            }
        }, 1000);
    };

    const displayOrderId = document.getElementById('display-order-id');

    // Check for orderId in URL parameters on page load
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
            startCountdown(30); // Start a 30-minute countdown
        }
    }

    // Event listener for manual tracking (if not from URL)
    if (trackOrderBtn) {
        trackOrderBtn.addEventListener('click', () => {
            const orderId = orderIdInput.value.trim();
            if (orderId) {
                if (typeof simulateOrderTracking === 'function') {
                    simulateOrderTracking(orderId);
                    startCountdown(30); // Start a 30-minute countdown
                }
            }
        });
    }
});