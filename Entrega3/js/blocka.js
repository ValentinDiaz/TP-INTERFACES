const canvas = document.querySelector("#blocka-canvas");
const ctx = canvas.getContext("2d");

ctx.fillStyle = "#2c3e50";

const playButton = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  w: 160,
  h: 60,
};
const fullButton = {
  x: canvas.width - 140,
  y: canvas.height - 60,
  w: 120,
  h: 40,
};

let gameState = "menu";

function drawUi() {
  //fondo
  ctx.fillStyle = "#1e1e1e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  //boton play
  ctx.fillStyle = "#27ae60";
  if (gameState === "menu") {
    drawPlayButton(playButton.x, playButton.y, 60);
  } else if (gameState === "jugar") {
    playGame();
  }

  // --- Luego FULL ---

  drawFullButton(playButton.x, playButton.y, playButton.w, playButton.h);
}

function playGame() {
  console.log("Play button clicked");

  // Limpiar canvas
  ctx.fillStyle = "#1e1e1e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Texto centrado
  ctx.fillStyle = "white";
  ctx.font = "30px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Juego Iniciado", canvas.width / 2, canvas.height / 2);
}

function drawFullButton() {
  ctx.fillStyle = "#34495e";
  ctx.fillRect(fullButton.x, fullButton.y, fullButton.w, fullButton.h);
  ctx.fillStyle = "white";
  ctx.font = "18px sans-serif";
  ctx.fillText(
    "⛶ Full",
    fullButton.x + fullButton.w / 2 - 20,
    fullButton.y + fullButton.h / 2 + 6
  );
}

function drawPlayButton(x, y, radius) {
  // Círculo verde
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = "#27ae60";
  ctx.fill();
  ctx.closePath();

  // Triángulo blanco (símbolo de "play")
  ctx.beginPath();
  ctx.moveTo(x - radius / 3, y - radius / 2.2);
  ctx.lineTo(x + radius / 2, y);
  ctx.lineTo(x - radius / 3, y + radius / 2.2);
  ctx.closePath();
  ctx.fillStyle = "white";
  ctx.fill();
}

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  // --- Botón Play ---
  if (
    mouseX >= playButton.x - playButton.w / 2 &&
    mouseX <= playButton.x + playButton.w / 2 &&
    mouseY >= playButton.y - playButton.h / 2 &&
    mouseY <= playButton.y + playButton.h / 2
  ) {
    gameState = "jugar";
    drawUi();
    return;
  }

  // --- Botón Full ---
  if (
    mouseX >= fullButton.x &&
    mouseX <= fullButton.x + fullButton.w &&
    mouseY >= fullButton.y &&
    mouseY <= fullButton.y + fullButton.h
  ) {
    toggleFullscreen();
  }
});

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    // Pedimos pantalla completa para el canvas
    canvas.requestFullscreen().catch((err) => {
      console.error(`Error al entrar en pantalla completa: ${err.message}`);
    });
  } else {
    // Salir de pantalla completa
    document.exitFullscreen();
  }
}

drawUi();
