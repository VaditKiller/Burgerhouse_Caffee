// Lógica específica para la página de hamburguesas.
document.addEventListener('DOMContentLoaded', () => {
    const menuFilters = document.getElementById('menu-filters');

    // Ensure app.js has loaded and exposed renderProducts
    // This assumes renderProducts is globally accessible or exposed via a module pattern.
    // For simplicity, we'll assume it's globally available from app.js
    if (typeof renderProducts !== 'function') {
        console.error("renderProducts function not found. Ensure app.js is loaded correctly.");
        return;
    }

    if (menuFilters) {
        menuFilters.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter__btn')) {
                e.preventDefault(); // Prevent default link navigation

                // Remove active class from all buttons
                menuFilters.querySelectorAll('.filter__btn').forEach(btn => btn.classList.remove('active'));
                // Add active class to the clicked button
                e.target.classList.add('active');

                // Determine the filter category from the button's text or a data attribute
                // For category pages, we filter based on the button's text (lowercase)
                const filterText = e.target.textContent.toLowerCase();
                let filterCategory = '';
                if (filterText.includes('hamburguesas')) filterCategory = 'burgers';
                else if (filterText.includes('combos')) filterCategory = 'combos';
                else if (filterText.includes('bebidas')) filterCategory = 'drinks';
                else if (filterText.includes('acompañamientos')) filterCategory = 'sides';
                else filterCategory = 'all'; // For "Todo"

                renderProducts(filterCategory); // Call the global renderProducts function
            }
        });
    }

    // Initial activation of the current page's filter button
    // This is handled by renderPageSpecificContent in app.js on initial load.
});