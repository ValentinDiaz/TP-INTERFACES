class Game {
  constructor(ctx, width, height, config, canvas, menuInicio, gameUI) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.config = config;
    this.canvas = canvas;
    this.menuInicio = menuInicio;
    this.gameUI = gameUI;

    // Estado del juego
    this.tablero = null;
    this.fichaSeleccionada = null;
    this.movimientosValidos = [];
    this.piezasRestantes = 32;
    this.movimientos = 0;
    this.tiempoTranscurrido = 0;
    this.timerInterval = null;
    this.juegoActivo = true;
    this.animando = false;

    // Guardar referencia global
    window.juegoActual = this;

    // Inicializar
    this.inicializar();
  }

  inicializar() {
    // Crear tablero con las configuraciones
    this.tablero = new Tablero(this.ctx, this.width, this.height, this.config);

    // Contar piezas iniciales
    this.piezasRestantes = this.tablero.contarPiezas();

    // Configurar eventos
    this.configurarEventos();

    // Iniciar timer
    this.iniciarTimer();

    // Actualizar stats iniciales
    this.actualizarStats();

    // Dibujar
    this.dibujar();
  }

  configurarEventos() {
    this.canvas.addEventListener("mousedown", (e) => this.onMouseDown(e));
    this.canvas.addEventListener("mousemove", (e) => this.onMouseMove(e));
    this.canvas.addEventListener("mouseup", (e) => this.onMouseUp(e));
    this.canvas.addEventListener("mouseleave", (e) => this.onMouseUp(e));
  }

  // ¿Cuándo se activa? Cuando presionas (haces click) el botón del mouse sobre el canvas.¿Qué hace en el juego?
  // Detecta si clickeaste una ficha
  // Si hay ficha, la "agarra" (empieza a arrastrarla)
  // Guarda que estás arrastrando (this.arrastrando = true)
  // Calcula los movimientos válidos
  // Marca la casilla como seleccionada (amarilla)
  // Analogía: Es como cuando agarras una ficha física con tu mano.
  onMouseDown(e) {
    if (!this.juegoActivo || this.animando) return;

    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const casilla = this.tablero.obtenerCasillaEnPosicion(x, y);

    if (casilla && casilla.tienePieza()) {
      this.arrastrando = true;
      this.fichaArrastrada = casilla;
      this.fichaSeleccionada = casilla;
      this.movimientosValidos = this.tablero.obtenerMovimientosValidos(casilla);
      casilla.seleccionada = true;

      // Guardar posición original de la pieza
      const pieza = casilla.obtenerPieza();
      pieza.xOriginal = pieza.x;
      pieza.yOriginal = pieza.y;

      this.posicionMouse = { x, y };
      this.dibujar();
    }
  }

  // ¿Cuándo se activa? Cada vez que mueves el mouse sobre el canvas (mientras esté presionado o no).
  // ¿Qué hace en el juego?

  // Si estás arrastrando una ficha (this.arrastrando === true)
  // Actualiza la posición de la ficha para que siga al cursor
  // Redibuja todo para ver la ficha moviéndose

  // Analogía: Es como mover tu mano con la ficha agarrada. La ficha se mueve contigo.

 

  onMouseMove(e) {
    if (!this.arrastrando || !this.fichaArrastrada) return;

    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Mover la pieza con el mouse
    const pieza = this.fichaArrastrada.obtenerPieza();
    pieza.x = x;
    pieza.y = y;

    this.posicionMouse = { x, y };
    this.dibujar();
  }

  // Cuándo se activa? Cuando sueltas el botón del mouse.
  // ¿Qué hace en el juego?
  // Detecta dónde soltaste la ficha
  // Verifica si es un movimiento válido (una casilla verde)
  // Si es válido: Ejecuta el movimiento (salta y elimina ficha)
  // Si NO es válido: Regresa la ficha a su posición original
  // Limpia el estado de arrastre (this.arrastrando = false)

  // Analogía: Es cuando sueltas la ficha. Si la soltaste en un lugar válido, el movimiento se hace. Si no, vuelve a su lugar.
   // y ademas esta mouseLeave que es usa la misma funcion que mouseUp para que si se sale del canvas se suelte la ficha
  // this.canvas.addEventListener('mouseleave', (e) => this.onMouseUp(e));
  //
  // ¿Cuándo se activa?** Cuando el cursor sale del área del canvas (mientras estás arrastrando).

  // ¿Qué hace en el juego?
  // - Ejecuta lo mismo que `mouseup`
  // - Cancela el arrastre si sacas el mouse del canvas
  // - Regresa la ficha a su lugar original

  // **Analogía:** Si estás moviendo la ficha y tu mano sale de la mesa, la ficha vuelve automáticamente a su lugar.

  // ---

  // ## **Flujo completo del drag and drop:**
  // ```
  // 1. mousedown (presiono)
  //    ↓
  //    - Detecto la ficha clickeada
  //    - arrastrando = true
  //    - Guardo posición original
  //    - Muestro movimientos válidos (verdes)

  // 2. mousemove (muevo el mouse)
  //    ↓
  //    - Si arrastrando === true:
  //      - Actualizo posición de la pieza al cursor
  //      - Redibujo todo

  // 3. mouseup (suelto) o mouseleave (salgo del canvas)
  //    ↓
  //    - Detecto dónde solté
  //    - ¿Es movimiento válido?
  //      → SÍ: ejecuto movimiento
  //      → NO: regreso pieza a su lugar
  //    - arrastrando = false
  //    - Limpio selección
  // ```    
  onMouseUp(e) {
    if (!this.arrastrando || !this.fichaArrastrada) return;

    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const casilla = this.tablero.obtenerCasillaEnPosicion(x, y);
    const pieza = this.fichaArrastrada.obtenerPieza();

    // Verificar si es un movimiento válido
    const movimientoValido = this.movimientosValidos.find(
      (m) => m.destino === casilla
    );

    if (movimientoValido) {
      // Movimiento válido - ejecutar
      this.realizarMovimiento(movimientoValido);
    } else {
      // Movimiento inválido - regresar pieza a su lugar
      pieza.x = pieza.xOriginal;
      pieza.y = pieza.yOriginal;
    }

    // Limpiar estado de arrastre
    this.arrastrando = false;
    this.fichaArrastrada = null;
    this.deseleccionarFicha();
    this.dibujar();
  }

  seleccionarFicha(casilla) {
    this.fichaSeleccionada = casilla;
    this.movimientosValidos = this.tablero.obtenerMovimientosValidos(casilla);

    // Marcar casilla como seleccionada
    casilla.seleccionada = true;
  }

  deseleccionarFicha() {
    if (this.fichaSeleccionada) {
      this.fichaSeleccionada.seleccionada = false;
      this.fichaSeleccionada = null;
    }
    this.movimientosValidos = [];
  }

  realizarMovimiento(movimiento) {
    // Ejecutar movimiento en el tablero
    const exito = this.tablero.moverPieza(
      this.fichaSeleccionada,
      movimiento.destino,
      movimiento.saltada
    );

    if (exito) {
      // Actualizar estadísticas
      this.movimientos++;
      this.piezasRestantes = this.tablero.contarPiezas();
      this.actualizarStats();

      // Deseleccionar
      this.deseleccionarFicha();

      // Verificar fin del juego
      setTimeout(() => this.verificarFinJuego(), 100);
    }
  }

  verificarFinJuego() {
    // Verificar si hay movimientos disponibles
    const hayMovimientos = this.tablero.hayMovimientosDisponibles();

    if (!hayMovimientos) {
      this.juegoActivo = false;
      this.detenerTimer();
      this.finalizarJuego();
    }
  }

  finalizarJuego() {
    let titulo = "";
    let mensaje = "";

    if (this.piezasRestantes === 1) {
      titulo = "¡VICTORIA PERFECTA!";
      mensaje =
        `¡Increíble! Completaste el juego dejando solo 1 ficha.\n\n` +
        `Movimientos: ${this.movimientos}\n` +
        `Tiempo: ${formatTime(this.tiempoTranscurrido)}`;
    } else if (this.piezasRestantes <= 3) {
      titulo = "¡EXCELENTE!";
      mensaje =
        `¡Muy bien jugado! Quedaron ${this.piezasRestantes} fichas.\n\n` +
        `Movimientos: ${this.movimientos}\n` +
        `Tiempo: ${formatTime(this.tiempoTranscurrido)}`;
    } else if (this.piezasRestantes <= 5) {
      titulo = "¡BUEN INTENTO!";
      mensaje =
        `Quedaron ${this.piezasRestantes} fichas.\n\n` +
        `Movimientos: ${this.movimientos}\n` +
        `Tiempo: ${formatTime(this.tiempoTranscurrido)}`;
    } else {
      titulo = "FIN DEL JUEGO";
      mensaje =
        `No quedan más movimientos posibles.\n` +
        `Fichas restantes: ${this.piezasRestantes}\n\n` +
        `Movimientos: ${this.movimientos}\n` +
        `Tiempo: ${formatTime(this.tiempoTranscurrido)}`;
    }

    setTimeout(() => mostrarModal(titulo, mensaje), 300);
  }

  dibujar() {
    // Limpiar canvas
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Dibujar fondo
    this.dibujarFondo();

    // Dibujar tablero (sin la ficha arrastrada)
    for (let fila = 0; fila < this.tablero.filas; fila++) {
      for (let col = 0; col < this.tablero.columnas; col++) {
        const casilla = this.tablero.casillas[fila][col];
        if (casilla) {
          // Si es la ficha arrastrada, dibujar solo la casilla vacía
          if (this.arrastrando && casilla === this.fichaArrastrada) {
            casilla.dibujarSolo(); // Nuevo método en Casilla
          } else {
            casilla.dibujar();
          }
        }
      }
    }

    // Dibujar movimientos válidos
    if (this.fichaSeleccionada && this.movimientosValidos.length > 0) {
      this.dibujarMovimientosValidos();
    }

    // Dibujar la ficha arrastrada encima de todo
    if (this.arrastrando && this.fichaArrastrada) {
      const pieza = this.fichaArrastrada.obtenerPieza();
      pieza.dibujar();
    }
  }

  dibujarFondo() {
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
    gradient.addColorStop(0, this.config.fondo.color1);
    gradient.addColorStop(1, this.config.fondo.color2);

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  dibujarMovimientosValidos() {
    this.movimientosValidos.forEach((movimiento) => {
      const casilla = movimiento.destino;

      // Dibujar indicador de movimiento válido
      this.ctx.save();
      this.ctx.globalAlpha = 0.5;
      this.ctx.fillStyle = "#00ff00";
      this.ctx.beginPath();
      this.ctx.arc(casilla.x, casilla.y, casilla.radio * 0.6, 0, Math.PI * 2);
      this.ctx.fill();

      // Dibujar borde pulsante
      this.ctx.strokeStyle = "#00ff00";
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.arc(casilla.x, casilla.y, casilla.radio + 5, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.restore();
    });
  }

  iniciarTimer() {
    this.tiempoTranscurrido = 0;
    this.timerInterval = setInterval(() => {
      if (this.juegoActivo) {
        this.tiempoTranscurrido++;
        this.actualizarStats();
      }
    }, 1000);
  }

  detenerTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  actualizarStats() {
    actualizarStats(
      this.piezasRestantes,
      this.movimientos,
      this.tiempoTranscurrido
    );
  }

  reiniciar() {
    // Detener timer anterior
    this.detenerTimer();

    // Resetear variables
    this.fichaSeleccionada = null;
    this.movimientosValidos = [];
    this.movimientos = 0;
    this.tiempoTranscurrido = 0;
    this.juegoActivo = true;
    this.animando = false;

    // Reinicializar tablero
    this.tablero.reiniciar();
    this.piezasRestantes = this.tablero.contarPiezas();

    // Reiniciar timer
    this.iniciarTimer();

    // Actualizar stats
    this.actualizarStats();

    // Redibujar
    this.dibujar();
  }

  detener() {
    this.juegoActivo = false;
    this.detenerTimer();

    // Limpiar eventos
    this.canvas.replaceWith(this.canvas.cloneNode(true));

    // Actualizar referencia al canvas
    this.canvas = document.querySelector("#canvas");
  }
}
