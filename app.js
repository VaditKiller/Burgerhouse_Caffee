document.addEventListener('DOMContentLoaded', () => {
    
    // VARIABLES GLOBALES
    let carrito = [];
    
    const botonesAdd = document.querySelectorAll('.btn-add:not(#btn-proceder-pago)');
    const badgeCarrito = document.querySelector('.cart-badge');
    const contenedorItems = document.getElementById('cart-items-container');
    const totalElemento = document.getElementById('cart-total');
    
    const btnAbrirCarrito = document.getElementById('cart-toggle-btn');
    const btnCerrarCarrito = document.getElementById('close-cart-btn');
    const cajonCarrito = document.getElementById('cart-drawer');

    const modalCheckout = document.getElementById('checkout-modal');
    const btnAbrirModal = document.getElementById('btn-proceder-pago');
    const btnCerrarModal = document.getElementById('close-checkout');

    const btnMenuMovil = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('main-nav');

    // ==========================================
    // 1. MENÚ MÓVIL ACCESIBLE
    // ==========================================
    if (btnMenuMovil && navMenu) {
        btnMenuMovil.addEventListener('click', () => {
            const isExpanded = btnMenuMovil.getAttribute('aria-expanded') === 'true';
            btnMenuMovil.setAttribute('aria-expanded', !isExpanded);
            
            if (isExpanded) {
                navMenu.setAttribute('hidden', 'true');
            } else {
                navMenu.removeAttribute('hidden');
            }
        });
    }

    // ==========================================
    // 2. ABRIR / CERRAR CARRITO
    // ==========================================
    if (btnAbrirCarrito) {
        btnAbrirCarrito.addEventListener('click', () => {
            cajonCarrito.classList.add('open');
            btnAbrirCarrito.setAttribute('aria-expanded', 'true');
        });
    }

    if (btnCerrarCarrito) {
        btnCerrarCarrito.addEventListener('click', () => {
            cajonCarrito.classList.remove('open');
            btnAbrirCarrito.setAttribute('aria-expanded', 'false');
            btnAbrirCarrito.focus(); // Retorna el foco
        });
    }

    // ==========================================
    // 3. ABRIR / CERRAR MODAL DE PAGO
    // ==========================================
    function openModal() {
        if(carrito.length === 0) return alert("Tu carrito está vacío");
        
        modalCheckout.removeAttribute('hidden');
        cajonCarrito.classList.remove('open'); // Cierra el carrito
        
        // Foco al primer input
        const firstInput = modalCheckout.querySelector('input');
        if (firstInput) firstInput.focus();
    }

    function closeModal() {
        modalCheckout.setAttribute('hidden', 'true');
        btnAbrirCarrito.focus();
    }

    if (btnAbrirModal) btnAbrirModal.addEventListener('click', openModal);
    if (btnCerrarModal) btnCerrarModal.addEventListener('click', closeModal);

    // ==========================================
    // 4. LÓGICA DE AÑADIR AL CARRITO
    // ==========================================
    botonesAdd.forEach(boton => {
        boton.addEventListener('click', (e) => {
            const tarjeta = e.target.closest('.product-card');
            const titulo = tarjeta.querySelector('h3').innerText;
            const precioTexto = tarjeta.querySelector('p').innerText.replace('Bs. ', '');
            const precio = parseFloat(precioTexto);

            const itemExistente = carrito.find(item => item.titulo === titulo);
            if (itemExistente) {
                itemExistente.cantidad++;
            } else {
                carrito.push({ titulo, precio, cantidad: 1 });
            }
            actualizarCarrito();
        });
    });

    // ==========================================
    // 5. ACTUALIZAR PANEL DEL CARRITO Y ACCESIBILIDAD
    // ==========================================
    function actualizarCarrito() {
        const totalProductos = carrito.reduce((acc, item) => acc + item.cantidad, 0);
        
        if (badgeCarrito) badgeCarrito.innerText = totalProductos;
        if (btnAbrirCarrito) btnAbrirCarrito.setAttribute('aria-label', `Abrir carrito, ${totalProductos} productos`);

        if (carrito.length === 0) {
            contenedorItems.innerHTML = '<p>Tu carrito está vacío.</p>';
            if(totalElemento) totalElemento.innerText = 'Bs. 0.00';
            return;
        }

        contenedorItems.innerHTML = '';
        let totalPrecio = 0;

        carrito.forEach((item, index) => {
            totalPrecio += (item.precio * item.cantidad);
            
            // Inyectamos HTML con etiquetas ARIA corregidas para los controles del carrito
            const div = document.createElement('div');
            div.style.cssText = "display:flex; justify-content:space-between; margin-bottom:15px; border-bottom:1px solid #ddd; padding-bottom:10px;";
            div.innerHTML = `
                <div><strong>${item.titulo}</strong> <br> Bs. ${(item.precio * item.cantidad).toFixed(2)}</div>
                <div style="display:flex; gap:10px; align-items:center;">
                    <button type="button" class="btn-restar" data-index="${index}" aria-label="Disminuir cantidad de ${item.titulo}" style="padding:2px 8px;">−</button>
                    <span>${item.cantidad}</span>
                    <button type="button" class="btn-sumar" data-index="${index}" aria-label="Aumentar cantidad de ${item.titulo}" style="padding:2px 8px;">+</button>
                    <button type="button" class="btn-eliminar" data-index="${index}" aria-label="Eliminar ${item.titulo}" style="color:red; font-weight:bold; border:none; background:none;">×</button>
                </div>
            `;
            contenedorItems.appendChild(div);
        });

        if(totalElemento) totalElemento.innerText = `Bs. ${totalPrecio.toFixed(2)}`;
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
                if (carrito[idx].cantidad > 1) {
                    carrito[idx].cantidad--;
                } else {
                    carrito.splice(idx, 1);
                }
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

    // ==========================================
    // 6. VALIDACIÓN DEL FORMULARIO DE CHECKOUT
    // ==========================================
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault(); 
            // Valida usando HTML5
            if (!this.checkValidity()) {
                alert("Por favor, completa todos los campos requeridos (*)");
                return;
            }
            alert("¡Pedido realizado con éxito!");
            carrito = []; // Vacía el carrito
            actualizarCarrito();
            closeModal();
        });
    }
});