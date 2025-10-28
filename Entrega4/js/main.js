document.addEventListener("DOMContentLoaded", () => {
  let temaSeleccionado = null;
  let fichaSeleccionada = null;

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

  function precargarImagen(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(`Error cargando imagen: ${url}`);
      img.src = url;
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

      // Resetear ficha seleccionada al cambiar de tema
      fichaSeleccionada = null;
      document
        .querySelectorAll(".ficha-seleccionable")
        .forEach((f) => f.classList.remove("selected"));
    });
  });

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("ficha-seleccionable")) {
      // Remover selección anterior de fichas
      document
        .querySelectorAll(".ficha-seleccionable")
        .forEach((f) => f.classList.remove("selected"));

      // Marcar ficha seleccionada
      e.target.classList.add("selected");

      // Guardar la URL de la ficha seleccionada
      fichaSeleccionada = e.target.getAttribute("data-ficha");
    }
  });

  // Botón de jugar
  boton.addEventListener("click", async () => {
    mensajeError.innerHTML = "";

    if (!temaSeleccionado) {
      mensajeError.innerHTML = "Selecciona un tema antes de iniciar.";
      return;
    }

    if (!fichaSeleccionada) {
      mensajeError.innerHTML = "Selecciona una ficha antes de iniciar.";
      return;
    }

    // Mostrar loading
    boton.disabled = true;
    boton.textContent = "Cargando...";

    try {
      // Precargar la imagen seleccionada
      const imagenCargada = await precargarImagen(fichaSeleccionada);

      // Ocultar menú y mostrar canvas
      menuInicio.classList.add("hidden");
      canvas.classList.remove("hidden");
      gameUI.classList.remove("hidden");

      const ctx = canvas.getContext("2d");
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      // Configuración de temas
      const temasConfig = {
        espacial: {
          fondo: { color1: "#1a1a3e", color2: "#0a0a1e" },
        },
        fuego: {
          fondo: { color1: "#3e1a1a", color2: "#1e0a0a" },
        },
      };

      // Iniciar el juego con la imagen seleccionada
      const config = {
        ...temasConfig[temaSeleccionado],
        imagenFicha: imagenCargada, // Pasar UNA sola imagen cargada
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
      mensajeError.innerHTML = "Error cargando la imagen. Verifica la ruta.";
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
