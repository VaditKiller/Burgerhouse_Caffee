document.addEventListener('DOMContentLoaded', () => {
    
    // Variables globales
    let carrito = [];
    
    const botonesAdd = document.querySelectorAll('.btn-add');
    const badgeCarrito = document.querySelector('.cart-badge');
    const contenedorItems = document.getElementById('cart-items-container');
    const totalElemento = document.getElementById('cart-total');
    
    const btnToggleCarrito = document.getElementById('cart-toggle-btn');
    const cajonCarrito = document.getElementById('cart-drawer');
    const btnCerrarCajon = document.querySelector('.cart-drawer__close');
    
    const btnMenu = document.getElementById('hamburger-btn');
    
    const btnCheckout = document.getElementById('checkout-btn');
    const modalCheckout = document.getElementById('checkout-modal'); // Elemento <dialog> nativo
    const btnCerrarModal = document.getElementById('close-checkout');
    const checkoutForm = document.getElementById('checkout-form');
    const errorContainer = document.getElementById('form-errors');

    // ==========================================
    // P2: ESTADO ACCESIBLE DEL MENÚ MÓVIL
    // ==========================================
    if (btnMenu) {
        btnMenu.addEventListener('click', () => {
            const expandido = btnMenu.getAttribute('aria-expanded') === 'true';
            btnMenu.setAttribute('aria-expanded', !expandido);
            btnMenu.setAttribute('aria-label', expandido ? 'Abrir menú de navegación' : 'Cerrar menú de navegación');
            
            // Asume que tienes una clase .active o similar en tu CSS original
            btnMenu.classList.toggle('active'); 
            document.querySelector('.nav').classList.toggle('active');
        });
    }

    // ==========================================
    // P1: ABRIR/CERRAR CARRITO (Gestión de estado)
    // ==========================================
    if (btnToggleCarrito && cajonCarrito) {
        btnToggleCarrito.addEventListener('click', () => {
            // Asume que tu CSS original usa la clase .open
            cajonCarrito.classList.add('open'); 
            btnToggleCarrito.setAttribute('aria-expanded', 'true');
        });
    }
    
    if (btnCerrarCajon) {
        btnCerrarCajon.addEventListener('click', () => {
            cajonCarrito.classList.remove('open');
            btnToggleCarrito.setAttribute('aria-expanded', 'false');
            btnToggleCarrito.focus(); // Retorna el foco al botón que lo abrió
        });
    }

    // ==========================================
    // P1: MODAL DE CHECKOUT (Foco nativo con <dialog>)
    // ==========================================
    if (btnCheckout && modalCheckout) {
        btnCheckout.addEventListener('click', () => {
            if (carrito.length === 0) return alert("Agrega productos antes de pagar.");
            
            cajonCarrito.classList.remove('open'); // Cerrar panel lateral
            
            // showModal() es nativo de HTML5: atrapa el foco y crea el overlay de fondo
            modalCheckout.showModal(); 
        });
    }

    if (btnCerrarModal) {
        btnCerrarModal.addEventListener('click', () => {
            modalCheckout.close();
            btnToggleCarrito.focus(); // Retorna foco
        });
    }

    // ==========================================
    // P3: VALIDACIÓN EXPLICATIVA DEL FORMULARIO
    // ==========================================
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('user-name').value;
            const phone = document.getElementById('user-phone').value;
            const address = document.getElementById('address').value;

            if (!name || !phone || !address) {
                errorContainer.removeAttribute('hidden');
                errorContainer.innerText = "Error: Por favor completa el nombre, teléfono y dirección obligatorios.";
                // Mueve el foco al contenedor de error para que lo lea el asistente
                errorContainer.setAttribute('tabindex', '-1');
                errorContainer.focus();
            } else {
                errorContainer.setAttribute('hidden', 'true');
                alert("¡Pedido registrado exitosamente!");
                carrito = [];
                actualizarCarrito();
                modalCheckout.close();
            }
        });
    }

    // ==========================================
    // LÓGICA DEL CARRITO Y P1 (CONTROLES)
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
            if(totalElemento) totalElemento.innerText = 'Bs. 15.00'; // Solo base de envío
            return;
        }

        contenedorItems.innerHTML = '';
        let subtotal = 0;

        carrito.forEach((item, index) => {
            subtotal += (item.precio * item.cantidad);
            
            // P1: Botones generados dinámicamente con aria-label descriptivo y type="button"
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <div class="cart-item-details">
                    <span class="product-name" style="font-weight:600; display:block;">${item.titulo}</span>
                    <span class="product-price">Bs. ${(item.precio * item.cantidad).toFixed(2)}</span>
                </div>
                <div class="controls" style="display:flex; align-items:center; gap:8px;">
                    <button type="button" class="btn-restar" data-index="${index}" aria-label="Disminuir cantidad de ${item.titulo}">−</button>
                    <span aria-hidden="true">${item.cantidad}</span>
                    <button type="button" class="btn-sumar" data-index="${index}" aria-label="Aumentar cantidad de ${item.titulo}">+</button>
                    <button type="button" class="btn-eliminar" data-index="${index}" aria-label="Eliminar ${item.titulo} del pedido" style="margin-left: 10px;">×</button>
                </div>
            `;
            contenedorItems.appendChild(div);
        });

        // Cálculos estéticos basados en tu HTML original
        const envio = 15;
        const totalFinal = subtotal + envio;
        document.getElementById('cart-subtotal').innerText = `Bs. ${subtotal.toFixed(2)}`;
        document.getElementById('cart-total').innerText = `Bs. ${totalFinal.toFixed(2)}`;

        asignarEventosControles();
    }

    function asignarEventosControles() {
        document.querySelectorAll('.btn-sumar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                carrito[e.target.dataset.index].cantidad++;
                actualizarCarrito();
            });
        });
        document.querySelectorAll('.btn-restar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.target.dataset.index;
                if (carrito[idx].cantidad > 1) carrito[idx].cantidad--;
                else carrito.splice(idx, 1);
                actualizarCarrito();
            });
        });
        document.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                carrito.splice(e.target.dataset.index, 1);
                actualizarCarrito();
            });
        });
    }
});