document.addEventListener('DOMContentLoaded', () => {
    let carrito = [];
    
    // ==========================================
    // MENÚ HAMBURGUESA RESPONSIVO (MÓVIL / TABLET)
    // ==========================================
    const btnMenu = document.getElementById('hamburger-btn');
    const mainNav = document.getElementById('main-nav');

    if (btnMenu && mainNav) {
        btnMenu.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            btnMenu.classList.toggle('active');
        });

        // Cerrar menú al hacer clic en cualquier enlace interno (incluido "Sobre Nosotros")
        document.querySelectorAll('.nav__link').forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                btnMenu.classList.remove('active');
            });
        });
    }

    // ==========================================
    // FILTROS DEL MENÚ (SECCIÓN "TODO" MUESTRA TODO)
    // ==========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            productCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // ==========================================
    // CARRITO Y MODALES
    // ==========================================
    const badgeCarrito = document.querySelector('.cart-badge');
    const btnToggleCarrito = document.getElementById('cart-toggle-btn');
    const cajonCarrito = document.getElementById('cart-drawer');
    const contenedorItems = document.getElementById('cart-items-container');
    const totalElemento = document.getElementById('cart-total');

    // Añadir directo desde la tarjeta
    document.querySelectorAll('.btn-add').forEach(boton => {
        boton.addEventListener('click', (e) => {
            const tarjeta = e.target.closest('.product-card');
            const titulo = tarjeta.querySelector('h3').innerText;
            const precioTexto = tarjeta.querySelector('.price').innerText.replace('Bs. ', '');
            agregarAlCarrito(titulo, parseFloat(precioTexto), 1);
        });
    });

    function agregarAlCarrito(titulo, precio, cantidad) {
        const existente = carrito.find(item => item.titulo === titulo);
        if (existente) existente.cantidad += cantidad;
        else carrito.push({ titulo, precio, cantidad });
        actualizarCarrito();
    }

    function actualizarCarrito() {
        const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
        if (badgeCarrito) badgeCarrito.innerText = totalItems;

        if (carrito.length === 0) {
            contenedorItems.innerHTML = '<p class="cart__empty-msg">Tu carrito está vacío.</p>';
            if(totalElemento) totalElemento.innerText = 'Bs. 0.00';
            document.getElementById('cart-subtotal').innerText = 'Bs. 0.00';
            return;
        }

        contenedorItems.innerHTML = '';
        let subtotal = 0;

        carrito.forEach((item, index) => {
            subtotal += (item.precio * item.cantidad);
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.style.cssText = "margin-bottom:15px; padding-bottom:15px; border-bottom:1px solid var(--border-color);";
            div.innerHTML = `
                <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                    <span style="font-weight:bold; font-size:0.9rem;">${item.titulo}</span>
                    <span>Bs. ${(item.precio * item.cantidad).toFixed(2)}</span>
                </div>
                <div style="display:flex; gap:10px; align-items:center;">
                    <button type="button" class="btn-restar" data-index="${index}" style="padding:2px 8px; cursor:pointer;">−</button>
                    <span>${item.cantidad}</span>
                    <button type="button" class="btn-sumar" data-index="${index}" style="padding:2px 8px; cursor:pointer;">+</button>
                    <button type="button" class="btn-eliminar" data-index="${index}" style="color:red; background:none; border:none; margin-left:auto; font-weight:bold; cursor:pointer;">×</button>
                </div>
            `;
            contenedorItems.appendChild(div);
        });

        document.getElementById('cart-subtotal').innerText = `Bs. ${subtotal.toFixed(2)}`;
        document.getElementById('cart-total').innerText = `Bs. ${(subtotal + 15).toFixed(2)}`;
        asignarEventosControles();
    }

    function asignarEventosControles() {
        document.querySelectorAll('.btn-sumar').forEach(btn => btn.addEventListener('click', (e) => {
            carrito[e.target.dataset.index].cantidad++;
            actualizarCarrito();
        }));
        document.querySelectorAll('.btn-restar').forEach(btn => btn.addEventListener('click', (e) => {
            const idx = e.target.dataset.index;
            if (carrito[idx].cantidad > 1) carrito[idx].cantidad--;
            else carrito.splice(idx, 1);
            actualizarCarrito();
        }));
        document.querySelectorAll('.btn-eliminar').forEach(btn => btn.addEventListener('click', (e) => {
            carrito.splice(e.target.dataset.index, 1);
            actualizarCarrito();
        }));
    }

    btnToggleCarrito.addEventListener('click', () => cajonCarrito.classList.add('open'));
    document.querySelector('.cart-drawer__close').addEventListener('click', () => cajonCarrito.classList.remove('open'));

    // Checkout & Tracking
    const modalCheckout = document.getElementById('checkout-modal');
    const checkoutForm = document.getElementById('checkout-form');
    const modalTracking = document.getElementById('tracking-modal');

    document.getElementById('checkout-btn').addEventListener('click', () => {
        if (carrito.length === 0) return alert("Agrega productos antes de pagar.");
        cajonCarrito.classList.remove('open');
        modalCheckout.showModal();
    });

    document.getElementById('close-checkout').addEventListener('click', () => modalCheckout.close());
    document.getElementById('close-tracking').addEventListener('click', () => modalTracking.close());

    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        modalCheckout.close();
        const randomCode = Math.floor(1000 + Math.random() * 9000);
        document.getElementById('track-code').innerText = `#${randomCode}`;
        modalTracking.showModal();
        carrito = [];
        actualizarCarrito();
        checkoutForm.reset();
    });

    // Modal Info Producto con Extras y Cantidades
    const modalInfo = document.getElementById('info-modal');
    let currentProduct = null, currentBasePrice = 0, currentQty = 1;
    const checkboxesExtras = document.querySelectorAll('.extra-checkbox');

    document.querySelectorAll('.btn-info').forEach(boton => {
        boton.addEventListener('click', (e) => {
            const tarjeta = e.target.closest('.product-card');
            currentProduct = tarjeta.querySelector('h3').innerText;
            currentBasePrice = parseFloat(tarjeta.querySelector('.price').innerText.replace('Bs. ', ''));
            document.getElementById('info-title').innerText = currentProduct;
            document.getElementById('info-desc').innerText = tarjeta.getAttribute('data-desc');
            currentQty = 1;
            document.getElementById('info-cantidad').innerText = currentQty;
            checkboxesExtras.forEach(cb => cb.checked = false);
            actualizarPrecioInfo();
            modalInfo.showModal();
        });
    });

    function actualizarPrecioInfo() {
        let extras = 0;
        checkboxesExtras.forEach(cb => { if(cb.checked) extras += parseFloat(cb.dataset.price); });
        document.getElementById('info-total-price').innerText = ((currentBasePrice + extras) * currentQty).toFixed(2);
    }

    checkboxesExtras.forEach(cb => cb.addEventListener('change', actualizarPrecioInfo));
    document.getElementById('info-btn-sumar').addEventListener('click', () => { currentQty++; document.getElementById('info-cantidad').innerText = currentQty; actualizarPrecioInfo(); });
    document.getElementById('info-btn-restar').addEventListener('click', () => { if(currentQty > 1) { currentQty--; document.getElementById('info-cantidad').innerText = currentQty; actualizarPrecioInfo(); }});
    
    document.getElementById('info-add-btn').addEventListener('click', () => {
        let precioFinal = currentBasePrice;
        let extrasTexto = [];
        checkboxesExtras.forEach(cb => {
            if(cb.checked) {
                precioFinal += parseFloat(cb.dataset.price);
                extrasTexto.push(cb.parentElement.innerText.split('(')[0].trim());
            }
        });
        let tituloCarrito = currentProduct;
        if(extrasTexto.length > 0) tituloCarrito += ` (+ ${extrasTexto.join(', ')})`;

        agregarAlCarrito(tituloCarrito, precioFinal, currentQty);
        modalInfo.close();
        cajonCarrito.classList.add('open');
    });

    document.getElementById('close-info').addEventListener('click', () => modalInfo.close());
    
    // Tema Oscuro / Claro y Login
    document.getElementById('theme-toggle-btn').addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const icon = document.querySelector('#theme-toggle-btn i');
        icon.className = document.body.classList.contains('dark-mode') ? 'fas fa-sun' : 'fas fa-moon';
    });

    const modalLogin = document.getElementById('login-modal');
    document.getElementById('login-btn').addEventListener('click', () => modalLogin.showModal());
    document.getElementById('close-login').addEventListener('click', () => modalLogin.close());
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        alert("Sesión iniciada con éxito");
        modalLogin.close();
    });
});