const canvas = document.querySelector("#blocka-canvas");
const ctx = canvas.getContext("2d");

const playButton = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 60,
};

let gameState = "menu"; // menu, cargando, seleccion-dificultad, seleccion-imagen, jugando
let imagenSeleccionada = null;
let spinnerAngle = 0;
let imagenesListas = 0;
let dificultadSeleccionada = null;
let piezas = [];

// Opciones de dificultad globales
const opcionesDificultad = [
  { nivel: "Fácil", cuadros: 4, descripcion: "2x2" },
  { nivel: "Medio", cuadros: 9, descripcion: "3x3" },
  { nivel: "Difícil", cuadros: 16, descripcion: "4x4" },
];

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
  };

  image.onerror = () => {
    console.error(`❌ Error cargando: ${img.src}`);
  };
});

// Ajustar el tamaño del canvas al contenedor

// Redimensionar al cargar y cuando cambie el tamaño de la ventana

function drawUi() {
  // Fondo
  ctx.fillStyle = "#1e1e1e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (gameState === "menu") {
    drawMenu();
  } else if (gameState === "seleccion-dificultad") {
    seleccionarNivelDeDificultad();
  } else if (gameState === "seleccion-imagen") {
    mostrarSeleccionImagenes();
  } else if (gameState === "jugando") {
    playGame();
  }
}

function animarSeleccionImagen() {
  let contador = 0;
  const duracion = 120; // frames de animación (más rápido y suave que setInterval)
  let indiceActual = 0;

  function animar() {
    // Limpiar canvas
    ctx.fillStyle = "#1e1e1e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Título
    ctx.fillStyle = "white";
    ctx.font = "bold 36px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Seleccionando imagen al azar...", canvas.width / 2, 50);

    // Configuración de la grilla
    const cols = 3;
    const imgWidth = 150;
    const imgHeight = 150;
    const padding = 20;
    const startX =
      (canvas.width - (cols * imgWidth + (cols - 1) * padding)) / 2;
    const startY = 100;

    imagenes.forEach((img, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = startX + col * (imgWidth + padding);
      const y = startY + row * (imgHeight + padding);

      // Resaltar la imagen actual en la animación
      const esActual = index === indiceActual;

      ctx.fillStyle = esActual ? "#00aa00" : "#34495e";
      ctx.fillRect(x, y, imgWidth, imgHeight);

      // Dibujar imagen si está cargada
      if (img.loaded && img.element) {
        ctx.drawImage(img.element, x, y, imgWidth, imgHeight);

        // Overlay verde si es la actual
        if (esActual) {
          ctx.fillStyle = "rgba(0, 255, 0, 0.4)";
          ctx.fillRect(x, y, imgWidth, imgHeight);
        }
      }

      // Borde
      ctx.strokeStyle = esActual ? "#00ff00" : "#27ae60";
      ctx.lineWidth = esActual ? 5 : 2;
      ctx.strokeRect(x, y, imgWidth, imgHeight);
    });

    // Barra de progreso
    const barWidth = 300;
    const barHeight = 20;
    const barX = canvas.width / 2 - barWidth / 2;
    const barY = canvas.height - 100;

    ctx.fillStyle = "#2a2a2a";
    ctx.fillRect(barX, barY, barWidth, barHeight);

    ctx.fillStyle = "#00ff00";
    ctx.fillRect(barX, barY, (contador / duracion) * barWidth, barHeight);

    ctx.strokeStyle = "#00ff00";
    ctx.lineWidth = 2;
    ctx.strokeRect(barX, barY, barWidth, barHeight);

    contador++;

    // Cambiar índice cada 2-3 frames (más rápido al principio, más lento al final)
    const velocidad = contador < duracion * 0.7 ? 2 : 4;
    if (contador % velocidad === 0) {
      indiceActual = Math.floor(Math.random() * imagenes.length);
    }

    if (contador < duracion) {
      requestAnimationFrame(animar);
    } else {
      if (!imagenSeleccionada) {
        const indiceAleatorio = Math.floor(Math.random() * imagenes.length);
        imagenSeleccionada = imagenes[indiceAleatorio];
      }

      console.log(`✅ Imagen final seleccionada: ${imagenSeleccionada.src}`);

      // Mostrar imagen grande
      mostrarImagenGrandeYComenzar();
    }
  }

  animar();
}

