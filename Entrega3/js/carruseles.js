document.querySelectorAll(".carousel").forEach((carousel) => {
  const buttonPrev = carousel.querySelector('[data-button="button-prev"]');
  const buttonNext = carousel.querySelector('[data-button="button-next"]');
  const track = carousel.querySelector(".carousel-track");
  const carruselElement = carousel.querySelector(".carousel-list");
  const slickItems = carousel.querySelectorAll(".slick");

  track.style.left = "30px";
  buttonPrev.classList.add("invisible");
  const slickWidth = slickItems[0].offsetWidth;

  buttonPrev.onclick = () => moveTrack(1);
  buttonNext.onclick = () => moveTrack(2);

  function moveTrack(direction) {
    if (track.style.left == "30px") {
      buttonPrev.classList.add("invisible");
    }
    buttonPrev.classList.remove("invisible");
    const trackWidth = track.scrollWidth;
    const carruselWidth = carruselElement.offsetWidth;
    let leftPosition =
      track.style.left === ""
        ? 0
        : parseFloat(track.style.left.replace("px", ""));

    if (leftPosition > -(trackWidth - carruselWidth) && direction === 2) {
      track.style.left = `${leftPosition - slickWidth}px`;
    } else if (leftPosition < 0 && direction === 1) {
      track.style.left = `${leftPosition + slickWidth}px`;
    }
    if (track.style.left == "30px") {
      buttonPrev.classList.add("invisible");
    }
  }
});

let currentSlide = 0;
let games = [];
let isAnimating = false;

async function loadGames() {
  try {
    const response = await fetch("https://vj.interfaces.jima.com.ar/api/v2");
    games = await response.json();

    console.log("Juegos disponibles:", games);
    games = games.slice(0, 10);

    renderCarruselCoverflow();
    createIndicators();
  } catch (error) {
    console.error("Error al obtener los juegos:", error);
    document.getElementById("carruselGrande").innerHTML =
      '<div class="error-message">Error al cargar los juegos. Por favor, intenta de nuevo.</div>';
  }
}

function renderCarruselCoverflow() {
  const carruselGrande = document.getElementById("carruselGrande");

  carruselGrande.innerHTML = `
    <button class="coverflow-btn coverflow-btn-prev" onclick="moveCarruselGrande(-1)">‹</button>
    <button class="coverflow-btn coverflow-btn-next" onclick="moveCarruselGrande(1)">›</button>
    <div class="coverflow-viewport">
      <div class="coverflow-inner" id="coverflowInner">
        ${games
          .map(
            (game, index) => `
              <div class="coverflow-item ${
                index === 0 ? "active" : ""
              }" data-index="${index}" onclick="goToSlide(${index})">
                <div class="coverflow-card">
                  <img src="${
                    game.background_image_low_res ||
                    game.background_image ||
                    "https://via.placeholder.com/600x350?text=Sin+Imagen"
                  }" 
                       alt="${game.name}"
                       onerror="this.src='https://via.placeholder.com/600x350?text=Sin+Imagen'">
                  <div class="game-overlay">
                    <div class="game-content">
                      <div class="game-title">${game.name}</div>
                      <div class="game-rating">⭐ ${game.rating || "N/A"}</div>
                      <div class="game-description">${
                        game.description
                          ? game.description.substring(0, 120) + "..."
                          : "Sin descripción disponible"
                      }</div>
                      <button class="play-btn" onclick="event.stopPropagation(); playGame('${
                        game.slug
                      }')">Play Now</button>
                    </div>
                  </div>
                </div>
              </div>
            `
          )
          .join("")}
      </div>
    </div>
  `;

  updateCoverflowPositions();
}

function createIndicators() {
  const indicatorsContainer = document.getElementById("indicators");
  if (!indicatorsContainer) return;

  indicatorsContainer.innerHTML = "";

  games.forEach((_, index) => {
    const indicator = document.createElement("div");
    indicator.className = "indicator";
    if (index === 0) indicator.classList.add("active");
    indicator.onclick = () => goToSlide(index);
    indicatorsContainer.appendChild(indicator);
  });
}

