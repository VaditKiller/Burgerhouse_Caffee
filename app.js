document.addEventListener('DOMContentLoaded', () => {

    // ==================== GESTIÓN DE ESTADO ====================
    const state = {
        products: [
            { id: 1, name: 'The Haus Double', price: 90.00, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400', category: 'burgers', desc: 'Doble carne de res, queso cheddar, lechuga, tomate y nuestra salsa secreta.' },
            { id: 2, name: 'Spicy Bird', price: 80.00, image: 'https://images.unsplash.com/photo-1606131731446-5568d87113aa?q=80&w=400', category: 'burgers', desc: 'Pollo crujiente, ensalada de col picante, pepinillos y mayonesa de chipotle.' },
            { id: 3, name: 'Truffle Shroom', price: 95.00, image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?q=80&w=400', category: 'burgers', desc: 'Carne de res, queso suizo, champiñones salteados, cebolla caramelizada y alioli de trufa.' },
            { id: 4, name: 'Veggie Delight', price: 75.00, image: 'https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?q=80&w=400', category: 'burgers', desc: 'Hamburguesa de frijoles negros y quinoa, aguacate, brotes y alioli vegano.' },
            
            { id: 5, name: 'Combo Clásico', price: 119.00, image: 'https://images.unsplash.com/photo-1610440042657-612c34d95e9f?q=80&w=400', category: 'combos', desc: 'Haus Double, papas fritas y una bebida a elección.' },
            { id: 6, name: 'Combo Familiar', price: 250.00, image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?q=80&w=400', category: 'combos', desc: '2 Haus Double, 2 Spicy Bird, 2 papas grandes y 4 bebidas.' },
            { id: 7, name: 'Kids Combo', price: 85.00, image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?q=80&w=400', category: 'combos', desc: 'Mini hamburguesa, papas pequeñas y jugo.' },
            { id: 8, name: 'Artisanal Latte', price: 30.00, image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=400', category: 'drinks', desc: 'Espresso de origen único con leche vaporizada y arte latte.' },
            { id: 9, name: 'Cold Brew', price: 28.00, image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=400', category: 'drinks', desc: 'Café infusionado en frío durante 12 horas para un sabor suave y potente.' },
            { id: 10, name: 'Coca-Cola', price: 15.00, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=400', category: 'drinks', desc: 'Refresco clásico de cola.' },
            { id: 11, name: 'Jugo Natural', price: 20.00, image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80&w=400', category: 'drinks', desc: 'Jugo de naranja o maracuyá recién exprimido.' },
            { id: 12, name: 'Curly Fries', price: 35.00, image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?q=80&w=400', category: 'sides', desc: 'Papas fritas en espiral, crujientes y perfectamente sazonadas.' },
            { id: 13, name: 'Onion Rings', price: 30.00, image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?q=80&w=400', category: 'sides', desc: 'Crujientes aros de cebolla con salsa especial.' },
            { id: 14, name: 'Ensalada César', price: 45.00, image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=400', category: 'sides', desc: 'Lechuga romana, crutones, queso parmesano y aderezo César.' },
        ],
        cart: [],
        currentUser: null,
        currentOrder: null,
    };

    // ==================== SELECTORES DEL DOM ====================
    const menuGrid = document.getElementById('menu-grid');
    const menuFilters = document.getElementById('menu-filters');
    const cartIcon = document.getElementById('cart-icon');
    const cartDrawer = document.getElementById('cart-drawer');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartBadge = document.getElementById('cart-badge');
    const cartSubtotalEl = document.getElementById('cart-subtotal');
    const cartTaxEl = document.getElementById('cart-tax');
    const cartShippingEl = document.getElementById('cart-shipping');
    const cartTotalEl = document.getElementById('cart-total');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navMenu = document.querySelector('.nav');
    const userArea = document.getElementById('user-area');
    const trackStatusContainer = document.getElementById('track-status-container');
    const stepperProgress = document.getElementById('stepper-progress');
    const steps = document.querySelectorAll('.step');
    const toast = document.getElementById('toast');
    const checkoutModal = document.getElementById('checkout-modal');
    const checkoutForm = document.getElementById('checkout-form'); 
    const contactForm = document.getElementById('contact-form'); 
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const fallbackProductImage = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800';

    // ==================== FUNCIONES DE RENDERIZADO ====================
    const renderProducts = (filter = 'all') => {
        menuGrid.innerHTML = '';
        const filteredProducts = state.products.filter(p => filter === 'all' || p.category === filter);
        
        filteredProducts.forEach(product => {
            const card = document.createElement('article');
            card.className = 'product__card animate-on-scroll';
            card.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="product__image" loading="lazy" decoding="async">
                <div class="product__info">
                    <h3 class="product__name">${product.name}</h3>
                    <span class="product__price">Bs. ${product.price.toFixed(2)}</span>
                    <p class="product__desc">${product.desc}</p>
                </div>
                <div class="product__footer">
                    <a href="Menú/detalle-producto.html?id=${product.id}" class="btn btn--secondary">Ver Detalles</a>
                    <button class="btn btn--primary add-to-cart-btn" data-id="${product.id}">Añadir al Pedido</button>
                </div>
            `;
            menuGrid.appendChild(card);
        });
    };
    // Expose renderProducts to the global scope
    window.renderProducts = renderProducts;

    const renderCart = () => {
        cartItemsContainer.innerHTML = '';
        if (state.cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="cart__empty-msg">Tu carrito está vacío.</p>';
        } else {
            state.cart.forEach(item => {
                const itemKey = item.cartId || item.id;
                const extrasText = item.extras?.length
                    ? `<p class="cart__item-extras">+ ${item.extras.map(extra => extra.name).join(', ')}</p>`
                    : '';
                const cartItem = document.createElement('div');
                cartItem.className = 'cart__item';
                cartItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="cart__item-img" loading="lazy" decoding="async" onerror="this.onerror=null; this.src='${fallbackProductImage}';">
                    <div class="cart__item-info">
                        <p class="cart__item-name">${item.name}</p>
                        ${extrasText}
                        <p class="cart__item-price">Bs. ${item.price.toFixed(2)}</p>
                        <div class="cart__item-actions">
                            <button class="quantity-btn" data-cart-key="${itemKey}" data-change="-1">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn" data-cart-key="${itemKey}" data-change="1">+</button>
                        </div>
                    </div>
                    <button class="remove-item-btn" data-cart-key="${itemKey}">&times;</button>
                `;
                cartItemsContainer.appendChild(cartItem);
            });
        }
        updateCartSummary();
        updateCartBadge();
        saveCartToLocalStorage();
    };

    const updateCartSummary = () => {
        const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const tax = subtotal * 0.10;
        const shipping = state.cart.length > 0 ? 15.00 : 0;
        const total = subtotal + tax + shipping;

        cartSubtotalEl.textContent = `Bs. ${subtotal.toFixed(2)}`;
        cartTaxEl.textContent = `Bs. ${tax.toFixed(2)}`;
        cartShippingEl.textContent = `Bs. ${shipping.toFixed(2)}`;
        cartTotalEl.textContent = `Bs. ${total.toFixed(2)}`;
    };

    const updateCartBadge = () => {
        const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
        cartBadge.textContent = totalItems;
        cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    };

    const updateUserUI = () => {
        const user = JSON.parse(localStorage.getItem('burgerhausUser'));
        state.currentUser = user;

        if (state.currentUser) {
            userArea.innerHTML = `
                <span class="header__username">Hola, ${state.currentUser.name}</span>
                <button class="btn btn--secondary" id="logout-btn">Salir</button>
            `;
            document.getElementById('logout-btn').addEventListener('click', handleLogout);
        }
        // If no user, the default HTML link to login.html is used.
    };

    // ==================== ACCIONES Y MANEJADORES DE EVENTOS ====================
    const getCartItemKey = (item) => String(item.cartId || item.id);

    const addToCart = (productId, options = {}) => {
        const product = state.products.find(p => p.id === productId);
        if (!product) return;

        const quantity = Math.max(1, Number(options.quantity) || 1);
        const extras = options.extras || [];
        const extrasTotal = extras.reduce((sum, extra) => sum + extra.price, 0);
        const cartId = extras.length
            ? `${product.id}:${extras.map(extra => extra.value).sort().join('|')}`
            : String(product.id);
        const cartItem = state.cart.find(item => getCartItemKey(item) === cartId);

        if (cartItem) {
            cartItem.quantity += quantity;
        } else {
            state.cart.push({
                ...product,
                cartId,
                basePrice: product.price,
                price: product.price + extrasTotal,
                quantity,
                extras,
            });
        }
        showToast(`${product.name} añadido al carrito`);
        renderCart();
    };

    const updateCartQuantity = (cartKey, change) => {
        const cartItem = state.cart.find(item => getCartItemKey(item) === String(cartKey));
        if (cartItem) {
            cartItem.quantity += change;
            if (cartItem.quantity <= 0) {
                removeFromCart(cartKey);
            } else {
                renderCart();
            }
        }
    };

    const removeFromCart = (cartKey) => {
        state.cart = state.cart.filter(item => getCartItemKey(item) !== String(cartKey));
        renderCart();
    };

    const handleLogout = () => {
        showToast(`¡Hasta pronto, ${state.currentUser.name}!`);
        localStorage.removeItem('burgerhausUser');
        window.location.reload(); // Recarga la página para actualizar la UI en todas las páginas
    };
    
    const handleCheckout = (e) => {
        e.preventDefault();
        if (state.cart.length === 0) {
            showToast("Tu carrito está vacío", "error");
            return;
        }
        const orderId = `BH-${Date.now().toString().slice(-6)}`;
        const newOrder = {
            id: orderId,
            items: [...state.cart],
            status: 1, // 1: Recibido, 2: Preparando, 3: En camino, 4: Entregado
        };
        // Guardar el pedido en sessionStorage para que persista entre páginas
        sessionStorage.setItem('currentOrder', JSON.stringify(newOrder));
        state.currentOrder = newOrder;

        state.cart = [];
        renderCart();
        showToast(`Pedido #${orderId} confirmado. ¡Gracias por tu compra!`);
        window.location.href = `/Rastreo de pedido/rastreo.html?orderId=${orderId}`;
    };

    const simulateOrderTracking = (orderId) => {
        // Cargar el pedido desde sessionStorage para recuperar el estado
        const savedOrder = JSON.parse(sessionStorage.getItem('currentOrder'));
        if (savedOrder && savedOrder.id === orderId) {
            state.currentOrder = savedOrder;
        }

        if (!state.currentOrder || state.currentOrder.id !== orderId) {
            showToast("Número de orden no válido o la sesión ha expirado", "error");
            if (trackStatusContainer) trackStatusContainer.style.display = 'none';
            return;
        }

        if (trackStatusContainer) trackStatusContainer.style.display = 'block';
        const displayOrderIdEl = document.getElementById('display-order-id');
        if (displayOrderIdEl) displayOrderIdEl.textContent = orderId;
        
        const updateStep = (step) => {
            if (!steps || !stepperProgress) return;
            steps.forEach((s, i) => {
                if (i < step) {
                    s.classList.add('completed');
                } else {
                    s.classList.remove('completed');
                }
            });
            const progressWidth = ((step - 1) / (steps.length - 1)) * 100;
            stepperProgress.style.width = `${progressWidth}%`;
        };

        updateStep(state.currentOrder.status);

        // Simula el progreso
        let currentStep = state.currentOrder.status;
        const interval = setInterval(() => {
            if (currentStep < 4) {
                currentStep++;
                state.currentOrder.status = currentStep;
                // Guardar el progreso en sessionStorage
                sessionStorage.setItem('currentOrder', JSON.stringify(state.currentOrder));
                updateStep(currentStep);
                const stepText = steps[currentStep-1]?.querySelector('span')?.textContent;
                if (stepText) showToast(`Tu pedido #${orderId} ahora está: ${stepText}`);
            } else {
                clearInterval(interval);
            }
        }, 8000); // 8 segundos por paso
    };

    // ==================== HELPERS DE UI Y MODALES ====================
    const closeModal = (modal) => modal.close();
    
    const showToast = (message, type = 'success') => {
        toast.textContent = message;
        toast.className = `toast show`; // Base classes
        if (type === 'error') {
            toast.classList.add('error');
        }
        setTimeout(() => {
            toast.className = 'toast';
        }, 3000);
    };

    const saveCartToLocalStorage = () => {
        localStorage.setItem('burgerhausCart', JSON.stringify(state.cart));
    };

    const loadCartFromLocalStorage = () => {
        const savedCart = localStorage.getItem('burgerhausCart');
        if (savedCart) {
            state.cart = JSON.parse(savedCart);
        }
    };

    // ==================== DARK MODE ====================
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggleBtn.innerHTML = `<i class="fa-solid fa-sun"></i>`;
        } else {
            document.body.classList.remove('dark-mode');
            themeToggleBtn.innerHTML = `<i class="fa-solid fa-moon"></i>`;
        }
    };

    const handleThemeToggle = () => {
        const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        localStorage.setItem('burgerhausTheme', newTheme);
        applyTheme(newTheme);
    };

    const loadTheme = () => {
        const savedTheme = localStorage.getItem('burgerhausTheme') || 'light';
        applyTheme(savedTheme);
    };

    const renderPageSpecificContent = () => {
        const currentUrl = new URL(window.location.href);
        const currentPathname = currentUrl.pathname;
        const currentHash = currentUrl.hash;
        const menuFiltersContainer = document.getElementById('menu-filters');
    
        // Determine the category to render based on the current page
        let categoryToRender = 'all';
        const pathSegments = currentPathname.split('/');
        const currentFileName = pathSegments[pathSegments.length - 1]; // e.g., hamburguesas.html, index.html

        switch (currentFileName) {
            case 'hamburguesas.html':
                renderProducts('burgers');
                break;
            case 'combos.html':
                renderProducts('combos');
                break;
            case 'bebidas.html':
                renderProducts('drinks');
                break;
            case 'acompanamientos.html':
                renderProducts('sides');
                break;
            case 'index.html':
            case '':
                renderProducts('all');
                break;
            default: // For pages like contact.html, rastreo.html, or login.html
                if (menuGrid) {
                    menuGrid.innerHTML = '';
                }
                return; // Exit early as these pages don't display products
        }
        
        // Activate the corresponding filter button
        if (menuFiltersContainer) {
            menuFiltersContainer.querySelectorAll('.filter__btn').forEach(btn => {
                btn.classList.remove('active');
                const btnHref = btn.getAttribute('href');
                const btnFileName = btnHref.split('/').pop();

                if (btnFileName === currentFileName) {
                    btn.classList.add('active');
                } else if (currentFileName === 'index.html' && btnFileName === 'index.html#menu') {
                    btn.classList.add('active');
                }

                if (btn.href.endsWith(currentFileName)) {
                    btn.classList.add('active');
                }
            });
        }
    };

    const initProductDetail = () => {
        const detailSection = document.querySelector('.product-detail-section');
        if (!detailSection) return;

        const currentUrl = new URL(window.location.href);
        const productId = parseInt(currentUrl.searchParams.get('id') || '1', 10);
        const product = state.products.find(item => item.id === productId) || state.products[0];
        const quantityValue = document.getElementById('product-detail-quantity');
        const totalPriceEl = document.getElementById('product-detail-total');
        const addButton = document.getElementById('product-detail-add-to-cart');
        const imageEl = document.querySelector('.product-detail__image');
        const nameEl = document.querySelector('.product-detail__name');
        const descEl = document.querySelector('.product-detail__desc');
        const extraInputs = detailSection.querySelectorAll('input[name="extra"]');
        let quantity = 1;

        const getSelectedExtras = () => Array.from(extraInputs)
            .filter(input => input.checked)
            .map(input => ({
                value: input.value,
                name: input.dataset.name,
                price: Number(input.dataset.price) || 0,
            }));

        const updateTotal = () => {
            const extrasTotal = getSelectedExtras().reduce((sum, extra) => sum + extra.price, 0);
            totalPriceEl.textContent = `Bs. ${((product.price + extrasTotal) * quantity).toFixed(2)}`;
            quantityValue.textContent = quantity;
        };

        if (nameEl) nameEl.textContent = product.name;
        if (descEl) descEl.textContent = product.desc;
        if (addButton) addButton.dataset.id = product.id;
        if (imageEl) {
            imageEl.alt = product.name;
            imageEl.dataset.fallbackSrc = imageEl.dataset.fallbackSrc || product.image || fallbackProductImage;
        }

        detailSection.querySelectorAll('.product-detail__qty-btn').forEach(button => {
            button.addEventListener('click', () => {
                if (button.dataset.action === 'increase') {
                    quantity += 1;
                } else {
                    quantity = Math.max(1, quantity - 1);
                }
                updateTotal();
            });
        });

        extraInputs.forEach(input => input.addEventListener('change', updateTotal));

        if (addButton) {
            addButton.addEventListener('click', () => {
                addToCart(product.id, {
                    quantity,
                    extras: getSelectedExtras(),
                });
                cartDrawer.classList.add('active');
            });
        }

        updateTotal();
    };
    
    // ==================== EVENT LISTENERS ====================
    if (menuGrid) {
        menuGrid.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart-btn')) {
                const productId = parseInt(e.target.dataset.id);
                addToCart(productId);
            }
        });
    }

    // Interacciones del carrito
    cartIcon.addEventListener('click', () => cartDrawer.classList.add('active'));
    cartDrawer.addEventListener('click', (e) => {
        if (e.target.classList.contains('cart-drawer__close') || e.target === cartDrawer) {
            cartDrawer.classList.remove('active');
        }
        if (e.target.classList.contains('quantity-btn')) {
            const id = e.target.dataset.cartKey || e.target.dataset.id;
            const change = parseInt(e.target.dataset.change);
            updateCartQuantity(id, change);
        }
        if (e.target.classList.contains('remove-item-btn')) {
            const id = e.target.dataset.cartKey || e.target.dataset.id;
            removeFromCart(id);
        }
    });

    // Menú de hamburguesa
    hamburgerBtn.addEventListener('click', () => {
        hamburgerBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    navMenu.addEventListener('click', (e) => {
        if (e.target.classList.contains('nav__link')) {
            hamburgerBtn.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // Manejo de modales
    if (checkoutModal) { 
        checkoutModal.addEventListener('click', (e) => {
            if (e.target === checkoutModal || e.target.classList.contains('modal__close')) {
                closeModal(checkoutModal);
            }
        });
    }

    // Envío de formularios
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckout);
        document.getElementById('checkout-btn').addEventListener('click', () => {
            if (state.cart.length > 0) {
                checkoutModal.showModal();
            } else {
                showToast("Añade productos a tu carrito para continuar", "error");
            }
        });
    }

    // Rastrear pedido
    const trackOrderBtn = document.getElementById('track-order-btn');
    if (trackOrderBtn) {
        trackOrderBtn.addEventListener('click', () => {
            const orderId = document.getElementById('order-id-input').value.trim();
            if (orderId) {
                simulateOrderTracking(orderId);
            } else {
                showToast("Por favor, ingresa un número de orden", "error");
            }
        });
    }

    // Theme toggle
    themeToggleBtn.addEventListener('click', handleThemeToggle);

    // Contact Form
    if (contactForm && document.getElementById('contact-name')) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('contact-name').value;
            if (name) {
                showToast(`Gracias por tu mensaje, ${name}. Te responderemos pronto.`);
                contactForm.reset();
            }
        });
    }

    // ==================== ANIMATIONS ON SCROLL ==================== 
    const animateOnScrollElements = document.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    animateOnScrollElements.forEach(element => {
        observer.observe(element);
    });

    // ==================== INICIALIZACIÓN ====================
    const init = () => {
        loadTheme();
        loadCartFromLocalStorage(); 
        if (document.getElementById('menu-grid')) {
            renderPageSpecificContent();
        }
        initProductDetail();
        if (document.getElementById('cart-items-container')) {
            renderCart();
        }
        if (document.getElementById('user-area')) {
            updateUserUI();
        }
    };

    init();
});

// ==========================================
// FUNCIONES DEL MODAL DE CHECKOUT
// ==========================================
function openModal() {
    const modal = document.getElementById('checkout-modal');
    modal.removeAttribute('hidden');
    
    // Enfocar el primer elemento interactivo
    const firstInput = modal.querySelector('input');
    if (firstInput) firstInput.focus();
}

function closeModal() {
    document.getElementById('checkout-modal').setAttribute('hidden', 'true');
    // Retornar el foco al botón que abrió el modal
    const cartToggleBtn = document.getElementById('cart-toggle-btn');
    if (cartToggleBtn) cartToggleBtn.focus();
}

// ==========================================
// EVENTOS PARA ACTIVAR EL MODAL
// ==========================================
// Esperamos a que todo el HTML cargue para asignar los clics
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Botón para CERRAR el modal (La "X" que pusiste en el HTML)
    const closeCheckoutBtn = document.getElementById('close-checkout');
    if (closeCheckoutBtn) {
        closeCheckoutBtn.addEventListener('click', closeModal);
    }

    // 2. Botón para ABRIR el modal (El botón de "Confirmar pedido" o "Pagar" que está dentro de tu carrito)
    // OJO: Cambia 'id-de-tu-boton-pagar' por el ID real del botón que está en tu carrito
    const btnPagarCarrito = document.getElementById('id-de-tu-boton-pagar'); 
    if (btnPagarCarrito) {
        btnPagarCarrito.addEventListener('click', openModal);
    }
});