function mostrarImagenGrandeYComenzar() {
  // Limpiar canvas
  ctx.fillStyle = "#1e1e1e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Título
  ctx.fillStyle = "#00ff00";
  ctx.font = "bold 48px Arial";
  ctx.textAlign = "center";
  ctx.fillText("¡Imagen seleccionada!", canvas.width / 2, 80);

  // Mostrar la imagen bien grande
  const bigImgSize = 400;
  const bigImgX = canvas.width / 2 - bigImgSize / 2;
  const bigImgY = canvas.height / 2 - bigImgSize / 2;

  if (imagenSeleccionada.loaded && imagenSeleccionada.element) {
    // Sombra
    ctx.shadowColor = "rgba(0, 255, 0, 0.5)";
    ctx.shadowBlur = 20;

    ctx.drawImage(
      imagenSeleccionada.element,
      bigImgX,
      bigImgY,
      bigImgSize,
      bigImgSize
    );

    // Resetear sombra
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
  }

  // Borde brillante
  ctx.strokeStyle = "#00ff00";
  ctx.lineWidth = 6;
  ctx.strokeRect(bigImgX, bigImgY, bigImgSize, bigImgSize);

  // Mensaje de inicio
  ctx.fillStyle = "#ffffff";
  ctx.font = "28px Arial";
  ctx.fillText("Preparando el juego...", canvas.width / 2, canvas.height - 60);

  // Después de 2 segundos, cambiar al estado de juego
  setTimeout(() => {
    gameState = "jugando";
    drawUi();
  }, 8000); // 2 segundos para ver la imagen
}

function mostrarImagenGrandeYComenzar() {
  // Limpiar canvas
  ctx.fillStyle = "#1e1e1e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Título
  ctx.fillStyle = "#00ff00";
  ctx.font = "bold 48px Arial";
  ctx.textAlign = "center";
  ctx.fillText("¡Imagen seleccionada!", canvas.width / 2, 80);

  // Mostrar la imagen bien grande
  const bigImgSize = 400;
  const bigImgX = canvas.width / 2 - bigImgSize / 2;
  const bigImgY = canvas.height / 2 - bigImgSize / 2;

  if (imagenSeleccionada.loaded && imagenSeleccionada.element) {
    // Sombra
    ctx.shadowColor = "rgba(0, 255, 0, 0.5)";
    ctx.shadowBlur = 20;

    ctx.drawImage(
      imagenSeleccionada.element,
      bigImgX,
      bigImgY,
      bigImgSize,
      bigImgSize
    );

    // Resetear sombra
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
  }

  // Borde brillante
  ctx.strokeStyle = "#00ff00";
  ctx.lineWidth = 6;
  ctx.strokeRect(bigImgX, bigImgY, bigImgSize, bigImgSize);

  // Mensaje de inicio
  ctx.fillStyle = "#ffffff";
  ctx.font = "28px Arial";
  ctx.fillText("Preparando el juego...", canvas.width / 2, canvas.height - 60);

  // Después de 2 segundos, cambiar al estado de juego
  setTimeout(() => {
    gameState = "jugando";
    drawUi();
  }, 2000); // 2 segundos para ver la imagen
}

