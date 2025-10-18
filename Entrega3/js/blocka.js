const canvas = document.querySelector("#blocka-canvas");
const ctx = canvas.getContext("2d");

const playButton = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 60,
};

// Variables globales

let gameState = "menu"; // menu, cargando, seleccion-dificultad, seleccion-imagen, jugando
let imagenSeleccionada = null;
let spinnerAngle = 0;
let imagenesListas = 0;
let dificultadSeleccionada = null;
let piezas = [];
let tiempoLimite = null;
let tiempoTranscurrido = 0;
let intervaloTemporizador = null;
let juegoCompletado = false;
let records = {}; // Récords por nivel
let nivelActual = 1; // Contador de niveles
let filtrosActivos = true;

// Opciones de dificultad globales
const opcionesDificultad = [
  { nivel: "Fácil", cuadros: 4, descripcion: "2x2", tiempoLimite: null }, // Sin límite
  { nivel: "Medio", cuadros: 9, descripcion: "3x3", tiempoLimite: 40000 }, // 40 segundos
  { nivel: "Difícil", cuadros: 16, descripcion: "4x4", tiempoLimite: 30000 }, // 30 segundos
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

//funciones de dibujo de ui

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
    mostarGame();
  } else if (gameState === "victoria") {
    mostrarPantallaVictoria();
  } else if (gameState === "derrota") {
    // ⬅️ AGREGAR
    mostrarPantallaDerrota();
  }
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

 

}

function mostarGame() {
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

  let colorTemporizador = "#00ff00"; // Verde por defecto

  if (tiempoLimite) {
    const porcentajeRestante = (tiempoTranscurrido / tiempoLimite) * 100;

    if (porcentajeRestante <= 20) {
      colorTemporizador = "#ff0000"; // Rojo crítico
    } else if (porcentajeRestante <= 50) {
      colorTemporizador = "#ff9900"; // Naranja advertencia
    } else {
      colorTemporizador = "#00ff00"; // Verde normal
    }
  }

  ctx.fillStyle = colorTemporizador;
  ctx.font = "bold 36px Arial";
  ctx.textAlign = "center";
  ctx.fillText(formatearTiempo(tiempoTranscurrido), canvas.width / 2, 80);

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
    iniciarTemporizador();
    gameState = "jugando";
    drawUi();
  }, 3000); // 3 segundos para ver la imagen
}

function mostrarPantallaVictoria() {
  // Limpiar canvas
  ctx.fillStyle = "#1e1e1e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Título de felicitaciones
  ctx.fillStyle = "#FFD700"; // Dorado
  ctx.font = "bold 60px Arial";
  ctx.textAlign = "center";
  ctx.fillText("¡FELICITACIONES!", canvas.width / 2, 80);

  ctx.fillStyle = "#00ff00";
  ctx.font = "bold 36px Arial";
  ctx.fillText("¡Completaste el nivel!", canvas.width / 2, 130);

  // Mostrar la imagen completa SIN filtros
  const imgSize = 300;
  const imgX = canvas.width / 2 - imgSize / 2;
  const imgY = 160;

  if (imagenSeleccionada.loaded && imagenSeleccionada.element) {
    ctx.shadowColor = "rgba(0, 255, 0, 0.6)";
    ctx.shadowBlur = 30;
    ctx.drawImage(imagenSeleccionada.element, imgX, imgY, imgSize, imgSize);
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
  }

  ctx.strokeStyle = "#00ff00";
  ctx.lineWidth = 5;
  ctx.strokeRect(imgX, imgY, imgSize, imgSize);

  // Tiempo final
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 32px Arial";
  ctx.fillText(
    `⏱️ Tiempo: ${formatearTiempo(tiempoTranscurrido)}`,
    canvas.width / 2,
    imgY + imgSize + 50
  );

  // Guardar y mostrar récord
  const nivelKey = `${dificultadSeleccionada.nivel}-${nivelActual}`;

  if (!records[nivelKey] || tiempoTranscurrido < records[nivelKey]) {
    records[nivelKey] = tiempoTranscurrido;
    ctx.fillStyle = "#FFD700"; // Dorado
    ctx.font = "bold 28px Arial";
    ctx.fillText("🏆 ¡NUEVO RÉCORD!", canvas.width / 2, imgY + imgSize + 90);
  } else {
    ctx.fillStyle = "#888888";
    ctx.font = "24px Arial";
    ctx.fillText(
      `Récord anterior: ${formatearTiempo(records[nivelKey])}`,
      canvas.width / 2,
      imgY + imgSize + 90
    );
  }

  // Botones
  const btnWidth = 280;
  const btnHeight = 70;
  const btnY = canvas.height - 120;
  const espacioEntreBotones = 40;

  // Botón VOLVER AL MENÚ
  window.botonMenu = {
    x: canvas.width / 2 - btnWidth - espacioEntreBotones / 2,
    y: btnY,
    width: btnWidth,
    height: btnHeight,
  };

  ctx.fillStyle = "#555555";
  ctx.fillRect(botonMenu.x, botonMenu.y, botonMenu.width, botonMenu.height);
  ctx.strokeStyle = "#888888";
  ctx.lineWidth = 3;
  ctx.strokeRect(botonMenu.x, botonMenu.y, botonMenu.width, botonMenu.height);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 26px Arial";
  ctx.fillText(
    "VOLVER AL MENÚ",
    botonMenu.x + botonMenu.width / 2,
    botonMenu.y + 44
  );

  // Botón SIGUIENTE NIVEL
  window.botonSiguiente = {
    x: canvas.width / 2 + espacioEntreBotones / 2,
    y: btnY,
    width: btnWidth,
    height: btnHeight,
  };

  ctx.fillStyle = "#00aa00";
  ctx.fillRect(
    botonSiguiente.x,
    botonSiguiente.y,
    botonSiguiente.width,
    botonSiguiente.height
  );
  ctx.strokeStyle = "#00ff00";
  ctx.lineWidth = 3;
  ctx.strokeRect(
    botonSiguiente.x,
    botonSiguiente.y,
    botonSiguiente.width,
    botonSiguiente.height
  );

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 26px Arial";
  ctx.fillText(
    "SIGUIENTE NIVEL ➡️",
    botonSiguiente.x + botonSiguiente.width / 2,
    botonSiguiente.y + 44
  );

  // Cambiar estado
  gameState = "victoria";
}

