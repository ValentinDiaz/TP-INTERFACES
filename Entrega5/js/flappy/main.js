let game = null;

// ============================================
// FUNCIONES GLOBALES
// ============================================
function resetGame() {
  if (game) {
    game.reset();

    // Mostrar contador antes de reiniciar
    showCountdown(() => {
      game.start();
      console.log("✅ Juego reiniciado correctamente");
    });
  }
}

function volverMenu() {
  if (game) {
    game.isRunning = false;
    if (game.gameLoopId) {
      cancelAnimationFrame(game.gameLoopId);
    }
  }

  document.getElementById("gameArea").classList.add("hidden");
  document.getElementById("gameUI").classList.add("hidden");
  document.getElementById("gameOverScreen").classList.add("hidden");
  document.getElementById("menuInicio").classList.remove("hidden");

  document.querySelectorAll(".parallax-layer").forEach((layer) => {
    layer.style.animationPlayState = "paused";
  });

  if (game) {
    game.reset();
  }
}

function toggleInstructions() {
  const instructions = document.getElementById("instructions");
  if (instructions) {
    instructions.style.display =
      instructions.style.display === "none" ? "block" : "none";
  }
}

// ============================================
// NUEVA FUNCIÓN: MOSTRAR COUNTDOWN
// ============================================
function showCountdown(callback) {
  // Crear elemento de contador
  const countdownEl = document.createElement("div");
  countdownEl.id = "countdown";
  countdownEl.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 120px;
    font-weight: bold;
    color: #fff;
    text-shadow: 
      4px 4px 0px #000,
      -2px -2px 0px #000,
      2px -2px 0px #000,
      -2px 2px 0px #000;
    z-index: 1000;
    animation: countdownPulse 1s ease-in-out;
  `;

  document.getElementById("gameArea").appendChild(countdownEl);

  // Mostrar objetivo primero
  countdownEl.style.fontSize = "48px";
  countdownEl.style.color = "#fbbf24";
  countdownEl.textContent = "Objetivo: 50 puntos";

  setTimeout(() => {
    // Iniciar cuenta regresiva
    countdownEl.style.fontSize = "120px";
    countdownEl.style.color = "#fff";

    let count = 3;
    countdownEl.textContent = count;

    const countInterval = setInterval(() => {
      count--;

      if (count > 0) {
        countdownEl.textContent = count;
        // Reiniciar animación
        countdownEl.style.animation = "none";
        setTimeout(() => {
          countdownEl.style.animation = "countdownPulse 1s ease-in-out";
        }, 10);
      } else {
        countdownEl.textContent = "¡GO!";
        countdownEl.style.color = "#4ade80";

        setTimeout(() => {
          countdownEl.remove();
          if (callback) callback();
        }, 500);

        clearInterval(countInterval);
      }
    }, 1000);
  }, 2000); // Espera 2 segundos antes de empezar la cuenta
}

// ============================================
// FUNCIÓN MODIFICADA: START GAME
// ============================================
function startGame() {
  console.log("▶️ Iniciando nueva partida...");

  try {
    if (!game) {
      game = new Game();
      game.init();
    } else {
      game.reset();
    }

    // Ocultar menú y mostrar área de juego
    document.getElementById("menuInicio").classList.add("hidden");
    document.getElementById("gameArea").classList.remove("hidden");
    document.getElementById("gameUI").classList.remove("hidden");

    // Activar parallax
    document.querySelectorAll(".parallax-layer").forEach((layer) => {
      layer.style.animationPlayState = "running";
    });

    // Mostrar contador
    showCountdown(() => {
      game.start();
      console.log("✅ Juego iniciado correctamente");
    });
  } catch (error) {
    console.error("❌ Error al iniciar el juego:", error);
    const mensajeError = document.getElementById("mensajeError");
    if (mensajeError) {
      mensajeError.textContent = "Error al iniciar el juego";
      mensajeError.style.color = "#ff5252";
    }
  }
}

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  console.log("🎮 Cargando imágenes...");

  const btnJugar = document.getElementById("btnJugar");
  const instructions = document.getElementById("instructions");

  // Desactivar botón hasta que cargue todo
  btnJugar.disabled = true;
  btnJugar.textContent = "Cargando...";

  if (instructions) instructions.style.display = "none";

  // LISTA DE IMÁGENES DEL JUEGO
  const gameImages = [
    "assets/bird/FLYING.png",
    "assets/bird/DEATH.png",
    "assets/bird/ATTACK.png",
    "assets/bird/gold.png",
    "assets/bird/IdleLoop-Sheet.png",
    "assets/images/sky.png",
    "assets/images/snow.png",
    "assets/images/4_BG_mts.png",
    "assets/images/3_ice_castle.png",
    "assets/images/fog.png",
    "assets/images/2_foreground_mts.png",
    "assets/images/1_foreground_mts.png",
    "assets/images/snow_2.png",
  ];

  // Función para cargar imágenes
  function preloadImages(images, onComplete) {
    let loaded = 0;

    images.forEach((src) => {
      const img = new Image();
      img.src = src;

      img.onload = () => {
        loaded++;
        btnJugar.textContent = `Cargando...`;

        if (loaded === images.length) {
          onComplete();
        }
      };

      img.onerror = () => {
        console.warn("⚠️ No se pudo cargar:", src);
        loaded++;
      };
    });
  }

  // Cargar todas las imágenes antes de habilitar el juego
  preloadImages(gameImages, () => {
    console.log("✅ Todas las imágenes cargadas");

    btnJugar.disabled = false;
    btnJugar.textContent = "Jugar";

    btnJugar.addEventListener("click", startGame);
  });
});

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && game && game.isRunning) {
    e.preventDefault();
  }
});

const gameImages = [
  // -------- BIRD SPRITES --------
  "assets/bird/FLYING.png",
  "assets/bird/DEATH.png",
  "assets/bird/ATTACK.png",
  "assets/bird/gold.png",
  "assets/bird/IdleLoop-Sheet.png",

  // -------- PARALLAX BACKGROUNDS --------
  "assets/images/sky.png",
  "assets/images/snow.png",
  "assets/images/4_BG_mts.png",
  "assets/images/3_ice_castle.png",
  "assets/images/fog.png",
  "assets/images/2_foreground_mts.png",
  "assets/images/1_foreground_mts.png",
  "assets/images/snow_2.png",
];

async function preloadImages(imageList) {
  return new Promise((resolve) => {
    let loaded = 0;
    const total = imageList.length;

    const updateLoading = () => {
      const pct = Math.floor((loaded / total) * 100);
      const loadingText = document.getElementById("loadingText");
      if (loadingText) loadingText.textContent = `Cargando ${pct}%`;
    };

    updateLoading(); // mostrar 0%

    imageList.forEach((src) => {
      const img = new Image();
      img.onload = () => {
        loaded++;
        updateLoading();

        if (loaded === total) {
          resolve();
        }
      };
      img.onerror = () => {
        console.warn("No se pudo cargar:", src);
        loaded++;
        updateLoading();
        if (loaded === total) resolve();
      };
      img.src = src;
    });
  });
}

// Debug
window.debugGame = () => {
  if (game) {
    console.log("🔍 Estado del juego:", {
      isRunning: game.isRunning,
      score: game.score,
      lives: game.lives,
      moves: game.moves,
      pipes: game.pipes.length,
      birdPosition: game.bird ? { x: game.bird.x, y: game.bird.y } : null,
    });
  } else {
    console.log("⚠️ El juego no está inicializado");
  }
};