function drawMenu() {
  // Actualizar posición del botón
  playButton.x = canvas.width / 2;
  playButton.y = canvas.height / 2;

  drawPlayButton(playButton.x, playButton.y, playButton.radius);

  // Texto instructivo
  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.textAlign = "center";
  ctx.fillText(
    "Toca en cualquier lugar para comenzar",
    canvas.width / 2,
    canvas.height - 50
  );
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
  // Limpiar canvas
  ctx.fillStyle = "#1e1e1e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Título
  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  ctx.textAlign = "center";
  ctx.fillText(
    "Selecciona una imagen o deja que el azar decida",
    canvas.width / 2,
    50
  );

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

    // Resaltar si está seleccionada
    const esSeleccionada = imagenSeleccionada === img;

    // Dibujar rectángulo de fondo
    ctx.fillStyle = esSeleccionada ? "#2c5f2d" : "#34495e";
    ctx.fillRect(x, y, imgWidth, imgHeight);

    // Dibujar imagen si está cargada
    if (img.loaded && img.element) {
      ctx.drawImage(img.element, x, y, imgWidth, imgHeight);
    } else {
      // Mostrar "Cargando..." si no está lista
      ctx.fillStyle = "white";
      ctx.font = "14px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Cargando...", x + imgWidth / 2, y + imgHeight / 2);
    }

    // Borde (verde brillante si está seleccionada)
    ctx.strokeStyle = esSeleccionada ? "#00ff00" : "#27ae60";
    ctx.lineWidth = esSeleccionada ? 4 : 2;
    ctx.strokeRect(x, y, imgWidth, imgHeight);

    // Checkmark si está seleccionada
    if (esSeleccionada) {
      ctx.fillStyle = "rgba(0, 255, 0, 0.3)";
      ctx.fillRect(x, y, imgWidth, imgHeight);

      ctx.fillStyle = "#00ff00";
      ctx.font = "bold 60px Arial";
      ctx.textAlign = "center";
      ctx.fillText("✓", x + imgWidth / 2, y + imgHeight / 2 + 20);
    }
  });

  // Botón de COMENZAR (siempre visible)
  const btnY = canvas.height - 140;
  const btnX = canvas.width / 2 - 150;
  const btnWidth = 300;
  const btnHeight = 60;

  // Guardar coordenadas del botón comenzar globalmente
  window.botonComenzarImagen = {
    x: btnX,
    y: btnY,
    width: btnWidth,
    height: btnHeight,
  };

  // Dibujar botón comenzar
  ctx.fillStyle = "#00aa00";
  ctx.fillRect(btnX, btnY, btnWidth, btnHeight);
  ctx.strokeStyle = "#00ff00";
  ctx.lineWidth = 3;
  ctx.strokeRect(btnX, btnY, btnWidth, btnHeight);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 32px Arial";
  ctx.textAlign = "center";
  ctx.fillText("COMENZAR", canvas.width / 2, btnY + 40);

  // Instrucciones
  ctx.fillStyle = "#666666";
  ctx.font = "18px Arial";
  ctx.textAlign = "center";
  ctx.fillText(
    imagenSeleccionada
      ? "Imagen seleccionada - Haz clic en COMENZAR"
      : "Haz clic en COMENZAR para selección aleatoria",
    canvas.width / 2,
    canvas.height - 80
  );

  ctx.fillText(
    "O selecciona una imagen manualmente",
    canvas.width / 2,
    canvas.height - 50
  );
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

  const espacioY = 80;
  const inicioY = 220;

  opcionesDificultad.forEach((opcion, index) => {
    const y = inicioY + index * espacioY;
    const rectX = canvas.width / 2 - 200;
    const rectY = y - 35;
    const rectWidth = 400;
    const rectHeight = 60;

    // Guardar coordenadas para clicks
    opcion.x = rectX;
    opcion.y = rectY;
    opcion.width = rectWidth;
    opcion.height = rectHeight;

    // Botón normal
    ctx.fillStyle = "#2a2a2a";
    ctx.fillRect(rectX, rectY, rectWidth, rectHeight);
    ctx.strokeStyle = "#4a4a4a";
    ctx.lineWidth = 2;
    ctx.strokeRect(rectX, rectY, rectWidth, rectHeight);

    // Borde de debug
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.strokeRect(opcion.x, opcion.y, opcion.width, opcion.height);

    // Texto
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 28px Arial";
    ctx.textAlign = "left";
    ctx.fillText(opcion.nivel, rectX + 20, y);

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
  // Limpiar canvas
  ctx.fillStyle = "#1e1e1e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (!dificultadSeleccionada || !imagenSeleccionada) {
    console.error("❌ Faltan datos para iniciar el juego");
    return;
  }

  // Si es la primera vez, inicializar las piezas
  if (piezas.length === 0) {
    inicializarPiezas();
  }

  // Título del juego
  ctx.fillStyle = "white";
  ctx.font = "bold 28px Arial";
  ctx.textAlign = "center";
  ctx.fillText(
    `BLOCKA - ${dificultadSeleccionada.nivel}`,
    canvas.width / 2,
    40
  );

  // Dibujar todas las piezas
  dibujarPiezas();

  // Información adicional
  ctx.fillStyle = "#888888";
  ctx.font = "18px Arial";
  ctx.fillText(
    `Click izquierdo: girar ← | Click derecho: girar →`,
    canvas.width / 2,
    canvas.height - 20
  );
}