function updateCoverflowPositions() {
  const items = document.querySelectorAll(".coverflow-item");
  const totalItems = items.length;

  // Detectar tamaño de pantalla y ajustar valores
  const screenWidth = window.innerWidth;
  let spacing, depth, farSpacing, farDepth, hiddenSpacing, hiddenDepth, scale;

  //Variables importantes:

  // spacing: desplazamiento horizontal de los items cercanos al central.

  // depth: distancia hacia atrás (translateZ) de los items cercanos.

  // farSpacing / farDepth: posición y profundidad de los items más lejanos (los que se ven un poco detrás).

  // hiddenSpacing / hiddenDepth: items que están muy alejados y prácticamente no se ven.

  if (screenWidth < 768) {
    // Mobile
    spacing = 200;
    depth = 120;
    farSpacing = 350;
    farDepth = 220;
    hiddenSpacing = 450;
    hiddenDepth = 300;
    scale = 1;
  } else if (screenWidth < 1024) {
    // Tablet
    spacing = 320;
    depth = 160;
    farSpacing = 550;
    farDepth = 280;
    hiddenSpacing = 700;
    hiddenDepth = 400;
    scale = 1;
  } else {
    // Desktop
    spacing = 420;
    depth = 200;
    farSpacing = 720;
    farDepth = 350;
    hiddenSpacing = 900;
    hiddenDepth = 500;
    scale = 1;
  }

  items.forEach((item, index) => {
    let offset = index - currentSlide;
    //offset → diferencia entre la carta actual y la carta central
    // Efecto circular: si estamos en el primer item, mostrar el último a la izquierda
    if (offset < -Math.floor(totalItems / 2)) {
      offset += totalItems;
    } else if (offset > Math.floor(totalItems / 2)) {
      offset -= totalItems;
    }

    item.classList.remove("active", "left", "right", "far-left", "far-right");

    if (offset === 0) {
      // Item central (activo)
      item.classList.add("active");
      item.style.transform = `translateX(0) translateZ(0) rotateY(0deg) scale(${scale})`;
      item.style.opacity = "1";
      item.style.zIndex = "10";
      item.style.pointerEvents = "auto";
    } else if (offset === -1) {
      // Un item a la izquierda
      item.classList.add("left");
      item.style.transform = `translateX(-${spacing}px) translateZ(-${depth}px) rotateY(45deg) scale(0.85)`;
      item.style.opacity = "0.7";
      item.style.zIndex = "9";
      item.style.pointerEvents = "auto";
    } else if (offset === 1) {
      // Un item a la derecha
      item.classList.add("right");
      item.style.transform = `translateX(${spacing}px) translateZ(-${depth}px) rotateY(-45deg) scale(0.85)`;
      item.style.opacity = "0.7";
      item.style.zIndex = "9";
      item.style.pointerEvents = "auto";
    } else if (offset === -2) {
      // Dos items a la izquierda
      item.classList.add("far-left");
      item.style.transform = `translateX(-${farSpacing}px) translateZ(-${farDepth}px) rotateY(55deg) scale(0.65)`;
      item.style.opacity = "0.4";
      item.style.zIndex = "8";
      item.style.pointerEvents = "auto";
    } else if (offset === 2) {
      // Dos items a la derecha
      item.classList.add("far-right");
      item.style.transform = `translateX(${farSpacing}px) translateZ(-${farDepth}px) rotateY(-55deg) scale(0.65)`;
      item.style.opacity = "0.4";
      item.style.zIndex = "8";
      item.style.pointerEvents = "auto";
    } else {
      // Items muy alejados (ocultos)
      if (offset < 0) {
        item.style.transform = `translateX(-${hiddenSpacing}px) translateZ(-${hiddenDepth}px) rotateY(60deg) scale(0.5)`;
      } else {
        item.style.transform = `translateX(${hiddenSpacing}px) translateZ(-${hiddenDepth}px) rotateY(-60deg) scale(0.5)`;
      }
      item.style.opacity = "0";
      item.style.zIndex = "1";
      item.style.pointerEvents = "none";
    }
  });

  // Actualizar indicadores
  const indicators = document.querySelectorAll(".indicator");
  indicators.forEach((indicator, index) => {
    if (index === currentSlide) {
      indicator.classList.add("active");
      indicator.style.animation = "indicatorPulse 0.4s ease";
      setTimeout(() => (indicator.style.animation = ""), 400);
    } else {
      indicator.classList.remove("active");
    }
  });
}

function moveCarruselGrande(direction) {
  if (isAnimating) return;
  isAnimating = true;

  currentSlide += direction;

  if (currentSlide < 0) {
    currentSlide = games.length - 1;
  } else if (currentSlide >= games.length) {
    currentSlide = 0;
  }

  updateCoverflowPositions();

  // Animar botones
  const btn =
    direction < 0
      ? document.querySelector(".coverflow-btn-prev")
      : document.querySelector(".coverflow-btn-next");

  if (btn) {
    btn.style.animation = "btnClick 0.3s ease";
    setTimeout(() => (btn.style.animation = ""), 300);
  }

  setTimeout(() => {
    isAnimating = false;
  }, 600);
}

function goToSlide(index) {
  if (isAnimating || index === currentSlide) return;
  isAnimating = true;

  currentSlide = index;
  updateCoverflowPositions();

  setTimeout(() => {
    isAnimating = false;
  }, 600);
}

loadGames();

// Recalcular posiciones en resize
let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    updateCoverflowPositions();
  }, 250);
});