function mostrarPantallaDerrota() {
  ctx.fillStyle = "#1e1e1e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Título de derrota
  ctx.fillStyle = "#ff0000";
  ctx.font = "bold 60px Arial";
  ctx.textAlign = "center";
  ctx.fillText("¡TIEMPO AGOTADO!", canvas.width / 2, 100);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 36px Arial";
  ctx.fillText("No completaste el nivel a tiempo", canvas.width / 2, 160);

  // Mostrar la imagen (parcialmente resuelta)
  const imgSize = 300;
  const imgX = canvas.width / 2 - imgSize / 2;
  const imgY = 200;

  if (imagenSeleccionada.loaded && imagenSeleccionada.element) {
    ctx.shadowColor = "rgba(255, 0, 0, 0.4)";
    ctx.shadowBlur = 20;
    ctx.drawImage(imagenSeleccionada.element, imgX, imgY, imgSize, imgSize);
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
  }

  ctx.strokeStyle = "#ff0000";
  ctx.lineWidth = 5;
  ctx.strokeRect(imgX, imgY, imgSize, imgSize);

  // Botones
  const btnWidth = 280;
  const btnHeight = 70;
  const btnY = canvas.height - 120;
  const espacioEntreBotones = 40;

  // Botón VOLVER AL MENÚ
  window.botonMenu = {
    x: canvas.width / 2 - btnWidth - espacioEntreBotones / 2,
    y: btnY,
    width: btnWidth,
    height: btnHeight,
  };

  ctx.fillStyle = "#555555";
  ctx.fillRect(botonMenu.x, botonMenu.y, botonMenu.width, botonMenu.height);
  ctx.strokeStyle = "#888888";
  ctx.lineWidth = 3;
  ctx.strokeRect(botonMenu.x, botonMenu.y, botonMenu.width, botonMenu.height);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 26px Arial";
  ctx.fillText(
    "VOLVER AL MENÚ",
    botonMenu.x + botonMenu.width / 2,
    botonMenu.y + 44
  );

  // Botón REINTENTAR
  window.botonReintentar = {
    x: canvas.width / 2 + espacioEntreBotones / 2,
    y: btnY,
    width: btnWidth,
    height: btnHeight,
  };

  ctx.fillStyle = "#ff6600";
  ctx.fillRect(
    botonReintentar.x,
    botonReintentar.y,
    botonReintentar.width,
    botonReintentar.height
  );
  ctx.strokeStyle = "#ff9900";
  ctx.lineWidth = 3;
  ctx.strokeRect(
    botonReintentar.x,
    botonReintentar.y,
    botonReintentar.width,
    botonReintentar.height
  );

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 26px Arial";
  ctx.fillText(
    "REINTENTAR 🔄",
    botonReintentar.x + botonReintentar.width / 2,
    botonReintentar.y + 44
  );

  // Cambiar estado
  gameState = "derrota";
}

