document.addEventListener("DOMContentLoaded", () => {
  let temaSeleccionado = null;

  const mensajeError = document.querySelector("#mensajeError");
  const canvas = document.querySelector("#canvas");
  const menuInicio = document.querySelector("#menuInicio");
  const gameUI = document.querySelector("#gameUI");
  const boton = document.querySelector("#btnJugar");

  const temasConfig = {
    espacial: {
      imagenes: ["assets/images/ficha1.jpg", "assets/images/ficha2.jpg"],
      fondo: { color1: "#1a1a3e", color2: "#0a0a1e" },
    },
  };

  function precargarImagenes(urls) {
    return new Promise((resolve, reject) => {
      const imagenes = [];
      let cargadas = 0;
      const total = urls.length;

      if (total === 0) {
        resolve([]);
        return;
      }

      urls.forEach((url, index) => {
        const img = new Image();
        img.onload = () => {
          cargadas++;
          if (cargadas === total) {
            resolve(imagenes);
          }
        };
        img.onerror = () => {
          reject(`Error cargando imagen: ${url}`);
        };
        img.src = url;
        imagenes[index] = img;
      });
    });
  }

  // Seleccionar tema de fichas
  const temas = document.querySelectorAll(".tema-option");

  temas.forEach((tema) => {
    tema.addEventListener("click", () => {
      // Remover selección anterior
      temas.forEach((t) => t.classList.remove("selected"));

      // Marcar como seleccionado
      tema.classList.add("selected");

      // Guardar tema seleccionado
      temaSeleccionado = tema.getAttribute("data-tema");
    });
  });

  // Botón de jugar
  boton.addEventListener("click", async () => {
    mensajeError.innerHTML = "";

    if (!temaSeleccionado) {
      mensajeError.innerHTML = "Selecciona un tema de fichas antes de iniciar.";
      return;
    }

    // Mostrar loading
    boton.disabled = true;
    boton.textContent = "Cargando...";

    try {
      // Precargar imágenes del tema seleccionado
      const imagenesConfig = temasConfig[temaSeleccionado];
      const imagenesCargadas = await precargarImagenes(imagenesConfig.imagenes);

      // Ocultar menú y mostrar canvas
      menuInicio.classList.add("hidden");
      canvas.classList.remove("hidden");
      gameUI.classList.remove("hidden");

      const ctx = canvas.getContext("2d");
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      // Crear config con imágenes cargadas
      const config = {
        ...imagenesConfig,
        imagenesCargadas: imagenesCargadas, // Pasar las imágenes ya cargadas
      };

      const juego = new Game(
        ctx,
        canvasWidth,
        canvasHeight,
        config,
        canvas,
        menuInicio,
        gameUI
      );
    } catch (error) {
      mensajeError.innerHTML =
        "Error cargando las imágenes. Verifica las rutas.";
      console.error(error);
    } finally {
      boton.disabled = false;
      boton.textContent = "JUGAR";
    }
  });
});

// Funciones globales para los botones HTML
function resetGame() {
  if (window.juegoActual) {
    window.juegoActual.reiniciar();
  }
}

function volverMenu() {
  if (window.juegoActual) {
    window.juegoActual.detener();
  }

  const canvas = document.querySelector("#canvas");
  const menuInicio = document.querySelector("#menuInicio");
  const gameUI = document.querySelector("#gameUI");
  const instructions = document.querySelector("#instructions");

  canvas.classList.add("hidden");
  menuInicio.classList.remove("hidden");
  gameUI.classList.add("hidden");
  instructions.style.display = "none";

  // Limpiar selección de temas
  document
    .querySelectorAll(".tema-option")
    .forEach((t) => t.classList.remove("selected"));
}

function toggleInstructions() {
  const instructions = document.querySelector("#instructions");
  if (
    instructions.style.display === "none" ||
    instructions.style.display === ""
  ) {
    instructions.style.display = "block";
  } else {
    instructions.style.display = "none";
  }
}

function actualizarStats(piezas, movimientos, tiempo) {
  document.getElementById("piecesCount").textContent = piezas;
  document.getElementById("movesCount").textContent = movimientos;
  document.getElementById("timer").textContent = formatTime(tiempo);
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
}

function mostrarModal(titulo, mensaje) {
  // Aquí puedes implementar tu modal personalizado
  // O usar alert por ahora
  alert(`${titulo}\n\n${mensaje}`);
}
