document.addEventListener('DOMContentLoaded', () => {
    let carrito = [];
    
    // Variables DOM
    const botonesAdd = document.querySelectorAll('.btn-add:not(#checkout-btn)');
    const badgeCarrito = document.querySelector('.cart-badge');
    const contenedorItems = document.getElementById('cart-items-container');
    const totalElemento = document.getElementById('cart-total');
    
    const btnToggleCarrito = document.getElementById('cart-toggle-btn');
    const cajonCarrito = document.getElementById('cart-drawer');
    const btnCerrarCajon = document.querySelector('.cart-drawer__close');
    
    const btnMenu = document.getElementById('hamburger-btn');
    const btnThemeToggle = document.getElementById('theme-toggle-btn');
    
    const btnCheckout = document.getElementById('checkout-btn');
    const modalCheckout = document.getElementById('checkout-modal'); 
    const btnCerrarModal = document.getElementById('close-checkout');
    const checkoutForm = document.getElementById('checkout-form');
    const errorContainer = document.getElementById('form-errors');

    // Variables de Modal de Sesión
    const btnLogin = document.getElementById('login-btn');
    const modalLogin = document.getElementById('login-modal');
    const btnCerrarLogin = document.getElementById('close-login');
    const formLogin = document.getElementById('login-form');

    // ==========================================
    // MODO OSCURO
    // ==========================================
    if (btnThemeToggle) {
        btnThemeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const icon = btnThemeToggle.querySelector('i');
            if (document.body.classList.contains('dark-mode')) {
                icon.className = 'fas fa-sun';
            } else {
                icon.className = 'fas fa-moon';
            }
        });
    }

    // ==========================================
    // MENÚ MÓVIL (P2 - Estado aria-expanded)
    // ==========================================
    if (btnMenu) {
        btnMenu.addEventListener('click', () => {
            const expandido = btnMenu.getAttribute('aria-expanded') === 'true';
            btnMenu.setAttribute('aria-expanded', !expandido);
            
            const nav = document.getElementById('main-nav');
            nav.classList.toggle('active');
            
            if (!expandido) {
                btnMenu.setAttribute('aria-label', 'Cerrar menú de navegación');
            } else {
                btnMenu.setAttribute('aria-label', 'Abrir menú de navegación');
            }
        });
    }

    // ==========================================
    // FUNCIONALIDAD LOGIN
    // ==========================================
    if (btnLogin && modalLogin) {
        btnLogin.addEventListener('click', () => modalLogin.showModal());
        btnCerrarLogin.addEventListener('click', () => {
            modalLogin.close();
            btnLogin.focus();
        });
        
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            alert("Sesión iniciada exitosamente (Demostración).");
            modalLogin.close();
            formLogin.reset();
        });
    }

    // ==========================================
    // CARRITO LATERAL (P1)
    // ==========================================
    if (btnToggleCarrito && cajonCarrito) {
        btnToggleCarrito.addEventListener('click', () => {
            cajonCarrito.classList.add('open'); 
            btnToggleCarrito.setAttribute('aria-expanded', 'true');
        });
    }
    
    if (btnCerrarCajon) {
        btnCerrarCajon.addEventListener('click', () => {
            cajonCarrito.classList.remove('open');
            btnToggleCarrito.setAttribute('aria-expanded', 'false');
            btnToggleCarrito.focus(); 
        });
    }

    // ==========================================
    // MODAL CHECKOUT (P1)
    // ==========================================
    if (btnCheckout && modalCheckout) {
        btnCheckout.addEventListener('click', () => {
            if (carrito.length === 0) return alert("Agrega productos antes de pagar.");
            cajonCarrito.classList.remove('open');
            modalCheckout.showModal(); 
        });
    }

    if (btnCerrarModal) {
        btnCerrarModal.addEventListener('click', () => {
            modalCheckout.close();
            btnToggleCarrito.focus();
        });
    }

    // ==========================================
    // VALIDACIÓN FORMULARIO (P3, P2)
    // ==========================================
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!checkoutForm.checkValidity()) {
                errorContainer.removeAttribute('hidden');
                errorContainer.innerText = "Error: Por favor completa Nombre, Teléfono y Dirección.";
                errorContainer.focus();
            } else {
                errorContainer.setAttribute('hidden', 'true');
                alert("¡Pedido registrado exitosamente!");
                carrito = [];
                actualizarCarrito();
                checkoutForm.reset();
                modalCheckout.close();
            }
        });
    }

    // ==========================================
    // LÓGICA DEL CARRITO (P1 Contexto ARIA)
    // ==========================================
    botonesAdd.forEach(boton => {
        boton.addEventListener('click', (e) => {
            const tarjeta = e.target.closest('.product-card');
            const titulo = tarjeta.querySelector('h3').innerText;
            const precioTexto = tarjeta.querySelector('.price').innerText.replace('Bs. ', '');
            const precio = parseFloat(precioTexto);

            const existente = carrito.find(item => item.titulo === titulo);
            if (existente) existente.cantidad++;
            else carrito.push({ titulo, precio, cantidad: 1 });

            actualizarCarrito();
        });
    });

    function actualizarCarrito() {
        const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
        if (badgeCarrito) badgeCarrito.innerText = totalItems;
        if (btnToggleCarrito) btnToggleCarrito.setAttribute('aria-label', `Abrir carrito, ${totalItems} productos`);

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
            
            // P1: Controles etiquetados dinámicamente con el nombre del producto
            div.innerHTML = `
                <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                    <span style="font-weight:bold;">${item.titulo}</span>
                    <span>Bs. ${(item.precio * item.cantidad).toFixed(2)}</span>
                </div>
                <div style="display:flex; gap:10px; align-items:center;">
                    <button type="button" class="btn-restar" data-index="${index}" aria-label="Restar un ${item.titulo}">−</button>
                    <span aria-hidden="true">${item.cantidad}</span>
                    <button type="button" class="btn-sumar" data-index="${index}" aria-label="Sumar un ${item.titulo}">+</button>
                    <button type="button" class="btn-eliminar" data-index="${index}" aria-label="Eliminar ${item.titulo} del carrito" style="color:red; border:none; margin-left:auto; font-weight:bold; font-size:1.2rem;">×</button>
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
});