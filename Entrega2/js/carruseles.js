document.querySelectorAll(".carousel").forEach((carousel) => {
  const buttonPrev = carousel.querySelector('[data-button="button-prev"]');
  const buttonNext = carousel.querySelector('[data-button="button-next"]');
  const track = carousel.querySelector(".carousel-track");
  const carruselElement = carousel.querySelector(".carousel-list");
  const slickItems = carousel.querySelectorAll(".slick");

  // Establecer la posición inicial del track
  track.style.left = "30px";
  buttonPrev.classList.add("invisible");
  // Obtener el ancho de un item
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

    // Mover hacia adelante
    if (leftPosition > -(trackWidth - carruselWidth) && direction === 2) {
      track.style.left = `${leftPosition - slickWidth}px`;
    }
    // Mover hacia atrás
    else if (leftPosition < 0 && direction === 1) {
      track.style.left = `${leftPosition + slickWidth}px`;
    }
    if (track.style.left == "30px") {
      buttonPrev.classList.add("invisible");
    }
  }
});

let currentSlide = 0;
let games = [];
let autoplayInterval;

// Cargar juegos desde la API
async function loadGames() {
  try {
    const response = await fetch("https://vj.interfaces.jima.com.ar/api/v2");
    games = await response.json();

    console.log("Juegos disponibles:", games);

    // Limitar a los primeros 10 juegos para el carrusel
    games = games.slice(0, 10);

    renderCarruselGrande();
    createIndicators();
    // startAutoplay();
  } catch (error) {
    console.error("Error al obtener los juegos:", error);
    document.getElementById("carruselGrande").innerHTML =
      '<div class="error-message">Error al cargar los juegos. Por favor, intenta de nuevo.</div>';
  }
}

function renderCarruselGrande() {
  const carruselGrande = document.getElementById("carruselGrande");

  carruselGrande.innerHTML = `
                <button class="carrusel-grande-btn prev" onclick="moveCarruselGrande(-1)">‹</button>
                <button class="carrusel-grande-btn next" onclick="moveCarruselGrande(1)">›</button>
                <div class="carrusel-grande-inner" id="carruselGrandeInner">
                    ${games
                      .map(
                        (game) => `
                        <div class="carrusel-grande-item">
                            <img src="${
                              game.background_image_low_res ||
                              game.background_image ||
                              "https://via.placeholder.com/650x300?text=Sin+Imagen"
                            }" 
                                 alt="${game.name}"
                                 onerror="this.src='https://via.placeholder.com/650x300?text=Sin+Imagen'">
                            <div class="game-overlay">
                                <div class="game-title">${game.name}</div>
                                <div class="game-rating">⭐ Rating: ${
                                  game.rating || "N/A"
                                }</div>
                                <div class="game-description">${
                                  game.description ||
                                  "Sin descripción disponible"
                                }</div>
                                <button class="play-btn" onclick="playGame('${
                                  game.slug
                                }')">Play Now</button>
                            </div>
                        </div>
                    `
                      )
                      .join("")}
                </div>
            `;
}

function createIndicators() {
  const indicatorsContainer = document.getElementById("indicators");
  indicatorsContainer.innerHTML = "";

  games.forEach((_, index) => {
    const indicator = document.createElement("div");
    indicator.className = "indicator";
    if (index === 0) indicator.classList.add("active");
    indicator.onclick = () => goToSlide(index);
    indicatorsContainer.appendChild(indicator);
  });
}

function updateCarruselGrande() {
  const carruselGrandeInner = document.getElementById("carruselGrandeInner");
  if (carruselGrandeInner) {
    carruselGrandeInner.style.transform = `translateX(-${currentSlide * 100}%)`;

    // Actualizar indicadores
    document.querySelectorAll(".indicator").forEach((indicator, index) => {
      indicator.classList.toggle("active", index === currentSlide);
    });
  }
}

function moveCarruselGrande(direction) {
  currentSlide += direction;

  if (currentSlide < 0) {
    currentSlide = games.length - 1;
  } else if (currentSlide >= games.length) {
    currentSlide = 0;
  }

  updateCarruselGrande();
}

function goToSlide(index) {
  currentSlide = index;
  updateCarruselGrande();
}

loadGames();
