document.addEventListener("DOMContentLoaded", () => {
  const navB = document.querySelector("#navBurger");
  const abrirburger = document.querySelector("#openBurger");
  const cerrarburger = document.querySelector("#closeBurger");
  const navU = document.querySelector("#navUser");
  const btnUser = document.querySelector("#toggleUser");

  console.log(abrirburger, cerrarburger, btnUser);

  abrirburger.addEventListener("click", () => {
    navB.classList.add("visible");
  });

  cerrarburger.addEventListener("click", () => {
    navB.classList.remove("visible");
  });

  btnUser.addEventListener("click", () => {
    navU.classList.toggle("visible");
  });

  const toggleCartBtn = document.getElementById("toggleCarrito");
  const carrito = document.getElementById("lista-carrito");
  const cartItems = document.getElementById("cartItems");
  const cartTotalAmount = document.getElementById("cartTotalAmount");
  const cartCount = document.getElementById("cartCount");

  let cart = [];

  // Abrir/cerrar carrito
  toggleCartBtn.addEventListener("click", () => {
    carrito.classList.toggle("active");
  });

  // Agregar productos
  // Agregar productos
  document.querySelectorAll(".addCart").forEach((icon) => {
    icon.addEventListener("click", () => {
      const card = icon.closest(".game-card");
      const nombre = card.querySelector(".card-title").textContent;
      const img = card.querySelector(".game-image").src;

      // Tomar el precio que aparece en la card
      const precioText = card.querySelector(".price-tag span").textContent;
      const precio = parseInt(precioText.replace("$", "")) || 0;

      // Agregar animación de rebote al ícono
      icon.classList.add("animate-add");

      // Agregar al carrito
      cart.push({ nombre, precio, img });
      renderCart();

      const checkIcon = card.querySelector(".addedCart");

      // Mostrar check PRIMERO, luego ocultar el carrito
      setTimeout(() => {
        // Hacer visible el check (sin hidden)
        checkIcon.classList.remove("hidden");
        checkIcon.classList.add("show-check", "pulse");

        // Ocultar el ícono del carrito
        icon.classList.add("hidden");
        icon.classList.remove("animate-add");

      }, 10 ); // Delay mínimo para que sea más fluido
    });
  });

  function renderCart() {
    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
      total += item.precio;

      // Crear div del item
      const div = document.createElement("div");
      div.className = "cart-item";

      // Tomar la imagen de la card
      const imgSrc = item.img || "assets/images/default.png";
      div.innerHTML = `
      <img src="${imgSrc}" alt="${item.nombre}" class="cart-item-image">
      <span>${item.nombre}</span>
      <span>$${item.precio}</span>
      <button onclick="removeItem(${index})">❌</button>
    `;

      cartItems.appendChild(div);
    });

    cartTotalAmount.textContent = `$${total}`;
    cartCount.textContent = cart.length;
  }

  // Función global para remover items
  window.removeItem = function (index) {
    cart.splice(index, 1);
    renderCart();
  };
});