//funciones de manejo de click

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
    handleGameClick(mouseX, mouseY, "izquierdo");
  } else if (gameState === "victoria") {
    handleVictoriaMenuClick(mouseX, mouseY);
  } else if (gameState === "derrota") {
    handleDerrotaClick(mouseX, mouseY);
  }

  // Event listener para click derecho
  canvas.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (gameState === "jugando") {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      const mouseX = (e.clientX - rect.left) * scaleX;
      const mouseY = (e.clientY - rect.top) * scaleY;

      handleGameClick(mouseX, mouseY, "derecho"); // Click derecho
    }
  });
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
}

function handleGameClick(mouseX, mouseY, tipoClick) {
  // No permitir clicks si ya ganó

  // Buscar qué pieza se clickeó
  let piezaClicada = null;

  for (const pieza of piezas) {
    if (
      mouseX >= pieza.x &&
      mouseX <= pieza.x + pieza.ancho &&
      mouseY >= pieza.y &&
      mouseY <= pieza.y + pieza.alto
    ) {
      piezaClicada = pieza;
      break;
    }
  }

  if (piezaClicada) {
    // Rotar la pieza según el tipo de click
    if (tipoClick === "izquierdo") {
      // Girar a la izquierda (antihorario) -90°
      piezaClicada.rotacionActual -= 90;
      console.log(`↺ Pieza ${piezaClicada.id} girada a la izquierda`);
    } else if (tipoClick === "derecho") {
      // Girar a la derecha (horario) +90°
      piezaClicada.rotacionActual += 90;
      console.log(`↻ Pieza ${piezaClicada.id} girada a la derecha`);
    }

    // Mantener la rotación entre 0 y 360
    if (piezaClicada.rotacionActual >= 360) {
      piezaClicada.rotacionActual -= 360;
    } else if (piezaClicada.rotacionActual < 0) {
      piezaClicada.rotacionActual += 360;
    }

    console.log(`  → Rotación actual: ${piezaClicada.rotacionActual}°`);

    // Redibujar
    drawUi();

    // Verificar si ganó
    if (verificarVictoria()) {
      console.log("🏆 ¡Victoria! Todas las piezas en posición correcta.");
      detenerTemporizador(); // ⬅️ AGREGAR ESTA LÍNEA
      filtrosActivos = false; // Quitar filtros al ganar
      gameState = "victoria";
      drawUi();
    }
  }
}

function handleDerrotaClick(mouseX, mouseY) {
  // Verificar click en botón VOLVER AL MENÚ
  if (window.botonMenu) {
    const btn = window.botonMenu;
    if (
      mouseX >= btn.x &&
      mouseX <= btn.x + btn.width &&
      mouseY >= btn.y &&
      mouseY <= btn.y + btn.height
    ) {
      console.log("🏠 Volviendo al menú de dificultad");
      reiniciarJuego();
      gameState = "seleccion-dificultad";
      drawUi();
      return;
    }
  }

  // Verificar click en botón REINTENTAR
  if (window.botonReintentar) {
    const btn = window.botonReintentar;
    if (
      mouseX >= btn.x &&
      mouseX <= btn.x + btn.width &&
      mouseY >= btn.y &&
      mouseY <= btn.y + btn.height
    ) {
      console.log("🔄 Reintentando nivel");
      reintentarNivel();
      return;
    }
  }
}

//funciones auxiliares

function reintentarNivel() {
  // Reiniciar pero mantener dificultad e imagen
  piezas = [];
  tiempoInicio = null;
  tiempoTranscurrido = 0;
  juegoCompletado = false;
  filtrosActivos = true;
  if (intervaloTemporizador) {
    clearInterval(intervaloTemporizador);
    intervaloTemporizador = null;
  }

  console.log(
    `🔄 Reintentando - Dificultad: ${dificultadSeleccionada.nivel} - Imagen: ${imagenSeleccionada.src}`
  );

  mostrarImagenGrandeYComenzar();
}

