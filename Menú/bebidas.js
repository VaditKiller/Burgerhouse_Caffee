// Lógica específica para la página de bebidas y café.
document.addEventListener('DOMContentLoaded', () => {
    const menuFilters = document.getElementById('menu-filters');

    // Ensure app.js has loaded and exposed renderProducts
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
});