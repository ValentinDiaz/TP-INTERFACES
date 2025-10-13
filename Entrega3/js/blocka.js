const canvas = document.querySelector("#blocka-canvas");
const ctx = canvas.getContext("2d");

const playButton = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 60,
};

let gameState = "menu"; // menu, cargando, seleccion-dificultad, jugando
let imagenSeleccionada = null;
let spinnerAngle = 0;
let imagenesListas = 0;

const imagenes = [
  { src: "assets/images/dino1.jpg", loaded: false },
  { src: "assets/images/dino2.jpg", loaded: false },
  { src: "assets/images/dino3.jpg", loaded: false },
  { src: "assets/images/dino4.jpg", loaded: false },
  { src: "assets/images/dino5.jpg", loaded: false },
  { src: "assets/images/dino6.jpg", loaded: false },
];

// Cargar imágenes
imagenes.forEach((img, index) => {
  const image = new Image();
  image.src = img.src;
  image.onload = () => {
    img.loaded = true;
    img.element = image;
    imagenesListas++;

    // Cuando todas las imágenes estén cargadas, cambiar a selección
    if (imagenesListas === imagenes.length && gameState === "cargando") {
      gameState = "seleccion";
    }
  };
});

function drawUi() {
  // Fondo
  ctx.fillStyle = "#1e1e1e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (gameState === "menu") {
    drawPlayButton(playButton.x, playButton.y, playButton.radius);
  } else if (gameState === "jugar") {
    playGame();
  } else if (gameState === "cargando") {
    drawSpinner();
  } else if (gameState === "seleccion-dificultad") {
    seleccionarNivelDeDificultad();
  } 
}

function drawSpinner() {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = 40;

  // Texto "Cargando..."
  ctx.fillStyle = "white";
  ctx.font = "24px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Cargando imágenes...", centerX, centerY - 80);

  // Porcentaje de carga
  const porcentaje = Math.round((imagenesListas / imagenes.length) * 100);
  ctx.font = "18px sans-serif";
  ctx.fillText(`${porcentaje}%`, centerX, centerY + 80);

  // Círculo del spinner
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(spinnerAngle);

  // Arco del spinner
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 1.5);
  ctx.strokeStyle = "#27ae60";
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.stroke();

  ctx.restore();

  // Incrementar ángulo para animación
  spinnerAngle += 0.1;
}

function mostrarSeleccionImagenes() {
  // Título
  ctx.fillStyle = "white";
  ctx.font = "30px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Selecciona una imagen", canvas.width / 2, 50);

  // Configuración de la grilla (2 filas x 3 columnas)
  const cols = 3;
  const rows = 2;
  const imgWidth = 150;
  const imgHeight = 150;
  const padding = 20;
  const startX = (canvas.width - (cols * imgWidth + (cols - 1) * padding)) / 2;
  const startY = 100;

  imagenes.forEach((img, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    const x = startX + col * (imgWidth + padding);
    const y = startY + row * (imgHeight + padding);

    // Guardar coordenadas para detectar clicks
    img.x = x;
    img.y = y;
    img.width = imgWidth;
    img.height = imgHeight;

    // Dibujar rectángulo de fondo
    ctx.fillStyle = "#34495e";
    ctx.fillRect(x, y, imgWidth, imgHeight);

    // Dibujar imagen si está cargada
    if (img.loaded) {
      ctx.drawImage(img.element, x, y, imgWidth, imgHeight);
    } else {
      // Mostrar "Cargando..." si no está lista
      ctx.fillStyle = "white";
      ctx.font = "14px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Cargando...", x + imgWidth / 2, y + imgHeight / 2);
    }

    // Borde
    ctx.strokeStyle = "#27ae60";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, imgWidth, imgHeight);
  });
}

function seleccionarNivelDeDificultad() {
  // Limpiar canvas
  ctx.fillStyle = "#1e1e1e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Título
}

function seleccionarNivelDeDificultad() {
  // Limpiar canvas
  ctx.fillStyle = "#1e1e1e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Título
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 48px Arial";
  ctx.textAlign = "center";
  ctx.fillText("BLOCKA", canvas.width / 2, 100);

  // Subtítulo
  ctx.font = "24px Arial";
  ctx.fillStyle = "#cccccc";
  ctx.fillText("Selecciona la dificultad", canvas.width / 2, 160);

  // Opciones de dificultad
  const opciones = [
    { nivel: "Fácil", cuadros: 4, descripcion: "2x2" },
    { nivel: "Medio", cuadros: 9, descripcion: "3x3" },
    { nivel: "Difícil", cuadros: 16, descripcion: "4x4" },
  ];

  const espacioY = 80;
  const inicioY = 220;

  opciones.forEach((opcion, index) => {
    const y = inicioY + index * espacioY;
    const rectX = canvas.width / 2 - 200;
    const rectY = y - 35;
    const rectWidth = 400;
    const rectHeight = 60;

    // Botón
    ctx.fillStyle = "#2a2a2a";
    ctx.fillRect(rectX, rectY, rectWidth, rectHeight);
    ctx.strokeStyle = "#4a4a4a";
    ctx.lineWidth = 2;
    ctx.strokeRect(rectX, rectY, rectWidth, rectHeight);

    // Texto del nivel
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 28px Arial";
    ctx.textAlign = "left";
    ctx.fillText(opcion.nivel, rectX + 20, y);

    // Descripción
    ctx.fillStyle = "#888888";
    ctx.font = "20px Arial";
    ctx.textAlign = "right";
    ctx.fillText(opcion.descripcion, rectX + rectWidth - 20, y);
  });

  // Instrucción
  ctx.fillStyle = "#666666";
  ctx.font = "18px Arial";
  ctx.textAlign = "center";
  ctx.fillText(
    "Haz clic en una opción para comenzar",
    canvas.width / 2,
    canvas.height - 40
  );
}

function playGame() {


  mostrarSeleccionImagenes();

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
  // Si estamos en el menú, cualquier click arranca el juego
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  // Click en el botón Play del menú
  if (gameState === "menu") {
    gameState = "seleccion-dificultad";
    drawUi();
  }
});

drawUi();