function verificarVictoria() {
  return piezas.every(
    (pieza) => pieza.rotacionActual === pieza.rotacionCorrecta
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

function handleVictoriaMenuClick(mouseX, mouseY) {
  // Verificar click en botón VOLVER AL MENÚ
  if (window.botonMenu) {
    const btn = window.botonMenu;
    if (
      mouseX >= btn.x &&
      mouseX <= btn.x + btn.width &&
      mouseY >= btn.y &&
      mouseY <= btn.y + btn.height
    ) {
      console.log("🏠 Volviendo al menú de dificultad");
      reiniciarJuego();
      gameState = "seleccion-dificultad";
      drawUi();
      return;
    }
  }

  // Verificar click en botón SIGUIENTE NIVEL
  if (window.botonSiguiente) {
    const btn = window.botonSiguiente;
    if (
      mouseX >= btn.x &&
      mouseX <= btn.x + btn.width &&
      mouseY >= btn.y &&
      mouseY <= btn.y + btn.height
    ) {
      console.log("➡️ Siguiente nivel");
      siguienteNivel();
      return;
    }
  }
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

function iniciarTemporizador() {
  tiempoInicio = Date.now();

  // Si hay tiempo límite, usar ese; si no, empezar desde 0
  if (dificultadSeleccionada.tiempoLimite) {
    tiempoLimite = dificultadSeleccionada.tiempoLimite;
    tiempoTranscurrido = tiempoLimite;
  } else {
    tiempoLimite = null;
    tiempoTranscurrido = 0;
  }

  intervaloTemporizador = setInterval(() => {
    if (!juegoCompletado) {
      const tiempoActual = Date.now();
      const diferencia = tiempoActual - tiempoInicio;

      if (tiempoLimite) {
        // Modo regresivo (cuenta atrás)
        tiempoTranscurrido = tiempoLimite - diferencia;

        // Si se acabó el tiempo
        if (tiempoTranscurrido <= 0) {
          tiempoTranscurrido = 0;
          detenerTemporizador();
          mostrarPantallaDerrota();
          return;
        }
      } else {
        // Modo normal (cuenta hacia adelante)
        tiempoTranscurrido = diferencia;
      }

      drawUi();
    }
  }, 100);

  console.log(
    tiempoLimite
      ? `⏱️ Temporizador regresivo iniciado: ${formatearTiempo(tiempoLimite)}`
      : "⏱️ Temporizador normal iniciado"
  );
}

function detenerTemporizador() {
  if (intervaloTemporizador) {
    clearInterval(intervaloTemporizador);
    intervaloTemporizador = null;
  }
  juegoCompletado = true;
  console.log(
    `⏱️ Temporizador detenido: ${formatearTiempo(tiempoTranscurrido)}`
  );
}

function formatearTiempo(milisegundos) {
  const segundosTotales = Math.floor(milisegundos / 1000);
  const minutos = Math.floor(segundosTotales / 60);
  const segundos = segundosTotales % 60;
  const centesimas = Math.floor((milisegundos % 1000) / 10);

  return `${minutos.toString().padStart(2, "0")}:${segundos
    .toString()
    .padStart(2, "0")}.${centesimas.toString().padStart(2, "0")}`;
}

function dibujarPiezas() {
  piezas.forEach((pieza) => {
    // Guardar el estado actual del contexto
    ctx.save();

    //FILTRO DE PRUEBA
    ctx.filter = "grayscale(1)";

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

function reiniciarJuego() {
  piezas = [];
  tiempoInicio = null;
  tiempoTranscurrido = 0;
  juegoCompletado = false;
  filtrosActivos = true;
  nivelActual = 1; // Resetear nivel
  if (intervaloTemporizador) {
    clearInterval(intervaloTemporizador);
    intervaloTemporizador = null;
  }
  imagenSeleccionada = null;
  dificultadSeleccionada = null; // Resetear dificultad también
  console.log("🔄 Juego reiniciado - Volviendo a selección de dificultad");
}

function siguienteNivel() {
  // Incrementar nivel
  nivelActual++;

  // Buscar la siguiente imagen (rotar entre las disponibles)
  const indiceActual = imagenes.indexOf(imagenSeleccionada);
  const siguienteIndice = (indiceActual + 1) % imagenes.length;

  // Reiniciar valores pero MANTENER la dificultad
  piezas = [];
  tiempoInicio = null;
  tiempoTranscurrido = 0;
  juegoCompletado = false;
  filtrosActivos = true;
  if (intervaloTemporizador) {
    clearInterval(intervaloTemporizador);
    intervaloTemporizador = null;
  }

  imagenSeleccionada = imagenes[siguienteIndice];

  console.log(
    `📸 Nivel ${nivelActual} - Dificultad: ${dificultadSeleccionada.nivel} - Imagen: ${imagenSeleccionada.src}`
  );

  // Mostrar imagen grande y comenzar
  mostrarImagenGrandeYComenzar();
}

// Manejador único de clicks que delega según el estado

drawUi();