function inicializarPiezas() {
  piezas = [];

  // Calcular el tamaño de la grilla según la dificultad
  const gridSize = Math.sqrt(dificultadSeleccionada.cuadros); // 2, 3 o 4

  // Tamaño del área de juego (dejamos margen para el título)
  const areaJuego = Math.min(canvas.width - 100, canvas.height - 150);
  const tamañoPieza = areaJuego / gridSize;

  // Posición inicial (centrado)
  const startX = (canvas.width - areaJuego) / 2;
  const startY = 80; // Debajo del título

  // Tamaño de cada sección de la imagen original
  const imagenWidth = imagenSeleccionada.element.width;
  const imagenHeight = imagenSeleccionada.element.height;
  const seccionWidth = imagenWidth / gridSize;
  const seccionHeight = imagenHeight / gridSize;

  // Crear las piezas
  for (let fila = 0; fila < gridSize; fila++) {
    for (let col = 0; col < gridSize; col++) {
      // Rotación aleatoria: 0, 90, 180 o 270 grados
      const rotacionesAleatorias = [0, 90, 180, 270];
      const rotacionAleatoria =
        rotacionesAleatorias[Math.floor(Math.random() * 4)];

      const pieza = {
        id: fila * gridSize + col,
        fila: fila,
        col: col,
        x: startX + col * tamañoPieza,
        y: startY + fila * tamañoPieza,
        ancho: tamañoPieza,
        alto: tamañoPieza,
        // Coordenadas en la imagen original
        imgX: col * seccionWidth,
        imgY: fila * seccionHeight,
        imgAncho: seccionWidth,
        imgAlto: seccionHeight,
        // Rotación actual y correcta
        rotacionActual: rotacionAleatoria,
        rotacionCorrecta: 0, // La rotación correcta siempre es 0 grados
      };

      piezas.push(pieza);
    }
  }

  console.log(
    `✅ ${piezas.length} piezas inicializadas con rotaciones aleatorias`
  );
}


function dibujarPiezas() {
  piezas.forEach((pieza) => {
    // Guardar el estado actual del contexto
    ctx.save();

    // Mover el origen al centro de la pieza para rotarla
    ctx.translate(pieza.x + pieza.ancho / 2, pieza.y + pieza.alto / 2);

    // Aplicar la rotación
    ctx.rotate((pieza.rotacionActual * Math.PI) / 180);

    // Dibujar la imagen centrada en el nuevo origen
    if (imagenSeleccionada.loaded && imagenSeleccionada.element) {
      ctx.drawImage(
        imagenSeleccionada.element,
        pieza.imgX,
        pieza.imgY,
        pieza.imgAncho,
        pieza.imgAlto, // Porción de la imagen original
        -pieza.ancho / 2,
        -pieza.alto / 2,
        pieza.ancho,
        pieza.alto // Dónde dibujarla (centrada)
      );
    }

    // Restaurar el estado del contexto
    ctx.restore();

    // Dibujar borde de la pieza (sin rotar)
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.strokeRect(pieza.x, pieza.y, pieza.ancho, pieza.alto);

  });
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

// Manejador único de clicks que delega según el estado
canvas.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();

  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  const mouseX = (e.clientX - rect.left) * scaleX;
  const mouseY = (e.clientY - rect.top) * scaleY;

  console.log(
    `Click en (${mouseX.toFixed(0)}, ${mouseY.toFixed(
      0
    )}) - Estado: ${gameState}`
  );

  if (gameState === "menu") handleMenuClick(mouseX, mouseY);
  else if (gameState === "seleccion-dificultad")
    handleDificultadClick(mouseX, mouseY);
  else if (gameState === "seleccion-imagen") handleImagenClick(mouseX, mouseY);
  else if (gameState === "jugando") {
    playGame(); // Aquí iría la lógica del juego
  }
});

function handleMenuClick(mouseX, mouseY) {
  console.log("✅ Avanzando a selección de dificultad");
  gameState = "seleccion-dificultad";
  drawUi();
}

function handleDificultadClick(mouseX, mouseY) {
  let encontrado = false;

  console.log(`Click en (${mouseX.toFixed(0)}, ${mouseY.toFixed(0)})`);

  console.log("Botones de dificultad:");
  opcionesDificultad.forEach((opcion) => {
    console.log(
      `  ${opcion.nivel}: x=${opcion.x}-${opcion.x + opcion.width}, y=${
        opcion.y
      }-${opcion.y + opcion.height}`
    );
  });

  for (const opcion of opcionesDificultad) {
    const dentroX = mouseX >= opcion.x && mouseX <= opcion.x + opcion.width;
    const dentroY = mouseY >= opcion.y && mouseY <= opcion.y + opcion.height;

    if (dentroX && dentroY) {
      dificultadSeleccionada = opcion;
      encontrado = true;
      console.log(
        `✅ Seleccionado: ${opcion.nivel} (${opcion.cuadros} cuadros)`
      );
      break; // salir del bucle al encontrar la opción
    }
  }

  if (encontrado) {
    console.log("✅ Avanzando a selección de imagen");
    gameState = "seleccion-imagen";
    drawUi();
  } else {
    console.log("❌ Click fuera de las opciones");
  }
}

function handleImagenClick(mouseX, mouseY) {
  // Primero verificar si se hizo clic en el botón COMENZAR
  if (window.botonComenzarImagen) {
    const btn = window.botonComenzarImagen;
    const dentroBoton =
      mouseX >= btn.x &&
      mouseX <= btn.x + btn.width &&
      mouseY >= btn.y &&
      mouseY <= btn.y + btn.height;

    if (dentroBoton) {
      animarSeleccionImagen();
      // Inicia la animación de selección aleatoria
      return;
    }
  }

  // Si no se hizo clic en el botón, verificar clicks en imágenes (solo para seleccionar, NO para comenzar el juego)

  imagenes.forEach((img, index) => {
    if (img.loaded && img.element) {
      const dentroX = mouseX >= img.x && mouseX <= img.x + img.width;
      const dentroY = mouseY >= img.y && mouseY <= img.y + img.height;

      if (dentroX && dentroY) {
        imagenSeleccionada = img;
        encontrado = true;
        console.log(`✅ Imagen ${index + 1} pre-seleccionada: ${img.src}`);
        drawUi(); // Solo redibuja para mostrar la selección visual
      }
    }
  });
}

function getMousePos(canvas, evt) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top,
  };
}

drawUi();
